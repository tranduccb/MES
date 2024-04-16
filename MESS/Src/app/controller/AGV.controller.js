const sharp = require('sharp')
const http = require('http');
const Checkjson = require('../AGV/CheckfilesJson')
const checkjson = new Checkjson()
const axios = require('axios');
class AGVController{

    async taskExecutiontatus(req,res){
        const postData = req.body;
        console.log(postData)
        res.json({ 
            "retcode":0, 
            "message":"" 
            }
        )
        if(postData.status >= 0 || postData.status < 200){
            //await this.configTask(this,postData.taskId,postData.unitId)
            const filePath = 'Src/app/AGV/Agvtaskrunning.json';
            const filePath2 = 'Src/app/AGV/Agvtask.json';
            var agvTaskRun = await checkjson.Read(filePath)
            var agvTask
            if(!agvTaskRun) return
            var agvId = postData.agvId
            for (let task of agvTaskRun) {

                var taskwork = task.work
                for (let List of taskwork.taskList){
                    if(List.unitId === postData.unitId){
                        taskwork.taskList = taskwork.taskList.filter(item => item !== List);
                    }
                }
                if(taskwork.taskList.length == 0){
                    agvTask = await checkjson.Read(filePath2);
                    for (let gvtask of agvTask){
                        if (task.id == gvtask.id){
                            gvtask.status = "Đang thực hiện"
                            gvtask.secsion = postData.taskId
                        }
                    }
                }
            }
            await checkjson.Write(filePath2,agvTask)
        }
        if(postData.status == 100){
            //await this.configTask(this,postData.taskId,postData.unitId)
            const filePath = 'Src/app/AGV/Agvtaskrunning.json';
            const filePath2 = 'Src/app/AGV/Agvtask.json';
            var agvTaskRun = await checkjson.Read(filePath)
            var agvTask
            if(!agvTaskRun) return
            //console.log('agv task run')
            //console.log(agvTaskRun)
            var agvId = postData.agvId
            for (let task of agvTaskRun) {

                var taskwork = task.work
                for (let List of taskwork.taskList){
                    if(List.unitId === postData.unitId){
                        taskwork.taskList = taskwork.taskList.filter(item => item !== List);
                    }
                }
                console.log(taskwork.taskList.length)
                if(taskwork.taskList.length == 0){
                    
                    agvTask = await checkjson.Read(filePath2);
                    for (let gvtask of agvTask){
                        if (task.id == gvtask.id){
                            gvtask.status = "Hoàn Thành"
                            console.log('có hoàn thành')
                        }
                    }
                    agvTaskRun = agvTaskRun.filter(item => item !== task)
                }
            }
            await checkjson.Write(filePath2,agvTask)
            await checkjson.Write(filePath,agvTaskRun)
        }
    }
    async agvStatusReport(req,res){
        const postData = req.body;
        //console.log( ' report ')
        //console.log(postData)
        res.json({ 
            "retcode":0, 
            "message":"" 
            }
        )
    }

}
module.exports = new AGVController