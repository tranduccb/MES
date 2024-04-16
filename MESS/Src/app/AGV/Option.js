const Error = function(val) {
    const errorMessages = {
        0: 'Bình thường' ,
        1: 'Đọc vị trí thất bại' ,
        2: 'Kiểm soát lệnh thất bại' ,
        3: 'Điều khiển lệnh thất bại' ,
        4: 'Gán cổng thất bại' ,
        5: 'Gán cổng dịch vụ kiểm soát thất bại' ,
        6: 'Mở Modbus thất bại' ,
        7: 'TCP Modbus thất bại' ,
        8: 'Lỗi định dạng bản đồ' ,
        9: 'Không có dữ liệu bản đồ' ,
        10: 'Giao tiếp mạch chính hết hạn' ,
        11: 'Lỗi đọc thẻ nhớ' ,
        12: 'Thiếu dữ liệu đối lệnh' ,
        13: 'Lệnh thiếu dữ liệu' ,
        14: 'Lỗi lưu dữ liệu' ,
        15: 'Thiếu tham số' ,
        16: 'Lệnh không hợp lệ' ,
        17: 'Lỗi truyền tham số' ,
        18: 'Lỗi đọc dữ liệu' ,
        19: 'Lỗi cấu hình' ,
        20: 'Lỗi kết nối' ,
        21: 'Lỗi đọc địa chỉ' ,
        22: 'Lỗi xóa' ,
        23: 'Lỗi cập nhật' ,
        24: 'Lỗi trình đọc' ,
        25: 'Lỗi trình ghi' ,
        26: 'Lỗi tìm kiếm' ,
        27: 'Lỗi đếm' ,
        28: 'Lỗi đọc đường dẫn' ,
        29: 'Lỗi ghi đường dẫn' ,
        30: 'Lỗi đặt đường dẫn' ,
        31: 'Lỗi đọc tập tin' ,
        32: 'Lỗi ghi tập tin' ,
        33: 'Lỗi xóa tập tin' ,
        34: 'Lỗi khởi động' ,
        35: 'Lỗi khôi phục' ,
        36: 'Lỗi đơn vị' ,
        37: 'Lỗi giá trị' ,
        38: 'Lỗi cổng' 
    };

    return errorMessages[val] || 'Không xác định'; // Trả về thông báo lỗi tương ứng hoặc 'Không xác định' nếu không tìm thấy
};
const Canh_bao = function(val) {
    const statusMessages = {
        0: 'Bình thường' ,
        1: 'Lỗi chờ đọc vị trí' ,
        2: 'Không tìm thấy đích' ,
        3: 'Pin yếu' ,
        4: 'Có chướng ngại vật' ,
        5: 'Xe đang có dừng khẩn' ,
        6: 'Xe đang tạm dừng' ,
        7: 'Xe đang chờ SSIO' ,
        8: 'Lỗi phản hồi encoder laser' ,
        101: 'Lỗi sạc pin' 
    };

    return statusMessages[val] || 'Không xác định'; // Trả về thông báo tương ứng hoặc 'Không xác định' nếu không tìm thấy
};
module.exports = { Error, Canh_bao };