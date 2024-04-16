// Định nghĩa lớp DeviceList
const axios = require('axios');
const fs = require('fs')
class DeviceList {
    constructor() {
        this.devices = {};
    }
    // Phương thức để thêm một thiết bị vào deviceList
    async addDevice(agvId, agv) {
        //console.log('get data')
        // Kiểm tra xem ID đã tồn tại trong deviceList hay chưa
        if (this.devices.hasOwnProperty(agvId)) {
            for (const key in agv) {
                //console.log(key)
                if (agv.hasOwnProperty(key)) {
                    if (this.devices[agvId].hasOwnProperty(key)) {
                        this.devices[agvId][key].val = agv[key];
                    }
                }
            }
            //this.req()
        } else {
            console.log('thêm mới')
            // Nếu chưa tồn tại, thêm thiết bị mới vào deviceList
            this.devices[agvId] = {
                connectStatus:{val: agv.connectStatus,header: 'Trạng thái kết nối với xe'},
                agvPosition: {val: agv.agvPosition,header: 'Vị trí hiện tại'},
                agvAngle:{val: agv.agvAngle, header:'Góc hiện tại AGV'},
                alarmCode: {val: agv.alarmCode,header: 'mã cảnh báo'},
                errorCode: {val: agv.errorCode,header: 'mã lỗi'},
                CurrentVotage: {val: agv.CurrentVotage,header: 'điện áp pin'},
                CurrentPowerPercent: {val: agv.CurrentPowerPercent,header: 'cường độ pin'},
                inputIOStatus: {val: agv.inputIOStatus,header: 'trạng thái IO đầu vào'},
                outputIOStatus: {val: agv.outputIOStatus,header: 'trạng thái IO đầu ra'},
                CurrentPosReliability:{val: agv.CurrentPosReliability,header:'Độ chính xác vị trí'},
                lastNodeId: {val: agv.lastNodeId,header: 'vị trí cuối cùng'},
                lastNodeStation: {val: agv.lastNodeStation,header: 'trạm cuối cùng'},
                liftAngle: {val: agv.liftAngle,header: 'góc nâng'},
                liftHeight: {val: agv.liftHeight,header: 'chiều cao nâng'},
                MoveSpeed:{val: agv.MoveSpeed,header:'Tốc độ di chuyển'},
                CurrentNodeID: {val: agv.CurrentNodeID,header: 'Vị trí điểm hiệm tại'},
                state: {val: agv.state,header: 'ID nhiệm vụ'},
                taskId: {val: agv.taskId,header: 'ID nhiệm vụ'},
                topQRCode: {val: agv.topQRCode,header: 'mã QR code cuối cùng'},
                unitId: {val: agv.unitId,header: 'trạng thái AGV'}
            };

        }
    }
    // Phương thức để lấy thông tin của một thiết bị dựa trên ID
    async getDeviceById(agvId) {
        return this.devices[agvId];
    }

    // Phương thức để lấy danh sách các thiết bị
    async getAllDevices() {
        return this.devices;
    }
    async req(){
        console.log('have put')
        try{
            const req = await axios.post('http://127.0.0.1:5566/RCS/REST/okagv/getAgvStatus', {
                // data to be sent in the request body
                "retcode":0,
                "message":""
            });
            console.log('push')
            console.log(req.data)
        }
        catch(error){
            console.log('have error',error)
        }
    }
}

module.exports = DeviceList;
