// file: leaveModule.js
import EmployeeDbModule from './EmployeeDbModule.js';

const LeaveModule = (() => {
    const LEAVE_REQUESTS_KEY = 'leaveRequests';
    const LEAVE_BALANCE_KEY = 'leaveBalance';
    const ANNUAL_LEAVE_DEFAULT = 12; // Mỗi nhân viên có 12 ngày phép năm

    let leaveRequests = JSON.parse(localStorage.getItem(LEAVE_REQUESTS_KEY)) || [];
    let leaveBalance = JSON.parse(localStorage.getItem(LEAVE_BALANCE_KEY)) || {};

    const _saveRequests = () => {
        localStorage.setItem(LEAVE_REQUESTS_KEY, JSON.stringify(leaveRequests));
    };

    const _saveBalance = () => {
        localStorage.setItem(LEAVE_BALANCE_KEY, JSON.stringify(leaveBalance));
    };

    /**
     * Khởi tạo số ngày phép cho nhân viên mới
     * @param {number} employeeId
     */
    const _initializeBalance = (employeeId) => {
        if (!leaveBalance[employeeId]) {
            leaveBalance[employeeId] = {
                total: ANNUAL_LEAVE_DEFAULT,
                used: 0,
                remaining: ANNUAL_LEAVE_DEFAULT
            };
            _saveBalance();
        }
    };

    /**
     * Tính số ngày nghỉ giữa startDate và endDate
     * @param {string} startDate - Format 'YYYY-MM-DD'
     * @param {string} endDate - Format 'YYYY-MM-DD'
     * @returns {number} Số ngày nghỉ
     */
    const _calculateLeaveDays = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 để tính cả ngày bắt đầu
        return diffDays;
    };

    /**
     * Tạo một yêu cầu nghỉ phép mới
     * @param {number} employeeId
     * @param {string} startDate - Định dạng 'YYYY-MM-DD'
     * @param {string} endDate - Định dạng 'YYYY-MM-DD'
     * @param {string} type - Loại nghỉ: 'annual' (phép năm), 'sick' (ốm đau), 'unpaid' (không lương)
     * @param {string} reason - Lý do nghỉ
     */
    const requestLeave = (employeeId, startDate, endDate, type = 'annual', reason = '') => {
        // Khởi tạo balance nếu chưa có
        _initializeBalance(employeeId);

        // Tính số ngày nghỉ
        const leaveDays = _calculateLeaveDays(startDate, endDate);

        // Kiểm tra balance nếu là annual leave
        if (type === 'annual') {
            const balance = leaveBalance[employeeId];
            if (balance.remaining < leaveDays) {
                throw new Error(
                    `Không đủ số ngày phép! Còn lại: ${balance.remaining} ngày, yêu cầu: ${leaveDays} ngày`
                );
            }
        }

        // Tạo request mới
        const newRequest = {
            id: Date.now(),
            employeeId,
            startDate,
            endDate,
            leaveDays,
            type,
            reason,
            status: 'pending', // 'pending', 'approved', 'rejected'
            createdAt: new Date().toISOString()
        };

        leaveRequests.push(newRequest);
        _saveRequests();
        return newRequest;
    };

    /**
     * Cập nhật trạng thái của một yêu cầu nghỉ phép
     * @param {number} requestId - ID của request
     * @param {string} status - 'approved' hoặc 'rejected'
     */
    const updateLeaveStatus = (requestId, status) => {
        const request = leaveRequests.find(r => r.id === requestId);
        if (!request) {
            throw new Error('Không tìm thấy yêu cầu nghỉ phép!');
        }

        if (request.status !== 'pending') {
            throw new Error('Yêu cầu này đã được xử lý rồi!');
        }

        request.status = status;
        request.processedAt = new Date().toISOString();

        // Nếu approved và là annual leave, trừ số ngày phép
        if (status === 'approved' && request.type === 'annual') {
            _initializeBalance(request.employeeId);
            const balance = leaveBalance[request.employeeId];
            balance.used += request.leaveDays;
            balance.remaining = balance.total - balance.used;
            _saveBalance();
        }

        _saveRequests();
        return request;
    };

    /**
     * Lấy số ngày phép còn lại của nhân viên
     * @param {number} employeeId
     * @returns {object} Object chứa thông tin về ngày phép
     */
    const getLeaveBalance = (employeeId) => {
        _initializeBalance(employeeId);
        const balance = leaveBalance[employeeId];

        // Lấy thông tin nhân viên
        const employee = EmployeeDbModule.getEmployeeById(employeeId);

        // Lấy tất cả các request của nhân viên
        const employeeRequests = leaveRequests.filter(r => r.employeeId === employeeId);
        const pendingRequests = employeeRequests.filter(r => r.status === 'pending');
        const approvedRequests = employeeRequests.filter(r => r.status === 'approved');

        return {
            employeeId,
            employeeName: employee ? employee.name : 'Unknown',
            totalLeave: balance.total,
            usedLeave: balance.used,
            remainingLeave: balance.remaining,
            pendingRequests: pendingRequests.length,
            approvedRequests: approvedRequests.length,
            requests: employeeRequests
        };
    };

    /**
     * Lấy tất cả yêu cầu nghỉ phép
     * @param {string} filterStatus - Lọc theo status: 'all', 'pending', 'approved', 'rejected'
     */
    const getAllLeaveRequests = (filterStatus = 'all') => {
        if (filterStatus === 'all') {
            return leaveRequests;
        }
        return leaveRequests.filter(r => r.status === filterStatus);
    };

    /**
     * Reset số ngày phép hàng năm (dùng cho đầu năm mới)
     * @param {number} employeeId - ID nhân viên cụ thể, hoặc null để reset tất cả
     */
    const resetAnnualLeave = (employeeId = null) => {
        if (employeeId) {
            // Reset cho một nhân viên cụ thể
            if (leaveBalance[employeeId]) {
                leaveBalance[employeeId] = {
                    total: ANNUAL_LEAVE_DEFAULT,
                    used: 0,
                    remaining: ANNUAL_LEAVE_DEFAULT
                };
            }
        } else {
            // Reset cho tất cả nhân viên
            const allEmployees = EmployeeDbModule.getAllEmployees();
            allEmployees.forEach(emp => {
                leaveBalance[emp.id] = {
                    total: ANNUAL_LEAVE_DEFAULT,
                    used: 0,
                    remaining: ANNUAL_LEAVE_DEFAULT
                };
            });
        }
        _saveBalance();
    };

    return {
        requestLeave,
        updateLeaveStatus,
        getLeaveBalance,
        getAllLeaveRequests,
        resetAnnualLeave
    };
})();

export default LeaveModule;
