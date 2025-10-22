// file: addEmployeeModule.js
import EmployeeDbModule from './EmployeeDbModule.js';
import DepartmentModule from './departmentModule.js';
import PositionModule from './positionModule.js';

const AddEmployeeModule = (() => {

    /**
     * Tạo form thêm nhân viên mới
     * @param {HTMLElement} container - Container để render form
     * @param {Function} onSuccess - Callback khi thêm thành công
     */
    const renderForm = (container, onSuccess) => {
        // Lấy danh sách phòng ban và vị trí
        const departments = DepartmentModule.getAll();
        const positions = PositionModule.getAll();

        // Tạo HTML form
        container.innerHTML = `
            <div class="form-container">
                <h3>Thêm Nhân viên Mới</h3>
                <form id="addEmployeeForm">
                    <div class="form-group">
                        <label for="addEmpName">Họ và Tên:</label>
                        <input type="text" id="addEmpName" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="addEmpDept">Phòng ban:</label>
                        <select id="addEmpDept" required>
                            <option value="">-- Chọn phòng ban --</option>
                            ${departments.map(d => `<option value="${d.id}">${d.name}</option>`).join('')}
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="addEmpPos">Vị trí:</label>
                        <select id="addEmpPos" required>
                            <option value="">-- Chọn vị trí --</option>
                            ${positions.map(p => `<option value="${p.id}">${p.title}</option>`).join('')}
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="addEmpSalary">Lương cơ bản:</label>
                        <input type="number" id="addEmpSalary" min="0" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="addEmpHireDate">Ngày vào làm:</label>
                        <input type="date" id="addEmpHireDate" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="addEmpBonus">Thưởng (tùy chọn):</label>
                        <input type="number" id="addEmpBonus" min="0" value="0">
                    </div>
                    
                    <div class="form-group">
                        <label for="addEmpDeduction">Khấu trừ (tùy chọn):</label>
                        <input type="number" id="addEmpDeduction" min="0" value="0">
                    </div>
                    
                    <button type="submit" class="btn-primary">Thêm Nhân viên</button>
                </form>
                <div id="addEmployeeMessage" class="message"></div>
            </div>
        `;

        // Gắn sự kiện submit
        const form = container.querySelector('#addEmployeeForm');
        const messageDiv = container.querySelector('#addEmployeeMessage');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Validate và lấy dữ liệu
            const employeeData = {
                name: form.querySelector('#addEmpName').value.trim(),
                departmentId: parseInt(form.querySelector('#addEmpDept').value),
                positionId: parseInt(form.querySelector('#addEmpPos').value),
                salary: parseFloat(form.querySelector('#addEmpSalary').value),
                hireDate: form.querySelector('#addEmpHireDate').value,
                bonus: parseFloat(form.querySelector('#addEmpBonus').value) || 0,
                deduction: parseFloat(form.querySelector('#addEmpDeduction').value) || 0
            };

            // Validation
            if (!employeeData.name || employeeData.name.length < 2) {
                showMessage(messageDiv, 'Tên nhân viên phải có ít nhất 2 ký tự!', 'error');
                return;
            }

            if (employeeData.salary <= 0) {
                showMessage(messageDiv, 'Lương phải lớn hơn 0!', 'error');
                return;
            }

            if (!employeeData.departmentId || !employeeData.positionId) {
                showMessage(messageDiv, 'Vui lòng chọn phòng ban và vị trí!', 'error');
                return;
            }

            // Giả lập delay với async/await
            try {
                await delay(500);
                const newEmployee = EmployeeDbModule.addEmployee(employeeData);
                showMessage(messageDiv, `Đã thêm nhân viên "${newEmployee.name}" thành công!`, 'success');
                form.reset();

                // Gọi callback nếu có
                if (onSuccess) {
                    setTimeout(() => onSuccess(), 1500);
                }
            } catch (error) {
                showMessage(messageDiv, 'Có lỗi xảy ra khi thêm nhân viên!', 'error');
                console.error(error);
            }
        });
    };

    // Helper functions
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const showMessage = (element, message, type) => {
        element.textContent = message;
        element.className = `message ${type}`;
        element.style.display = 'block';
        setTimeout(() => {
            element.style.display = 'none';
        }, 3000);
    };

    return {
        renderForm
    };
})();

export default AddEmployeeModule;
