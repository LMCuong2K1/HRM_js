import AuthModule from "./authModule.js";
import EmployeeDbModule from "./EmployeeDbModule.js";

// --- PHẦN 1: KHAI BÁO BIẾN VÀ LẤY DOM ELEMENT ---
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const dashboard = document.getElementById('dashboard');
const userDisplay = document.getElementById('userDisplay');
const logoutBtn = document.getElementById('logoutBtn');
const searchInput = document.getElementById('searchInput');
const addEmployeeForm = document.getElementById('addEmployeeForm');
const addEmployeeFormBtn = document.getElementById('addEmployeeFormBtn');
const cancelBtn = document.getElementById('cancelEditBtn');

let editModeId = null; // Biến quản lý trạng thái sửa

// --- PHẦN 2: CÁC HÀM XỬ LÝ GIAO DIỆN CHÍNH ---

// Hàm hiển thị giao diện Dashboard sau khi đăng nhập thành công
const showDashboard = (username) => {
    userDisplay.textContent = username;
    dashboard.style.display = 'block';
    loginForm.style.display = 'none';
    registerForm.style.display = 'none';

    // --- Toàn bộ logic quản lý nhân viên nằm ở đây ---

    // Hàm vẽ lại danh sách nhân viên
    const renderEmployeeList = (employeesToRender) => {
        const ul = document.getElementById('employeeList');
        ul.innerHTML = '';

        employeesToRender.forEach(emp => {
            const li = document.createElement('li');
            li.textContent = `ID: ${emp.id}, Tên: ${emp.name}, Phòng ban: ${emp.department}, Lương: ${emp.salary}`;

            const editBtn = document.createElement('button');
            editBtn.textContent = 'Sửa';
            editBtn.onclick = () => editEmployee(emp.id);
            li.appendChild(editBtn);

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Xóa';
            deleteBtn.onclick = () => handleDelete(emp.id);
            li.appendChild(deleteBtn);

            ul.appendChild(li);
        });
    };

    // Hàm xử lý khi bấm nút "Sửa"
    const editEmployee = (id) => {
        const emp = EmployeeDbModule.getAllEmployees().find(e => e.id === id);
        if (!emp) return;

        document.getElementById('empName').value = emp.name;
        document.getElementById('empDept').value = emp.department;
        document.getElementById('empSalary').value = emp.salary;

        editModeId = id;
        addEmployeeFormBtn.textContent = 'Cập nhật';
        cancelBtn.style.display = 'inline-block';
    };

    // Hàm xử lý khi bấm nút "Xóa"
    const handleDelete = (id) => {
        if (confirm('Bạn có chắc chắn muốn xóa nhân viên này không?')) {
            EmployeeDbModule.deleteEmployee(id);
            renderEmployeeList(EmployeeDbModule.getAllEmployees());
            alert('Đã xóa nhân viên thành công!');
        }
    };

    // Gán sự kiện cho form Thêm/Sửa
    addEmployeeForm.onsubmit = (e) => {
        e.preventDefault();
        const name = document.getElementById('empName').value.trim();
        const department = document.getElementById('empDept').value.trim();
        const salary = parseFloat(document.getElementById('empSalary').value);

        if (!name || !department || isNaN(salary)) {
            alert('Vui lòng điền đầy đủ và đúng định dạng thông tin!');
            return;
        }

        const employeeData = { name, department, salary };

        if (editModeId) {
            EmployeeDbModule.updateEmployee(editModeId, employeeData);
            alert('Cập nhật thành công!');
        } else {
            EmployeeDbModule.addEmployee(employeeData);
            alert('Thêm nhân viên thành công!');
        }

        editModeId = null;
        addEmployeeForm.reset();
        addEmployeeFormBtn.textContent = 'Thêm';
        cancelBtn.style.display = 'none';
        renderEmployeeList(EmployeeDbModule.getAllEmployees());
    };

    // Gán sự kiện cho nút "Hủy"
    cancelBtn.onclick = () => {
        editModeId = null;
        addEmployeeForm.reset();
        addEmployeeFormBtn.textContent = 'Thêm';
        cancelBtn.style.display = 'none';
    };

    // Gán sự kiện cho ô tìm kiếm
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const allEmployees = EmployeeDbModule.getAllEmployees();
        const filteredEmployees = allEmployees.filter(emp =>
            emp.name.toLowerCase().includes(searchTerm)
        );
        renderEmployeeList(filteredEmployees);
    });

    // Hiển thị danh sách nhân viên lần đầu
    renderEmployeeList(EmployeeDbModule.getAllEmployees());
};

// Hàm hiển thị form Đăng nhập/Đăng ký
const showForms = () => {
    dashboard.style.display = 'none';
    loginForm.style.display = 'block';
    registerForm.style.display = 'block';
};


// --- PHẦN 3: GÁN SỰ KIỆN CHO CÁC FORM CHÍNH ---
logoutBtn.addEventListener('click', () => {
    AuthModule.logout();
    showForms();
});

loginForm.onsubmit = async (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const result = await AuthModule.login(username, password);
    alert(result.message);
    if (result.success) {
        showDashboard(username);
    }
};

registerForm.onsubmit = async (e) => {
    e.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    const result = await AuthModule.register(username, password);
    alert(result.message);
};


// --- PHẦN 4: KIỂM TRA TRẠNG THÁI ĐĂNG NHẬP KHI TẢI TRANG ---
if (AuthModule.isLoggedIn()) {
    showDashboard(AuthModule.currentUser());
} else {
    showForms();
}
