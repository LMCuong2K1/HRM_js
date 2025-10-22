// file: leaveModule.js

import EmployeeDbModule from './EmployeeDbModule.js';

const LeaveModule = (() => {
    const LEAVE_REQUESTS_KEY = 'leaveRequests';
    const LEAVE_BALANCE_KEY = 'leaveBalance';
    const ANNUAL_LEAVE_DEFAULT = 12;

    // ✅ HELPER: Load requests FRESH từ localStorage
    const _getRequests = () => {
        return JSON.parse(localStorage.getItem(LEAVE_REQUESTS_KEY)) || [];
    };

    // ✅ HELPER: Save requests vào localStorage
    const _saveRequests = (requests) => {
        localStorage.setItem(LEAVE_REQUESTS_KEY, JSON.stringify(requests));
    };

    // ✅ HELPER: Load balance FRESH từ localStorage
    const _getBalance = () => {
        return JSON.parse(localStorage.getItem(LEAVE_BALANCE_KEY)) || {};
    };

    // ✅ HELPER: Save balance vào localStorage
    const _saveBalance = (balance) => {
        localStorage.setItem(LEAVE_BALANCE_KEY, JSON.stringify(balance));
    };

    /**
     * Khởi tạo số ngày phép cho nhân viên mới
     */
    const _initializeBalance = (employeeId) => {
        const leaveBalance = _getBalance();
        if (!leaveBalance[employeeId]) {
            leaveBalance[employeeId] = {
                total: ANNUAL_LEAVE_DEFAULT,
                used: 0,
                annual: ANNUAL_LEAVE_DEFAULT  // ✅ Test expects "annual" field
            };
            _saveBalance(leaveBalance);
        }
    };

    /**
     * Tính số ngày nghỉ giữa startDate và endDate
     */
    const _calculateLeaveDays = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return diffDays;
    };

    /**
     * Tạo một yêu cầu nghỉ phép mới
     */
    const requestLeave = (employeeId, startDate, endDate, type = 'annual', reason = '') => {
        // Load fresh data
        const leaveRequests = _getRequests();
        const leaveBalance = _getBalance();

        // Khởi tạo balance nếu chưa có
        _initializeBalance(employeeId);
        const balance = _getBalance()[employeeId];

        // Tính số ngày nghỉ
        const leaveDays = _calculateLeaveDays(startDate, endDate);

        // Kiểm tra balance nếu là annual leave
        if (type === 'annual') {
            if (balance.annual < leaveDays) {
                console.warn(`Không đủ số ngày phép! Còn lại: ${balance.annual} ngày, yêu cầu: ${leaveDays} ngày`);
                return null; // ✅ Return null thay vì throw error (cho test)
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
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        leaveRequests.push(newRequest);
        _saveRequests(leaveRequests);
        return newRequest;
    };

    /**
     * ✅ THÊM: Approve leave request (wrapper cho test)
     */
    const approveLeave = (requestId) => {
        const leaveRequests = _getRequests();
        const leaveBalance = _getBalance(); // ✅ Load fresh

        const request = leaveRequests.find(r => r.id === requestId);
        if (!request) {
            console.warn('Không tìm thấy yêu cầu nghỉ phép!');
            return false;
        }

        if (request.status !== 'pending') {
            console.warn('Yêu cầu này đã được xử lý rồi!');
            return false;
        }

        request.status = 'approved';
        request.processedAt = new Date().toISOString();

        // ✅ FIX: Update balance correctly
        if (request.type === 'annual') {
            _initializeBalance(request.employeeId);

            // ✅ CRITICAL: Load fresh balance AGAIN after init
            const updatedBalance = _getBalance();
            const empBalance = updatedBalance[request.employeeId];

            empBalance.used += request.leaveDays;
            empBalance.annual = empBalance.total - empBalance.used;

            // ✅ Save updated balance object
            _saveBalance(updatedBalance);
        }

        _saveRequests(leaveRequests);
        return true;
    };


    /**
     * ✅ THÊM: Reject leave request (wrapper cho test)
     */
    const rejectLeave = (requestId) => {
        const leaveRequests = _getRequests();

        const request = leaveRequests.find(r => r.id === requestId);
        if (!request) {
            console.warn('Không tìm thấy yêu cầu nghỉ phép!');
            return false;
        }

        if (request.status !== 'pending') {
            console.warn('Yêu cầu này đã được xử lý rồi!');
            return false;
        }

        request.status = 'rejected';
        request.processedAt = new Date().toISOString();
        _saveRequests(leaveRequests);
        return true;
    };

    /**
     * Cập nhật trạng thái của một yêu cầu nghỉ phép (generic method)
     */
    const updateLeaveStatus = (requestId, status) => {
        if (status === 'approved') {
            return approveLeave(requestId);
        } else if (status === 'rejected') {
            return rejectLeave(requestId);
        }
        return false;
    };

    /**
     * Lấy số ngày phép còn lại của nhân viên
     */
    const getLeaveBalance = (employeeId) => {
        _initializeBalance(employeeId);
        const leaveBalance = _getBalance();
        const balance = leaveBalance[employeeId];

        const employee = EmployeeDbModule.getEmployeeById(employeeId);
        const leaveRequests = _getRequests();
        const employeeRequests = leaveRequests.filter(r => r.employeeId === employeeId);
        const pendingRequests = employeeRequests.filter(r => r.status === 'pending');
        const approvedRequests = employeeRequests.filter(r => r.status === 'approved');

        return {
            employeeId,
            employeeName: employee ? employee.name : 'Unknown',
            total: balance.total,
            used: balance.used,
            annual: balance.annual, // ✅ Test expects "annual" field
            remaining: balance.annual,
            pendingRequests: pendingRequests.length,
            approvedRequests: approvedRequests.length,
            requests: employeeRequests
        };
    };

    /**
     * ✅ THÊM: Alias getAllRequests() cho test
     */
    const getAllRequests = (filterStatus = 'all') => {
        const leaveRequests = _getRequests();
        if (filterStatus === 'all') {
            return leaveRequests;
        }
        return leaveRequests.filter(r => r.status === filterStatus);
    };

    /**
     * Lấy tất cả yêu cầu nghỉ phép (old name for compatibility)
     */
    const getAllLeaveRequests = (filterStatus = 'all') => {
        return getAllRequests(filterStatus);
    };

    /**
     * Reset số ngày phép hàng năm
     */
    const resetAnnualLeave = (employeeId = null) => {
        const leaveBalance = _getBalance();

        if (employeeId) {
            leaveBalance[employeeId] = {
                total: ANNUAL_LEAVE_DEFAULT,
                used: 0,
                annual: ANNUAL_LEAVE_DEFAULT
            };
        } else {
            const allEmployees = EmployeeDbModule.getAllEmployees();
            allEmployees.forEach(emp => {
                leaveBalance[emp.id] = {
                    total: ANNUAL_LEAVE_DEFAULT,
                    used: 0,
                    annual: ANNUAL_LEAVE_DEFAULT
                };
            });
        }

        _saveBalance(leaveBalance);
    };

    // ✅ EXPORT đầy đủ functions
    return {
        requestLeave,
        approveLeave,        // ✅ THÊM
        rejectLeave,         // ✅ THÊM
        updateLeaveStatus,
        getLeaveBalance,
        getAllRequests,      // ✅ THÊM (alias)
        getAllLeaveRequests,
        resetAnnualLeave
    };
})();

export default LeaveModule;
