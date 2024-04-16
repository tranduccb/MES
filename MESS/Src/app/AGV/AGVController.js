const fs = require('fs').promises; // Import thư viện fs để đọc tệp
const graphlib = require('graphlib'); // Import graphlib
const Graph = graphlib.Graph; // Lấy đối tượng Graph từ graphlib
const Checkjson = require('../AGV/CheckfilesJson')
const Creat_Task = require('./Task.Creat')
const DeviceList = require('./DeviceList')
const axios = require('axios');
const checkjson = new Checkjson()
const creat_Task = new Creat_Task()

class AGV {
    constructor(deviceList) {
        this.deviceList = deviceList;
        this.graph = new Graph({ directed: true }); // Khởi tạo đồ thị là một thuộc tính của lớp AGV
        this.Task_AGV = this.Task_AGV.bind(this)
        this.Option ={
            Gostation:'GostationS',
            GostationAngle:'GostationAngle',
            Wait:'Wait',
            Nanglen:'Nanglen',
            Haxuong:'Haxuong'
        }
    }
    setDeviceList(deviceList) {
        this.deviceList = deviceList;
    }
    async start() {
        await this.Creat_Graph();
        setInterval(this.Task_AGV, 200);
        setInterval(()=>{this.Driver_Car(this.deviceList)}, 1000);
    }
    async Task_AGV(){
        //console.log('Check task')
        try {
            const filePath = 'Src/app/AGV/Agvtaskrunning.json';
            var agvTaskRun = await checkjson.Read(filePath)
            //agvTaskRun = JSON.parse(agvTaskRun);
            const filePath2 = 'Src/app/AGV/Agvtask.json';
            var agvTask = await checkjson.Read(filePath2);
            //agvTask = JSON.parse(agvTask);
            const matchedIds = new Set(agvTaskRun.map(task => task.idagv));
            for (const task of agvTask) {
                if (!matchedIds.has(task.idagv) && task.status ==="Đang chờ" ) {
                    
                    const startID = '1';
                    const endID = parseInt(task.endPoint.match(/\d+/)[0].toString());
                    const path = await this.Creat_Task_Run(startID, endID);
                    var data ={
                        id: task.id,
                        idagv: task.idagv,
                        go_paths : path.Go_paths,
                        back_paths : path.Back_paths,
                        work_up: 3, // điểm nhận
                        work_down: parseInt(endID),
                        work:'',
                        start: 1,
                        end: parseInt(endID), // điểm trả hàng
                        group:'wait'
                    }
                    agvTaskRun.push(data);
                    matchedIds.add(task.idagv); // Đánh dấu task.id đã được xử lý
                    task.status = 'Đã khởi tạo'
                    console.log('đã thêm nhiệm vụ cho AGV ', task.idagv)
                }
            }
            await checkjson.Write(filePath,agvTaskRun)
            await checkjson.Write(filePath2,agvTask)
            
        } catch (error) {
            console.error('Error creating or processing task:', error);
        }
    }
    // thực hiện điều khiển xe qua mỗi điểm theo bản đồ từ điểm cuối và vị trí hiện tại
    async Driver_Car(deviceList) {
        //const self = this;
        const filePath = 'Src/app/AGV/Agvtaskrunning.json';
        var agvTaskRun = await checkjson.Read(filePath)
        let devices = await deviceList.getAllDevices()
        if(!agvTaskRun) return
        for (const key in devices) {
            const device = devices[key];
            for (const item of agvTaskRun) {
                if (item.idagv === parseInt(key) && device.connectStatus.val === true ) {
                    if (item.group === "wait") {
                        const filePath2 = 'Src/app/AGV/Agvtask.json';
                        var agvTask = await checkjson.Read(filePath2);
                        let path = item.go_paths;
                        if (path.length >= 2) {
                            var work = [
                                //[this.Option.GostationAngle, path[0],90],
                                [this.Option.GostationAngle, path[path.length - 1],90],
                            ];
                            path = item.back_paths
                            if(path.length >= 2){
                                work.push([this.Option.GostationAngle, path[path.length - 1],0])
                            }
                            //var task_send
                            const task = creat_Task.createTask(item.idagv, work);
                            for (const item of task.taskList) {
                                const task_send = {
                                    taskId: task.taskId,
                                    idagv: task.agvId,
                                    taskList: [item]
                                };
                                //console.log('task send');
                                //console.log(task_send);
                                const push = await this.Push_task(task_send);
                                console.log('Push_task result:');
                                console.log(push);
                                // Xử lý kết quả push nếu cần
                            }
                            
                            //console.log(task)
                            item.work = task
                            //var push = await this.Push_task(task);
                            //console.log(push)
                            //if(push == true){
                            //    console.log(push)
                            item.group = "up"
                            await checkjson.Write(filePath,agvTaskRun)
                            return;
                        }
                    }
                    if(item.group == 'up'){

                    }
                    if(item.group == 'down'){

                    }
                }
            }
        }
    }
    async Creat_Task_Run(startID, endID) {
        // Kiểm tra xem startID và endID có tồn tại trong đồ thị
        if (!this.graph.hasNode(startID.toString()) || !this.graph.hasNode(endID.toString())) {
            throw new Error('StartID or EndID does not exist in the graph');
        }
    
        // Hàm để tìm tất cả các đường đi từ startID đến endID hoặc từ endID về startID
        const findPaths = (currentID, endID_, path) => {
            // Thêm đỉnh hiện tại vào đường đi
            path.push(currentID);
    
            // Nếu đến được đỉnh endID, thêm đường đi vào danh sách paths
            if (currentID === endID_) {
                return [path.slice()]; // sao chép mảng path và trả về mảng chứa mảng path
            } else {
                const neighbors = this.graph.successors(currentID) || [];
                let shortestPaths = [];
    
                for (const neighbor of neighbors) {
                    // Điều kiện kiểm tra để tránh lặp lại các đỉnh trong đường đi
                    if (!path.includes(neighbor)) {
                        // Gọi đệ quy để tìm các đường đi tiếp theo
                        const nextPaths = findPaths(neighbor, endID_, path);
                        shortestPaths.push(...nextPaths); // thêm các đường đi vào shortestPaths
                    }
                }
    
                // Loại bỏ đỉnh hiện tại khỏi đường đi để thử các đường đi khác
                path.pop();
    
                return shortestPaths;
            }
        };
    
        // Tìm tất cả các đường đi từ startID đến endID
        const goPaths = findPaths(startID.toString(), endID.toString(), []);
    
        // Tìm tất cả các đường đi từ endID về startID
        const backPaths = findPaths(endID.toString(), startID.toString(), []);
        
        // Lựa chọn đường đi ngắn nhất từ danh sách các đường đi
        const shortestGoPath = goPaths.reduce((shortest, current) => (current.length < shortest.length ? current : shortest), goPaths[0]);
        const shortestBackPath = backPaths.reduce((shortest, current) => (current.length < shortest.length ? current : shortest), backPaths[0]);
        //console.log('sort' + shortestGoPath)
        //console.log('back' +shortestBackPath)
        // Trả về đối tượng chứa các đường đi ngắn nhất
        return {
            Go_paths: shortestGoPath,
            Back_paths: shortestBackPath
        };
    }
    
    
    // Gửi nhiệm vụ tới thiết bị
    Send_Task() {
        // Viết logic cho phương thức Send_Task ở đây
    }
    
    // Đóng nhiệm vụ
    Close_Task() {
        // Viết logic cho phương thức Close_Task ở đây
    }
    
    async configTask(taskID,unitID){
        const config = {
            taskId: taskID,
            unitId: unitID
        };
        //console.log(setUrl);
        const data = JSON.stringify(config); 
        const url = "http://127.0.0.1:5566/RCS/REST/confirmTask";
        const options = {
            hostname: '127.0.0.1',
            port: 5566,
            path: '/RCS/REST/confirmTask',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            },
            insecureHTTPParser: true
        };
        console.log('data config',data)
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
    }
    async cancelTask(){
        const config = {
            taskId: taskID,
            unitId: unitID
        };
        //console.log(setUrl);
        const data = JSON.stringify(config); 
        const url = "http://127.0.0.1:5566/RCS/REST/cancelTask";
        const options = {
            hostname: '127.0.0.1',
            port: 5566,
            path: '/RCS/REST/cancelTask',
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
    }
    async Creat_Graph() {
        //const self = this
        const filePath = 'Src/Public/Maps/mapconfig.json';
        
        try {
            // Đọc nội dung tệp JSON từ đường dẫn filePath
            var data = await checkjson.Read(filePath)
            //console.log(data.point)
            data = 'Src/Public/' + data.point
            //console.log(data)
            var mapPoints = await checkjson.Read(data)
            //console.log(mapPoints)
            // Chuyển đổi dữ liệu JSON thành đối tượng JavaScript
            //mapPoints = JSON.parse(mapPoints);
            //console.log(mapPoints)
            mapPoints.forEach(point => {
                const currentID = point.ID.toString();
                // Thêm đỉnh vào đồ thị (nếu chưa tồn tại)
                if (!this.graph.hasNode(currentID)) {
                    this.graph.setNode(currentID, { label: 'Point ' + currentID });
                }
            })
            // Thêm các điểm vào đồ thị và tạo các cạnh dựa trên các điểm kết nối trong tệp JSON
            mapPoints.forEach(point => {
                const currentID = point.ID.toString();
                const nextPoints = point.Next || [];
                const backPoints = point.Back || [];
                // Thêm các cạnh đi đến các điểm kế tiếp
                nextPoints.forEach(nextID => {
                    const nextIDString = nextID.toString();
                    this.graph.setEdge(currentID, nextIDString);
                });

                // Thêm các cạnh quay lại các điểm trước đó
                backPoints.forEach(backID => {
                    const backIDString = backID.toString();
                    this.graph.setEdge(currentID, backIDString);
                });
            });
            //console.log('Graph created:', self.graph.nodes(), self.graph.edges());

        } catch (error) {
            console.error('Error reading or parsing JSON file:', error);
            throw error;
        }
    }
    
    async Push_task(task){
        try{
            const response = await axios.post('http://127.0.0.1:5566/RCS/REST/task', task );
            console.log(response.data)
            if(response.data.retcode == 0){
                return true
            }
            return false
        }
        catch(error){
            console.log('Push task error', task)
            return false
        }
    }
}

module.exports = AGV;
