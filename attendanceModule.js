// file: attendanceModule.js

import EmployeeDbModule from './EmployeeDbModule.js';

const AttendanceModule = (() => {
    const ATTENDANCE_KEY = 'attendanceLog';

    // ✅ HELPER: Load logs FRESH từ localStorage
    const _getLogs = () => {
        return JSON.parse(localStorage.getItem(ATTENDANCE_KEY)) || [];
    };

    // ✅ HELPER: Save logs vào localStorage
    const _saveLogs = (logs) => {
        localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(logs));
    };

    /**
     * Ghi nhận check-in cho nhân viên
     */
    const checkIn = (employeeId) => {
        const attendanceLog = _getLogs(); // ✅ Load fresh
        const today = new Date().toLocaleDateString('vi-VN');
        const now = new Date();

        // Kiểm tra xem hôm nay đã check-in chưa
        const existingEntry = attendanceLog.find(log =>
            log.employeeId === employeeId && log.date === today
        );

        if (existingEntry) {
            console.warn('Nhân viên này đã check-in hôm nay rồi.');
            return false;
        }

        attendanceLog.push({
            employeeId,
            date: today,
            checkIn: now.toISOString(),
            checkOut: null
        });

        _saveLogs(attendanceLog); // ✅ Save updated logs
        console.log('Check-in thành công!');
        return true;
    };

    /**
     * Ghi nhận check-out cho nhân viên
     */
    const checkOut = (employeeId) => {
        const attendanceLog = _getLogs(); // ✅ Load fresh
        const today = new Date().toLocaleDateString('vi-VN');
        const now = new Date();

        const entry = attendanceLog.find(log =>
            log.employeeId === employeeId && log.date === today
        );

        if (!entry) {
            console.warn('Nhân viên chưa check-in hôm nay!');
            return false;
        }

        if (entry.checkOut) {
            console.warn('Nhân viên đã check-out rồi!');
            return false;
        }

        entry.checkOut = now.toISOString();
        _saveLogs(attendanceLog); // ✅ Save updated logs
        console.log('Check-out thành công!');
        return true;
    };

    /**
     * Tính số giờ làm việc giữa check-in và check-out
     */
    const _calculateWorkHours = (checkInISO, checkOutISO) => {
        if (!checkOutISO) return 0;
        const checkInTime = new Date(checkInISO);
        const checkOutTime = new Date(checkOutISO);
        const diffMs = checkOutTime - checkInTime;
        const diffHours = diffMs / (1000 * 60 * 60);
        return Math.max(0, diffHours);
    };

    /**
     * Lấy báo cáo chấm công cho một nhân viên trong khoảng thời gian
     */
    const getAttendanceReport = (employeeId, fromDate, toDate) => {
        const attendanceLog = _getLogs(); // ✅ Load fresh

        const parseViDate = (dateStr) => {
            const [day, month, year] = dateStr.split('/');
            return new Date(year, month - 1, day);
        };

        const from = fromDate ? parseViDate(fromDate) : new Date(0);
        const to = toDate ? parseViDate(toDate) : new Date();

        const filteredLogs = attendanceLog.filter(log => {
            if (log.employeeId !== employeeId) return false;
            const logDate = parseViDate(log.date);
            return logDate >= from && logDate <= to;
        });

        const totalHours = filteredLogs.reduce((sum, log) => {
            const hours = _calculateWorkHours(log.checkIn, log.checkOut);
            return sum + hours;
        }, 0);

        const employee = EmployeeDbModule.getEmployeeById(employeeId);

        return {
            employeeId,
            employeeName: employee ? employee.name : 'Unknown',
            fromDate,
            toDate,
            records: filteredLogs.map(log => ({
                date: log.date,
                checkIn: log.checkIn ? new Date(log.checkIn).toLocaleTimeString('vi-VN') : 'N/A',
                checkOut: log.checkOut ? new Date(log.checkOut).toLocaleTimeString('vi-VN') : 'Chưa checkout',
                workHours: _calculateWorkHours(log.checkIn, log.checkOut).toFixed(2)
            })),
            totalHours: parseFloat(totalHours.toFixed(2)),
            totalDays: filteredLogs.length
        };
    };

    /**
     * ✅ FIX: Đổi tên từ getAllLogs → getAttendanceLogs
     * Lấy tất cả attendance logs RAW
     */
    const getAttendanceLogs = () => {
        return _getLogs(); // ✅ Load fresh
    };

    /**
     * Xóa toàn bộ logs (dùng cho testing)
     */
    const clearAllLogs = () => {
        _saveLogs([]); // ✅ Save empty array
    };

    // ✅ EXPORT với tên đúng
    return {
        checkIn,
        checkOut,
        getAttendanceReport,
        getAttendanceLogs,  // ✅ FIX: Đổi tên từ getAllLogs
        clearAllLogs
    };
})();

export default AttendanceModule;
