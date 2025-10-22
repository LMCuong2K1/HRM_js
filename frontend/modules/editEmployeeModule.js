// file: editEmployeeModule.js
import EmployeeDbModule from './EmployeeDbModule.js';
import DepartmentModule from './departmentModule.js';
import PositionModule from './positionModule.js';

const EditEmployeeModule = (() => {
    // Sử dụng closure để lưu trạng thái edit
    let currentEmployeeId = null;

    /**
     * Render form tìm kiếm và edit nhân viên
     * @param {HTMLElement} container 
     * @param {Function} onSuccess 
     */
    const renderForm = (container, onSuccess) => {
        const departments = DepartmentModule.getAll();
        const positions = PositionModule.getAll();

        container.innerHTML = `
            <div class="form-container">
                <h3>Sửa Thông tin Nhân viên</h3>
                
                <!-- Form tìm kiếm nhân viên -->
                <div class="search-section">
                    <h4>Tìm kiếm nhân viên để sửa</h4>
                    <div class="form-group">
                        <label for="searchEmpId">Nhập ID hoặc Tên nhân viên:</label>
                        <input type="text" id="searchEmpId" placeholder="VD: 1 hoặc Nguyễn Văn A">
                    </div>
                    <button type="button" id="searchEmpBtn" class="btn-secondary">Tìm kiếm</button>
                </div>
                
                <!-- Form edit (ẩn ban đầu) -->
                <form id="editEmployeeForm" style="display: none;">
                    <h4>Chỉnh sửa thông tin</h4>
                    <input type="hidden" id="editEmpId">
                    
                    <div class="form-group">
                        <label for="editEmpName">Họ và Tên:</label>
                        <input type="text" id="editEmpName" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="editEmpDept">Phòng ban:</label>
                        <select id="editEmpDept" required>
                            ${departments.map(d => `<option value="${d.id}">${d.name}</option>`).join('')}
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="editEmpPos">Vị trí:</label>
                        <select id="editEmpPos" required>
                            ${positions.map(p => `<option value="${p.id}">${p.title}</option>`).join('')}
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="editEmpSalary">Lương cơ bản:</label>
                        <input type="number" id="editEmpSalary" min="0" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="editEmpHireDate">Ngày vào làm:</label>
                        <input type="date" id="editEmpHireDate" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="editEmpBonus">Thưởng:</label>
                        <input type="number" id="editEmpBonus" min="0" value="0">
                    </div>
                    
                    <div class="form-group">
                        <label for="editEmpDeduction">Khấu trừ:</label>
                        <input type="number" id="editEmpDeduction" min="0" value="0">
                    </div>
                    
                    <button type="submit" class="btn-primary">Lưu Thay đổi</button>
                    <button type="button" id="cancelEditBtn" class="btn-secondary">Hủy</button>
                </form>
                
                <div id="editEmployeeMessage" class="message"></div>
            </div>
        `;

        setupEventListeners(container, onSuccess);
    };

    const setupEventListeners = (container, onSuccess) => {
        const searchBtn = container.querySelector('#searchEmpBtn');
        const searchInput = container.querySelector('#searchEmpId');
        const editForm = container.querySelector('#editEmployeeForm');
        const cancelBtn = container.querySelector('#cancelEditBtn');
        const messageDiv = container.querySelector('#editEmployeeMessage');

        // Tìm kiếm nhân viên
        searchBtn.addEventListener('click', () => {
            const searchValue = searchInput.value.trim();
            if (!searchValue) {
                showMessage(messageDiv, 'Vui lòng nhập ID hoặc tên nhân viên!', 'error');
                return;
            }

            // Tìm theo ID hoặc tên
            let employee;
            if (!isNaN(searchValue)) {
                employee = EmployeeDbModule.getEmployeeById(parseInt(searchValue));
            } else {
                const allEmployees = EmployeeDbModule.getAllEmployees();
                employee = allEmployees.find(emp =>
                    emp.name.toLowerCase().includes(searchValue.toLowerCase())
                );
            }

            if (employee) {
                loadEmployeeData(container, employee);
                editForm.style.display = 'block';
                currentEmployeeId = employee.id;
                showMessage(messageDiv, `Đã tìm thấy nhân viên: ${employee.name}`, 'success');
            } else {
                showMessage(messageDiv, 'Không tìm thấy nhân viên!', 'error');
                editForm.style.display = 'none';
            }
        });

        // Submit form edit
        editForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (!currentEmployeeId) {
                showMessage(messageDiv, 'Lỗi: Không xác định được nhân viên!', 'error');
                return;
            }

            const updatedData = {
                name: editForm.querySelector('#editEmpName').value.trim(),
                departmentId: parseInt(editForm.querySelector('#editEmpDept').value),
                positionId: parseInt(editForm.querySelector('#editEmpPos').value),
                salary: parseFloat(editForm.querySelector('#editEmpSalary').value),
                hireDate: editForm.querySelector('#editEmpHireDate').value,
                bonus: parseFloat(editForm.querySelector('#editEmpBonus').value) || 0,
                deduction: parseFloat(editForm.querySelector('#editEmpDeduction').value) || 0
            };

            // Validation
            if (!updatedData.name || updatedData.name.length < 2) {
                showMessage(messageDiv, 'Tên nhân viên phải có ít nhất 2 ký tự!', 'error');
                return;
            }

            if (updatedData.salary <= 0) {
                showMessage(messageDiv, 'Lương phải lớn hơn 0!', 'error');
                return;
            }

            // Confirm trước khi save
            const isConfirmed = window.confirm('Bạn có chắc chắn muốn lưu thay đổi?');
            if (!isConfirmed) return;

            try {
                await delay(500);
                EmployeeDbModule.updateEmployee(currentEmployeeId, updatedData);
                showMessage(messageDiv, 'Đã cập nhật thông tin nhân viên thành công!', 'success');

                // Reset form sau 1.5s
                setTimeout(() => {
                    editForm.style.display = 'none';
                    searchInput.value = '';
                    currentEmployeeId = null;
                    if (onSuccess) onSuccess();
                }, 1500);
            } catch (error) {
                showMessage(messageDiv, 'Có lỗi xảy ra khi cập nhật!', 'error');
                console.error(error);
            }
        });

        // Hủy edit
        cancelBtn.addEventListener('click', () => {
            editForm.style.display = 'none';
            searchInput.value = '';
            currentEmployeeId = null;
        });
    };

    const loadEmployeeData = (container, employee) => {
        const form = container.querySelector('#editEmployeeForm');
        form.querySelector('#editEmpId').value = employee.id;
        form.querySelector('#editEmpName').value = employee.name;
        form.querySelector('#editEmpDept').value = employee.departmentId;
        form.querySelector('#editEmpPos').value = employee.positionId;
        form.querySelector('#editEmpSalary').value = employee.salary;
        form.querySelector('#editEmpHireDate').value = employee.hireDate;
        form.querySelector('#editEmpBonus').value = employee.bonus || 0;
        form.querySelector('#editEmpDeduction').value = employee.deduction || 0;
    };

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

export default EditEmployeeModule;
