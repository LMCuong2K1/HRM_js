import EmployeeDbModule from './EmployeeDbModule.js';

const LeaveModule = (() => {
    const LEAVE_REQUESTS_KEY = 'leaveRequests';
    const ANNUAL_LEAVE_DEFAULT = 12; // Mỗi nhân viên có 12 ngày phép năm

    let leaveRequests = JSON.parse(localStorage.getItem(LEAVE_REQUESTS_KEY)) || [];

    const _saveRequests = () => {
        localStorage.setItem(LEAVE_REQUESTS_KEY, JSON.stringify(leaveRequests));
    };

    /**
     * Tạo một yêu cầu nghỉ phép mới.
     * @param {number} employeeId
     * @param {string} startDate - Định dạng 'YYYY-MM-DD'
     * @param {string} endDate - Định dạng 'YYYY-MM-DD'
     * @param {string} reason
     */
    const requestLeave = (employeeId, startDate, endDate, reason) => {
        const newRequest = {
            id: Date.now(),
            employeeId,
            startDate,
            endDate,
            reason,
            status: 'pending' // 'pending', 'approved', 'rejected'
        };
        leaveRequests.push(newRequest);
        _saveRequests();
    };

    /**
     * Cập nhật trạng thái của một yêu cầu nghỉ phép.
     * @param {number} requestId
     * @param {string} status - 'approved' hoặc 'rejected'
     */
    const updateRequestStatus = (requestId, status) => {
        const request = leaveRequests.find(req => req.id === requestId);
        if (request) {
            request.status = status;
            _saveRequests();
            return true;
        }
        return false;
    };

    /**
     * Lấy tất cả các yêu cầu nghỉ phép.
     */
    const getAllRequests = () => {
        // Thêm thông tin tên nhân viên vào mỗi request để dễ hiển thị
        return leaveRequests.map(req => {
            const employee = EmployeeDbModule.getEmployeeById(req.employeeId);
            return {
                ...req,
                employeeName: employee ? employee.name : 'Không rõ'
            };
        });
    };

    return {
        requestLeave,
        updateRequestStatus,
        getAllRequests
    };
})();

export default LeaveModule;
