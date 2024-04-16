const sharp = require('sharp')
const fs = require('fs');
const path = require('path');

class MapController{
    map(req,res){
        // Đường dẫn đến thư mục cha
        //const parentDirectory = require('');
        const dir = path.join(__dirname)
        const parentPath = path.dirname(dir);
        const parts = parentPath.split(path.sep);
        const lastValue = parts.slice(0, parts.length - 1).join(path.sep) + '/Public/Maps';
        var directories
        // Đọc nội dung của thư mục cha
        fs.readdir(lastValue, (err, files) => {
            if (err) {
                console.error('Error reading directory:', err);
                return;
            }

            // Lọc ra các thư mục từ danh sách các tệp và thư mục
            directories = files.filter(file => {
                // Kiểm tra xem đây có phải là thư mục không
                return fs.statSync(path.join(lastValue, file)).isDirectory();
            });
            
        });
        // In ra danh sách các thư mục con
        console.log('Các thư mục con trong thư mục cha:' + directories);
        res.render('map')
    }
}
module.exports = new MapController