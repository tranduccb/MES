const {taskType,StartConfirm,FinhshConfirm,runStationFlag,ActionSource,Param20,Param21,Param30,Param31} = require('./TaskOption')
class Task {
    constructor() {}

    createTask(ID, arr) {
        const time = this.getTime(); // Lấy timestamp chung cho tất cả các task
        const cmd = {
            "taskId": time, // Sử dụng timestamp chung làm taskId
            "agvId": ID,
            "taskList": []
        };

        arr.forEach((e, index) => {
            const unitId = `${time}_${index + 1}`; // Tạo unitId cho từng task với chỉ số index
            //console.log('item : ', e);
            switch (e[0]) {
                case 'GostationS':
                    cmd.taskList.push(this.goStation(unitId, e[1]));
                    break;
                case 'GostationAngle':
                    cmd.taskList.push(this.goStationAngle(unitId, e[1], e[2]));
                    break;
                case 'Wait':
                    cmd.taskList.push(this.wait(unitId, e[1], e[2]));
                    break;
                case 'Sac':
                    cmd.taskList.push(this.sac(unitId));
                    break;
                case 'Ngatsac':
                    cmd.taskList.push(this.ngatsac(unitId));
                    break;
                case 'Nanglen':
                    cmd.taskList.push(this.nanglen(unitId, e[1]));
                    break;
                case 'Haxuong':
                    cmd.taskList.push(this.haxuong(unitId, e[1]));
                    break;
                default:
                    console.error('Lệnh không hợp lệ:', e);
            }
        });
        return cmd;
    }

    goStation(unitId,  Station) {
        const cmd = {
            "unitId": unitId,
            "taskType": taskType.Dichuyen, // Assuming taskType for Gostation is 1
            "station": parseInt( Station),
        };
        return cmd;
    }

    goStationAngle(unitId, Station, Angle) {
        const cmd = {
            "unitId": unitId,
            "taskType": taskType.Dichuyen, // Assuming taskType for GostationAngle is 4
            "station": parseInt(Station),
            "agvAngle": parseInt(Angle)
        };
        return cmd;
    }

    wait(unitId, Station, TimeWait) {
        const cmd = {
            "unitId": unitId,
            "taskType": taskType.Tamdung, // Assuming taskType for Wait is 2
            "station": parseInt(Station),
            "delay": TimeWait
        };
        return cmd;
    }

    sac(unitId) {
        const cmd = {
            "unitId": unitId,
            "taskType": taskType.Mosac // Assuming taskType for Sac is 1
        };
        return cmd;
    }

    ngatsac(unitId) {
        const cmd = {
            "unitId": unitId,
            "taskType": taskType.Ngatsac // Assuming taskType for Ngatsac is 3
        };
        return cmd;
    }

    nanglen(unitId, Station) {
        const cmd = {
            "unitId": unitId,
            "taskType": taskType.Dunglai, // Assuming taskType for Nanglen is 1
            "station": parseInt(Station)
        };
        return cmd;
    }

    haxuong(unitId, Station) {
        const cmd = {
            "unitId": unitId,
            "taskType": taskType.Dunglai, // Assuming taskType for Haxuong is 1
            "station": parseInt(Station)
        };
        return cmd;
    }

    getTime() {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const day = currentDate.getDate().toString().padStart(2, '0');
        const hours = currentDate.getHours().toString().padStart(2, '0');
        const minutes = currentDate.getMinutes().toString().padStart(2, '0');
        const seconds = currentDate.getSeconds().toString().padStart(2, '0');
        const milliseconds = currentDate.getMilliseconds().toString().padStart(3, '0');
        const timeZoneOffset = (currentDate.getTimezoneOffset() / 60).toString().padStart(3, '0');

        const timestampString = `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}_${timeZoneOffset}`;

        return timestampString;
    }
}

module.exports = Task;