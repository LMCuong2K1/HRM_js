
import EmployeeDbModule from './EmployeeDbModule.js';

const DeleteEmployeeModule = (() => {
    /**
     * Xử lý việc xóa một nhân viên.
     * @param {number} employeeId - ID của nhân viên cần xóa.
     * @param {function} onAfterDelete - Hàm callback để chạy sau khi xóa thành công (ví dụ: để render lại danh sách).
     */
    const handleDelete = (employeeId, onAfterDelete) => {
        // Lấy tên nhân viên để hiển thị trong hộp thoại xác nhận
        const employee = EmployeeDbModule.getEmployeeById(employeeId);
        if (!employee) {
            alert('Không tìm thấy nhân viên!');
            return;
        }

        // Hiển thị hộp thoại xác nhận
        const isConfirmed = window.confirm(`Bạn có chắc chắn muốn xóa nhân viên "${employee.name}"?`);

        if (isConfirmed) {
            EmployeeDbModule.deleteEmployee(employeeId);
            alert('Đã xóa nhân viên thành công!');
            // Gọi callback để cập nhật lại giao diện
            if (onAfterDelete) {
                onAfterDelete();
            }
        }
    };

    return {
        handleDelete
    };
})();

export default DeleteEmployeeModule;
