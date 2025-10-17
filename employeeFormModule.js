// file: employeeFormModule.js
import DepartmentModule from './departmentModule.js';
import PositionModule from './positionModule.js';

const EmployeeFormModule = (() => {
    let formElement;
    let nameInput, deptSelect, posSelect, salaryInput;
    let submitBtn, cancelBtn;
    let onSubmitCallback; // Hàm callback để gửi dữ liệu về app.js

    // Khởi tạo module, nhận vào element của form và một hàm callback
    const init = (formId, callback) => {
        formElement = document.getElementById(formId);
        if (!formElement) return;

        // Lưu trữ callback để sử dụng khi submit
        onSubmitCallback = callback;

        // Lấy các DOM element của form
        nameInput = formElement.querySelector('#empName');
        deptSelect = formElement.querySelector('#empDept');
        posSelect = formElement.querySelector('#empPos');
        salaryInput = formElement.querySelector('#empSalary');
        submitBtn = formElement.querySelector('#addEmployeeFormBtn');
        cancelBtn = formElement.querySelector('#cancelEditBtn');

        // Gán sự kiện submit cho form
        formElement.addEventListener('submit', _handleSubmit);
        // Gán sự kiện cho nút hủy
        cancelBtn.addEventListener('click', () => resetForm());
    };

    // Hàm nội bộ xử lý submit form
    const _handleSubmit = (e) => {
        e.preventDefault();
        const name = nameInput.value.trim();
        const departmentId = parseInt(deptSelect.value);
        const positionId = parseInt(posSelect.value);
        const salary = parseFloat(salaryInput.value);

        if (!name || !departmentId || !positionId || isNaN(salary)) {
            alert('Vui lòng điền đầy đủ và đúng định dạng thông tin!');
            return;
        }

        const employeeData = { name, departmentId, positionId, salary };

        // Gọi hàm callback đã nhận từ app.js và truyền dữ liệu form vào
        if (onSubmitCallback) {
            onSubmitCallback(employeeData);
        }
    };

    // Hàm public để điền dữ liệu vào form khi sửa
    const fillFormForEdit = (employee) => {
        nameInput.value = employee.name;
        salaryInput.value = employee.salary;
        deptSelect.value = employee.departmentId;
        posSelect.value = employee.positionId;

        submitBtn.textContent = 'Cập nhật';
        cancelBtn.style.display = 'inline-block';
    };

    // Hàm public để reset form về trạng thái ban đầu
    const resetForm = () => {
        formElement.reset();
        submitBtn.textContent = 'Thêm';
        cancelBtn.style.display = 'none';
    };

    return {
        init,
        fillFormForEdit,
        resetForm
    };
})();

export default EmployeeFormModule;
