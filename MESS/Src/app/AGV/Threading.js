const axios = require('axios');
const http = require('http');
const { networkInterfaces } = require('os');
const nets = networkInterfaces();
// Lớp DeviceList được import vào Threading
const DeviceList = require('./DeviceList');
var Feedback = false
class Threading{
    constructor(deviceList) {
        this.deviceList = deviceList;
    }

    async start() {
        if(Feedback){
            await this.getListAGV();
            //console.log('get ìnor')
        }
        else{
            this.Set_Feedback()
            //console.log('set info')
        }
    }
    async Set_Feedback() {
        try {
            for (const name of Object.keys(nets)) {
                for (const net of nets[name]) {
                    console.log(name);
                    if (net.family === 'IPv4' && !net.internal) {
                        if (name === 'Wi-Fi') {
                            console.log('create link');
                            const setUrl = {
                                taskExecutionStatusUrl:`http://${net.address}:20001/agv/taskExecutiontatus`,
                                agvStatusReportUrl:`http://${net.address}:20001/agv/agvStatusReport`
                            };
                            //console.log(setUrl);
                            const data = JSON.stringify(setUrl); 
                            const url = "http://127.0.0.1:5566/RCS/REST/setFeedbackUrl";
                            const options = {
                                hostname: '127.0.0.1',
                                port: 5566,
                                path: '/RCS/REST/setFeedbackUrl',
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Content-Length': data.length
                                },
                                insecureHTTPParser: true
                            };
                            // Tạo một Promise để gọi http.request và xử lý kết quả
                            const responseBody = await new Promise((resolve, reject) => {
                                const req = http.request(options, (res) => {
                                    let responseBody = '';

                                    res.on('data', (chunk) => {
                                        responseBody += chunk;
                                    });

                                    res.on('end', () => {
                                        resolve(responseBody); // Trả về responseBody khi hoàn thành
                                    });
                                });

                                req.on('error', (error) => {
                                    reject(error); // Xử lý lỗi nếu có
                                    //resolve(responseBody)
                                });

                                req.write(data); // Gửi dữ liệu
                                req.end(); // Kết thúc yêu cầu
                            });
                            //console.log(responseBody)
                            Feedback = true
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error setting feedback URL:', error);
        }
    }
    async getListAGV() {
        try {
            const response = await axios.get('http://127.0.0.1:5566/RCS/REST/getAgvMsg', { insecureHTTPParser: true });
            if (response.status === 200) {
                //console.log(response.data)
                // Chuyển đổi dữ liệu từ rawData thành định dạng mong muốn
                const formattedData = response.data.map(agv => ({
                    agvId: agv.mDeviceNo, // Thay đổi agvId tương ứng với mDeviceNo
                    connectStatus: agv.ConnectStatus,
                    agvPosition: `(${agv.cartPosition_X},${agv.cartPosition_Y})`,
                    agvAngle: agv.cartPosition_Angle,
                    CurrentPosReliability: agv.mCurrentPosReliability,
                    alarmCode: agv.mCurrentAlarmNo,
                    errorCode: agv.mCurrentErrorNo,
                    inputIOStatus: agv.mCartInputIOStatus,
                    outputIOStatus: agv.mCartOuputIOStatus,
                    CurrentVotage: agv.mCurrentVotage,
                    CurrentPowerPercent: agv.mCurrentPowerPercent,
                    CurrentNodeID : agv.mCurrentNodeID,
                    lastNodeId: agv.mLastNodeID,
                    liftAngle: agv.mLiftPlatformAngle,
                    liftHeight: agv.mLiftPlatformHeight,
                    MoveSpeed: agv.mMoveSpeed
                }));

                const dataraw = {agvList : formattedData,time: new Date().toISOString().replace('T', ' ').substring(0, 19)}
                //console.log('draw : ' + dataraw)
                this.addDeviceToList(dataraw);
                //this.req
            } else {
                console.error('Có lỗi khi lấy dữ liệu từ máy chủ:', response.statusText);
            }
            const response2 = await axios.get('http://127.0.0.1:5566/RCS/REST/okagv/getAgvStatus', { insecureHTTPParser: true });
            if (response2.status === 200) {
                //console.log( response2.data)
                this.addDeviceToList(response2.data);
                //this.req
            } else {
                console.error('Có lỗi khi lấy dữ liệu từ máy chủ:', response2.statusText);
            }
        } catch (error) {
            console.error('Có lỗi khi thực hiện yêu cầu:', error);
        }
    }
    addDeviceToList(deviceInfo) {
        try {
            const self = this; // Lưu trữ context của 'this'
            const agvList = deviceInfo.agvList;
            //console.log('infor: ' + agvList)
            agvList.forEach(function(agv) {

                self.deviceList.addDevice(agv.agvId, agv);
                //console.log("ID : " + agv.agvId)
                // Sử dụng self.deviceList thay vì this.deviceList
            });
    
            //console.log('Thêm thành công');
            //const device = this.deviceList.getDeviceById(11);
            //console.log(device);
        } catch (error) {
            //console.error('Có lỗi khi thêm thiết bị:', error);
        }
    }
}
module.exports = Threading;
//module.exports = new DeviceList;