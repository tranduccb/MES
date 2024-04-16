const fs = require('fs');
class Checkjson{
    async Check_Read(filePath) {
        try {
            while (true) {
                try {
                    // Kiểm tra quyền truy cập của tệp
                    await fs.promises.access(filePath, fs.constants.F_OK | fs.constants.R_OK);
                    //console.log(`File ${filePath} is ready for opening.`);
                    break; // Thoát khỏi vòng lặp nếu tệp có sẵn sàng
                } catch (error) {
                    console.log(`File ${filePath} is not ready. Waiting for the file to become available...`);
                    await new Promise(resolve => setTimeout(resolve, 1000)); // Chờ 1 giây trước khi kiểm tra lại
                }
            }
        } catch (error) {
            console.error('Error checking file:', error);
        }
    }
    async Check_Write(filePath) {
        try {
            while (true) {
                try {
                    // Kiểm tra quyền truy cập ghi vào tệp
                    await fs.promises.access(filePath, fs.constants.F_OK | fs.constants.W_OK);
                    //console.log(`File ${filePath} has write permission.`);
                    break; // Thoát khỏi vòng lặp nếu tệp có quyền ghi
                } catch (error) {
                    console.log(`File ${filePath} does not have write permission. Waiting for permission...`);
                    await new Promise(resolve => setTimeout(resolve, 1000)); // Chờ 1 giây trước khi kiểm tra lại
                }
            }
        } catch (error) {
            console.error('Error checking file write permission:', error);
        }
    }
    async Read(filePath){
        try{
            await this.Check_Read(filePath)
            //console.log(filePath)
            var data = await fs.promises.readFile(filePath, 'utf8');
            data = await JSON.parse(data);
            return data
        }
        catch(error){
            console.error('Can Read Files :', error);
        }

    }
    async Write(filePath,data){
        try{
            await this.Check_Write(filePath)
            await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
        }
        catch(error){
            console.error('Can Read Files :', error);
        }
    }
    
}
module.exports = Checkjson
