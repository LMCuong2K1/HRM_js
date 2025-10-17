const AttendanceModule = (() => {
    const ATTENDANCE_KEY = 'attendanceLog';
    let attendanceLog = JSON.parse(localStorage.getItem(ATTENDANCE_KEY)) || [];

    const _saveLog = () => {
        localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(attendanceLog));
    };

    /**
     * Ghi nhận check-in cho nhân viên.
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
            return;
        }

        attendanceLog.push({
            employeeId,
            date: today,
            checkIn: now.toISOString(),
            checkOut: null
        });
        _saveLog();
        alert('Check-in thành công!');
    };

    /**
     * Ghi nhận check-out cho nhân viên.
     * @param {number} employeeId
     */
    const checkOut = (employeeId) => {
        const today = new Date().toLocaleDateString('vi-VN');
        const now = new Date();

        const entry = attendanceLog.find(log =>
            log.employeeId === employeeId && log.date === today
        );

        if (!entry) {
            alert('Nhân viên này chưa check-in hôm nay.');
            return;
        }

        if (entry.checkOut) {
            alert('Nhân viên này đã check-out hôm nay rồi.');
            return;
        }

        entry.checkOut = now.toISOString();
        _saveLog();
        alert('Check-out thành công!');
    };

    /**
     * Lấy toàn bộ lịch sử chấm công.
     */
    const getLog = () => {
        return attendanceLog;
    };

    return {
        checkIn,
        checkOut,
        getLog
    };
})();

export default AttendanceModule;
