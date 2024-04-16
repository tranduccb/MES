const fs = require('fs').promises;
const DeviceList = require('../AGV/DeviceList');
const { Error, Canh_bao } = require('../AGV/Option');
const Checkjson = require('../AGV/CheckfilesJson')

var socketid = [];
var realtime = [];
var view_option = [];
var start = [];
var status = [];
var control_id = [];
var address = [];
var value = [];
const checkjson = new Checkjson()

class Socket {
    constructor(io, deviceList) {
        this.io = io;
        this.deviceList = deviceList;
    }

    setDeviceList(deviceList) {
        this.deviceList = deviceList;
    }

    async readJsonFile(filePath) {
        try {
            const data = await fs.readFile(filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error reading or parsing JSON file:', error);
            throw error;
        }
    }
    updatetable(socket,task,id){
        let indext = 0;
        var nvu_dc = ''
        task.forEach(item => {
            if(item.idagv == id || item.idagv == 0 ){
                indext++;
                nvu_dc += `
                    <tr id="${item.id}" onclick="selec(this)">
                        <th class="table-stt" scope="col">${indext}</th>
                        <th class="table-notice" scope="col">${item.notice}</th>
                        <th class="table-time" scope="col">${item.txtTime}</th>
                        <th class="table-status" scope="col">${item.status}</th>
                        <th class="table-propeties" scope="col">${item.propety}</th>
                        <th class="table-end-point" scope="col">${item.endPoint}</th>
                        <th class="talbe-time-creat" scope="col">${item.timeNow}</th>
                        <th class="table-persion" scope="col">${item.user}</th>
                    </tr>
                `;
            }
        });
        socket.emit('update-task',nvu_dc)
    }
    async secsion(key, data,socket){
        const self = this;
        let found = false
        const filePath = 'Src/app/AGV/Agvtask.json';
        var task = []
        try {
            //await checkjson.Check_Read(filePath)
            task = await checkjson.Read(filePath)
        }
        catch(error){
            console.error('Error generating HTML:', error);
        }
        //console.log(task)
        switch (key) {
            case 'secsion-add':
                console.log('add');
                console.log(task.length)
                let idCounter = 1;
                let itemAdded = false;
                if(task.length == 0){
                    task.push({
                        id: idCounter,
                        idagv: parseInt(data.idagv),
                        notice: data.notice,
                        txtTime: data.txtTime,
                        status: data.status,
                        propety: data.propety,
                        endPoint: data.endPoint,
                        timeNow: data.timeNow,
                        user: data.user,
                        secsion: 'none'
                    });
                }
                else{
                    task.forEach((item, index) => {
                        // Nếu đã thêm item thành công thì không cần duyệt tiếp
                        if (itemAdded) return;
                        console.log(item,index)
                        // Kiểm tra xem idCounter đã tồn tại trong task chưa
                        while (true) {
                            const existingItem = task.find(taskItem => taskItem.id === idCounter);
    
                            if (!existingItem) {
                                // Nếu không tìm thấy idCounter trong task, thêm item mới với id là idCounter
                                task.push({
                                    id: idCounter,
                                    idagv: parseInt(data.idagv),
                                    notice: data.notice,
                                    txtTime: data.txtTime,
                                    status: data.status,
                                    propety: data.propety,
                                    endPoint: data.endPoint,
                                    timeNow: data.timeNow,
                                    user: data.user,
                                    secsion: 'none'
                                });
    
                                itemAdded = true; // Đánh dấu là đã thêm item thành công
                                return; // Thoát khỏi vòng lặp forEach
                            } else {
                                idCounter++; // Tăng idCounter để kiểm tra tiếp id tiếp theo
                            }
                        }
                    });
                }
                
                console.log('task: ',task)
                //const jsonData = JSON.stringify(task, null, 2);
                //console.log(jsonData)
                //await checkjson.Check_Write(filePath)
                //fs.writeFile(filePath,jsonData)
                await checkjson.Write(filePath,task)
                //console.log('add task thành công')
                self.updatetable(socket,task, parseInt(data.idagv))
                break;
            case 'secsion-replace':
                console.log('replace');
                task.forEach(item=> {
                    if(item.id == data.id){
                        item.idagv = parseInt(data.idagv)
                        item.notice = data.notice,
                        item.txtTime = data.txtTime,
                        item.status = data.status,
                        item.propety = data.propety,
                        item.endPoint = data.endPoint,
                        item.timeNow = data.timeNow,
                        item.user = data.user
                    }
                })
                const jsonData2 = JSON.stringify(task, null, 2);
                //await checkjson.Write(filePath)
                //fs.writeFile(filePath,jsonData2)
                await checkjson.Write(filePath,jsonData2)
                self.updatetable(socket,task, parseInt(data.idagv))
                break;
            case 'secsion-delete':
                console.log('delete');
                task.forEach(item => {
                    if(item.id == data.id){
                        task.splice(item.index,1)
                    }
                })
                const jsonData3 = JSON.stringify(task, null, 2);
                //await checkjson.Write(filePath)
                //fs.writeFile(filePath,jsonData3)
                await checkjson.Write(filePath,jsonData3)
                self.updatetable(socket,task, parseInt(data.idagv))
                break;
            default:
                console.log('error');
                break;
        }
    }
    async generateHtml(id,socket) {
        const self = this;
        const filePath = 'Src/app/AGV/Agvtask.json';
        const filePath2 = 'Src/Public/Maps/mapconfig.json';

        let nvu_dc = '';
        let point_maps = '';

        try {
            //await checkjson.Check_Read(filePath)
            const jsonData1 = await checkjson.Read(filePath);

            let indext = 0;
            jsonData1.forEach(item => {
                if (item.idagv == id) {
                    indext++;
                    nvu_dc += `
                        <tr id="${item.id}" onclick="selec(this)">
                            <th class="table-stt" scope="col">${indext}</th>
                            <th class="table-notice" scope="col">${item.notice}</th>
                            <th class="table-time" scope="col">${item.txtTime}</th>
                            <th class="table-status" scope="col">${item.status}</th>
                            <th class="table-propeties" scope="col">${item.propety}</th>
                            <th class="table-end-point" scope="col">${item.endPoint}</th>
                            <th class="talbe-time-creat" scope="col">${item.timeNow}</th>
                            <th class="table-persion" scope="col">${item.user}</th>
                        </tr>
                    `;
                }
            });
            //await checkjson.Check_Read(filePath2)
            const jsonData2 = await checkjson.Read(filePath2);
            const filespathpoin = 'Src/Public/' + jsonData2.point;
            //await checkjson.Check_Read(filespathpoin)
            const jsonData3 = await checkjson.Read(filespathpoin);
            jsonData3.forEach(item => {
                point_maps += `
                    <option value="${item.ID}">Điểm số ${item.ID}</option>
                `;
            });

            const innerHTML = `
                <div id="task">
                    <span><h1>Nhiệm vụ AGV ID </h1> <h1 id="id-agv">${id}</h1></span>
                    <div id="header">
                        <table class="table">
                            <thead class="thead-dark">
                                <tr>
                                    <th class="table-stt" scope="col">Stt</th>
                                    <th class="table-noticeh" scope="col">Nôi Dung Nhiệm Vụ</th>
                                    <th class="table-time" scope="col">Thời gian thực thi</th>
                                    <th class="table-status" scope="col">Trạng thái</th>
                                    <th class="table-propeties" scope="col">Mức ưu tiên</th>
                                    <th class="table-end-point" scope="col">Điểm Đến</th>
                                    <th class="talbe-time-creat" scope="col">Thời gian tạo</th>
                                    <th class="table-persion" scope="col">Người tạo</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                    <div class="table-container">
                        <table id="data_" class="table table-hover">
                            <tbody id = nvu-dc>
                                ${nvu_dc}
                            </tbody>
                        </table>
                    </div>
                    <div class="secsion-container">
                        <div class="row">
                            <div class="form-group col-4">
                                <label for="exampleCombobox">Điểm đến:</label>
                                <select class="form-control" id="end-point">
                                    <option value="">Lựa chọn điểm đến</option>
                                    ${point_maps}
                                </select>
                            </div>
                            <div class="form-group col-4">
                                <label for="exampleCombobox">Mức độ ưu tiên:</label>
                                <select class="form-control" id="propety">
                                    <option value="">Lựa chọn mức độ ưu tiên</option>
                                    <option value="1">Khi rảnh</option>
                                    <option value="2">Theo thời gian</option>
                                    <option value="3">Lập tức</option>
                                </select>
                            </div>
                            <div class="form-group col-4">
                                <label for="exampleCombobox">Thời gian:</label>
                                <br>
                                <input type="time" name="txtTime" id="txtTime" onclick="timef(this)" />
                            </div>
                        </div>
                        <div class="row"> 
                            <div class="form-group col-10">
                                <label for="exampleTextbox">Nội dung:</label>
                                <input type="text" class="form-control" id="notice-nv" placeholder="Hãy nhập nội dung nhiệm vụ">
                            </div>
                        </div>
                    </div>
                    <div class="row secsion-btn">
                        <button id="secsion-add" type="button" class="btn btn-primary col" onclick="secsion(this)">Thêm Nhiệm Vụ</button>
                        <button id="secsion-replace" type="button" class="btn btn-info col" onclick="secsion(this)">Sửa Nhiệm Vụ</button>
                        <button id="secsion-delete" type="button" class="btn btn-warning col" onclick="secsion(this)">Xóa Nhiệm Vụ</button>
                        <button type="button" class="btn btn-light col" onclick="closeTask()">Thoát</button>
                    </div>
                </div>
            `;
            
            socket.emit('nhiemvu',innerHTML)
        } catch (error) {
            console.error('Error generating HTML:', error);
            // Xử lý lỗi, ví dụ socket.emit('Errmap')
        }
    }

    start() {
        const self = this;
        this.io.on("connection", async function(socket) {
            if (!socketid.includes(socket.id)) {
                socketid.push(socket.id);
                console.log("add new socket: " + socket.id);
            }

            socket.on("disconnect", async function() {
                const index = socketid.indexOf(socket.id);
                if (index !== -1) {
                    socketid.splice(index, 1);

                    if (realtime[index]) {
                        if (view_option[index] == 1) {
                            clearInterval(realtime[index]);
                            realtime.splice(index, 1);
                            start.splice(index, 1);
                            status.splice(index, 1);
                            address.splice(index, 1);
                            value.splice(index, 1);
                        } else if (view_option[index] == 2) {
                            data_off_socket.splice(index, 1);
                        }
                    }

                    console.log("disconnect: " + socket.id);
                }
            });

             socket.on("Map", async function() {
                const filePath = 'Src/Public/Maps/mapconfig.json';
                await checkjson.Check_Read(filePath)
                fs.readFile(filePath, 'utf8')
                    .then(data => {
                        const jsonData = JSON.parse(data);
                        console.log(data)
                        socket.emit('Map', jsonData);
                    })
                    .catch(err => {
                        console.error('Error reading file:', err);
                        socket.emit('Errmap');
                    });
            });

            socket.on("AGV", async function() {
                const filePath = 'Src/app/AGV/ListAGV.json';
                await checkjson.Check_Read(filePath)
                fs.readFile(filePath, 'utf8')
                    .then(data => {
                        const jsonData = JSON.parse(data);
                        var ViewAGV = '';
                        let id = [];
                        jsonData.forEach(item => {
                            id.push(item.ID);
                            ViewAGV = ViewAGV +
                                `<a href="#agv${item.ID}" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle"><i class="fa fa-car green_color"></i> <span>AGV ${item.ID}</span></a>
                                <ul class="collapse list-unstyled" id="agv${item.ID}">
                                    <span> <h1>Trạng Thái:</h1><h1 id="stt${item.ID}"> None</h1> </span>
                                    <span><h1>Điện áp:</h1><h1 id="vol${item.ID}"> 0%</h1></span>
                                    <span><h1>Pin:</h1><h1 id="pin${item.ID}"> 0%</h1></span>
                                    <span><h1>Vị trí:</h1><h1 id="postion${item.ID}">(0:0)</h1></span>
                                    <span><h1>Độ chính xác:</h1><h1 id="ini${item.ID}">0%</h1></span>
                                    <span><h1>Tốc độ :</h1><h1 id="speed${item.ID}">0M/s</h1></span>
                                    <span><h1>Điểm hiện tại:</h1><h1 id="point${item.ID}">0</h1></span>
                                    <span><h1>Điểm cuối cùng:</h1><h1 id="lastpoint${item.ID}">0</h1></span>
                                    <span><h1>Nhiệm Vụ:</h1><h1 id="work${item.ID}"> None</h1></span>
                                    <span><h1>Hoạt động:</h1><h1 id="working${item.ID}">None</h1></span>
                                    <span><h1>Cảnh Báo:</h1><h1 id="alert${item.ID}">None</h1></span>
                                    <button id="live${item.ID}" type="button" class="btn btn-primary btn-lg btn-block btn-light btn-outline-secondary" onclick="pos(this)">Vị Trí Hiện Tại</button>
                                    <button id="home${item.ID}" type="button" class="btn btn-primary btn-lg btn-block btn-light btn-outline-secondary" onclick="pos(this)">Quay Về</button>
                                    <button id="sac${item.ID}" type="button" class="btn btn-primary btn-lg btn-block btn-light btn-outline-secondary" onclick="pos(this)">Sạc</button>
                                    <button id="nhiemvu${item.ID}" type="button" class="btn btn-primary btn-lg btn-block btn-light btn-outline-secondary" onclick="pos(this)">Danh Sách Nhiệm vụ</button>
                                    <button id="huynv${item.ID}" class="btn btn-primary btn-lg btn-block btn-light btn-outline-secondary" onclick="pos(this)">Hủy nhiệm vụ</button>
                                </ul>
                                `;
                        });
                        socket.emit('AGV', ViewAGV);
                        socket.emit('Car', id);
                    })
                    .catch(error => {
                        console.error('Error parsing JSON data:', error);
                    });
            });

            socket.on("propeties", async function() {
                let device = await self.deviceList.getAllDevices();
                var propeties = [];
                var min = {
                    "ID": 0,
                    "Status": "Đang Rảnh",
                    "vol": "0 V",
                    "Pin": "0%",
                    "Postion": "(0:0)",
                    "ini": "0%",
                    "speed": "0M/s",
                    "point": "0",
                    "lastpoint": "0",
                    "Task": "Không có nhiệm vụ",
                    "Work": "Đang Đứng Yên",
                    "Alert": "Bình Thường",
                    "Angle": 0
                };
                //console.log(device)
                for (const key in device) {
                    //console.log('item ' + key)
                    let minv = { ...min };
                    const item = device[key];
                    //console.log('item ' + key)
                    minv.ID = key;
                    minv.vol = item.CurrentVotage.val.toFixed(1) + 'V';
                    minv.Pin = item.CurrentPowerPercent.val + '%';
                    minv.Alert = Canh_bao(item.alarmCode.val);
                    minv.Postion = item.agvPosition.val;
                    minv.ini = (item.CurrentPosReliability.val / 1 * 100).toFixed(0) + '%';
                    minv.speed = item.MoveSpeed.val.toFixed(1) + 'M/s';
                    minv.point = item.CurrentNodeID.val;
                    minv.lastpoint = item.lastNodeId.val;
                    minv.Status = Error(item.errorCode.val);
                    minv.Angle = item.agvAngle.val.toFixed(1);
                    propeties.push(minv);
                }
                //console.log(propeties)
                socket.emit('AGV_Propeties', propeties);
            });

            socket.on('control', function(data) {
                var key, id;
                var matches = data.match(/^([a-zA-Z]+)([0-9]+)$/);
                if (!matches) return;

                key = matches[1];
                id = parseInt(matches[2]);

                switch (key) {
                    case 'live':
                    case 'home':
                    case 'sac':
                    case 'nhiemvu':
                        self.generateHtml(id,socket);
                    case 'huynv':
                    default:
                        break;
                }
            });

            socket.on('secsion', function(data) {
                self.secsion(data.secsion,data,socket)
            });
        });
    }
}

module.exports = Socket;
