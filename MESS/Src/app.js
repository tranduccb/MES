const path = require('path')
const express = require('express')
const morgan = require('morgan')
const { engine } = require ('express-handlebars');
const { networkInterfaces } = require('os');
const nets = networkInterfaces();
const results = Object.create(null);
const sharp = require('sharp')
const router = require('./router/Index')
const fs = require('fs')
const axios = require('axios')
const Threading = require('./app/AGV/Threading')
const DeviceList = require('./app/AGV/DeviceList')
const Socket = require('./app/controller/Socket.controller')
const AGV = require('./app/AGV/AGVController')

for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        // Chỉ lấy địa chỉ IPv4 và loại bỏ địa chỉ nội bộ (ví dụ: 127.0.0.1)
        if (net.family === 'IPv4' && !net.internal) {
            if (!results[name]) {
                results[name] = [];
            }
            results[name].push(net.address);
        }
    }
}

const app = express()
const port = 3000

const deviceList = new DeviceList();
const threading = new Threading(deviceList);

function runAfterOneSecond() {
    threading.start();
    //console.log('Chương trình được thực hiện sau một giây');
}
//function runControlAGV(){
//    Agv.start()
//}

function abb() {
    const device = deviceList.getAllDevices();
    console.log('devices lấy được', device);
}

// chạy đọc thông tin từ robot
setInterval(runAfterOneSecond, 200);
//setInterval(runControlAGV(),200)
//setInterval(abb, 200);
app.use(morgan('combined'))
//xử lý dữ liệu từ client

app.use(express.urlencoded({
    extended: true
}))
//app.use(deviceList)
app.use(express.json())
//static thư mục 
app.use(express.static(path.join(__dirname ,'Public')))
//đặt cho app sử dụng view là hbs
app.engine('hbs', engine({extname: '.hbs'}))
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname,'resources/views'))
const dir = path.join(__dirname)
router(app)
const server = app.listen(port,  () => {
    console.log("Listening on port: " + port);
});
app.listen(20001,() => console.log( 'listen on port: ' , results , 20001))
const io = require('socket.io')(server);
const socket = new Socket(io,deviceList)
socket.deviceList = deviceList
socket.setDeviceList(deviceList)
socket.start()
const Agv = new AGV(deviceList)
Agv.deviceList = deviceList
Agv.setDeviceList(deviceList)
Agv.start()