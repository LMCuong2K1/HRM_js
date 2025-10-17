// file: attendanceModule.js
import EmployeeDbModule from './EmployeeDbModule.js';

const AttendanceModule = (() => {
    const ATTENDANCE_KEY = 'attendanceLog';
    let attendanceLog = JSON.parse(localStorage.getItem(ATTENDANCE_KEY)) || [];

    const _saveLog = () => {
        localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(attendanceLog));
    };

    /**
     * Ghi nhận check-in cho nhân viên
     * @param {number} employeeId
     */
    const checkIn = (employeeId) => {
        const today = new Date().toLocaleDateString('vi-VN');
        const now = new Date();

        // Kiểm tra xem hôm nay đã check-in chưa
        const existingEntry = attendanceLog.find(log =>
            log.employeeId === employeeId && log.date === today
        );

        if (existingEntry) {
            alert('Nhân viên này đã check-in hôm nay rồi.');
            return false;
        }

        attendanceLog.push({
            employeeId,
            date: today,
            checkIn: now.toISOString(),
            checkOut: null
        });
        _saveLog();
        alert('Check-in thành công!');
        return true;
    };

    /**
     * Ghi nhận check-out cho nhân viên
     * @param {number} employeeId
     */
    const checkOut = (employeeId) => {
        const today = new Date().toLocaleDateString('vi-VN');
        const now = new Date();

        const entry = attendanceLog.find(log =>
            log.employeeId === employeeId && log.date === today
        );

        if (!entry) {
            alert('Nhân viên chưa check-in hôm nay!');
            return false;
        }

        if (entry.checkOut) {
            alert('Nhân viên đã check-out rồi!');
            return false;
        }

        entry.checkOut = now.toISOString();
        _saveLog();
        alert('Check-out thành công!');
        return true;
    };

    /**
     * Tính số giờ làm việc giữa check-in và check-out
     * @param {string} checkInISO - Thời gian check-in (ISO format)
     * @param {string} checkOutISO - Thời gian check-out (ISO format)
     * @returns {number} Số giờ làm việc
     */
    const _calculateWorkHours = (checkInISO, checkOutISO) => {
        if (!checkOutISO) return 0;
        const checkInTime = new Date(checkInISO);
        const checkOutTime = new Date(checkOutISO);
        const diffMs = checkOutTime - checkInTime;
        const diffHours = diffMs / (1000 * 60 * 60); // Chuyển milliseconds sang giờ
        return Math.max(0, diffHours); // Đảm bảo không âm
    };

    /**
     * Lấy báo cáo chấm công cho một nhân viên trong khoảng thời gian
     * @param {number} employeeId - ID nhân viên
     * @param {string} fromDate - Ngày bắt đầu (format: 'DD/MM/YYYY')
     * @param {string} toDate - Ngày kết thúc (format: 'DD/MM/YYYY')
     * @returns {object} Object chứa logs và tổng số giờ
     */
    const getAttendanceReport = (employeeId, fromDate, toDate) => {
        // Chuyển đổi format ngày từ DD/MM/YYYY sang Date object để so sánh
        const parseViDate = (dateStr) => {
            const [day, month, year] = dateStr.split('/');
            return new Date(year, month - 1, day);
        };

        const from = fromDate ? parseViDate(fromDate) : new Date(0); // Từ epoch nếu không có
        const to = toDate ? parseViDate(toDate) : new Date(); // Đến hiện tại nếu không có

        // Lọc logs theo employeeId và khoảng thời gian
        const filteredLogs = attendanceLog.filter(log => {
            if (log.employeeId !== employeeId) return false;
            const logDate = parseViDate(log.date);
            return logDate >= from && logDate <= to;
        });

        // Tính tổng giờ làm
        const totalHours = filteredLogs.reduce((sum, log) => {
            const hours = _calculateWorkHours(log.checkIn, log.checkOut);
            return sum + hours;
        }, 0);

        // Lấy thông tin nhân viên
        const employee = EmployeeDbModule.getEmployeeById(employeeId);

        return {
            employeeId,
            employeeName: employee ? employee.name : 'Unknown',
            fromDate,
            toDate,
            logs: filteredLogs.map(log => ({
                date: log.date,
                checkIn: log.checkIn ? new Date(log.checkIn).toLocaleTimeString('vi-VN') : 'N/A',
                checkOut: log.checkOut ? new Date(log.checkOut).toLocaleTimeString('vi-VN') : 'Chưa checkout',
                workHours: _calculateWorkHours(log.checkIn, log.checkOut).toFixed(2)
            })),
            totalHours: totalHours.toFixed(2),
            totalDays: filteredLogs.length
        };
    };

    /**
     * Lấy tất cả attendance logs
     */
    const getAllLogs = () => attendanceLog;

    /**
     * Xóa toàn bộ logs (dùng cho testing)
     */
    const clearAllLogs = () => {
        attendanceLog = [];
        _saveLog();
    };

    return {
        checkIn,
        checkOut,
        getAttendanceReport,
        getAllLogs,
        clearAllLogs
    };
})();

export default AttendanceModule;
