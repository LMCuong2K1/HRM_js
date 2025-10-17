import AuthModule from "./authModule.js";
import EmployeeDbModule from "./EmployeeDbModule.js";
import DepartmentModule from './departmentModule.js';

// --- PHẦN 1: LẤY CÁC DOM ELEMENT TOÀN CỤC ---
const authContainer = document.getElementById('auth-container');
const mainApp = document.getElementById('main-app');
const userDisplay = document.getElementById('userDisplay');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const logoutBtn = document.getElementById('logoutBtn');
const mainMenu = document.getElementById('main-menu');

let editModeId = null; // Biến trạng thái cho việc sửa nhân viên

// --- PHẦN 2: CÁC HÀM KHỞI TẠO GIAO DIỆN (VIEWS) ---

/**
 * Khởi tạo giao diện và gán sự kiện cho module Quản lý Nhân viên.
 * Chỉ chạy một lần khi người dùng truy cập view này lần đầu.
 */
const initEmployeesView = () => {
    const container = document.getElementById('employees-view');
    // Kiểm tra để đảm bảo chỉ render HTML một lần duy nhất
    if (container.innerHTML.trim() !== '') return;

    container.innerHTML = `
        <h3>Quản lý Nhân viên</h3>
        <div id="employee-controls">
            <input type="text" id="searchInput" placeholder="Nhập tên nhân viên để tìm..." />
        </div>
        <form id="addEmployeeForm">
            <input type="text" id="empName" placeholder="Tên nhân viên" required />
            <input type="text" id="empDept" placeholder="Phòng ban" required />
            <input type="number" id="empSalary" placeholder="Lương" required />
            <button type="submit" id="addEmployeeFormBtn">Thêm</button>
            <button type="button" id="cancelEditBtn" style="display:none;">Hủy</button>
        </form>
        <ul id="employeeList"></ul>
    `;
    
    // Lấy các element con sau khi đã render vào container
    const searchInput = container.querySelector('#searchInput');
    const addEmployeeForm = container.querySelector('#addEmployeeForm');
    const addEmployeeFormBtn = container.querySelector('#addEmployeeFormBtn');
    const cancelBtn = container.querySelector('#cancelEditBtn');
    const employeeList = container.querySelector('#employeeList');

    // Hàm vẽ lại danh sách nhân viên
    const renderList = (employees) => {
        employeeList.innerHTML = '';
        employees.forEach(emp => {
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

            employeeList.appendChild(li);
        });
    };
    
    // Hàm xử lý khi bấm nút "Sửa"
    const editEmployee = (id) => {
        const emp = EmployeeDbModule.getAllEmployees().find(e => e.id === id);
        if (!emp) return;

        container.querySelector('#empName').value = emp.name;
        container.querySelector('#empDept').value = emp.department;
        container.querySelector('#empSalary').value = emp.salary;

        editModeId = id;
        addEmployeeFormBtn.textContent = 'Cập nhật';
        cancelBtn.style.display = 'inline-block';
    };

    // Hàm xử lý khi bấm nút "Xóa"
    const handleDelete = (id) => {
        if (confirm('Bạn có chắc chắn muốn xóa nhân viên này không?')) {
            EmployeeDbModule.deleteEmployee(id);
            renderList(EmployeeDbModule.getAllEmployees());
            alert('Đã xóa nhân viên thành công!');
        }
    };
    
    // Gán sự kiện cho form Thêm/Sửa
    addEmployeeForm.onsubmit = (e) => {
        e.preventDefault();
        const name = container.querySelector('#empName').value.trim();
        const department = container.querySelector('#empDept').value.trim();
        const salary = parseFloat(container.querySelector('#empSalary').value);

        if (!name || !department || isNaN(salary)) {
            alert('Vui lòng điền đầy đủ và đúng định dạng thông tin!');
            return;
        }

        if (editModeId) {
            EmployeeDbModule.updateEmployee(editModeId, { name, department, salary });
            alert('Cập nhật thành công!');
        } else {
            EmployeeDbModule.addEmployee({ name, department, salary });
            alert('Thêm nhân viên thành công!');
        }

        editModeId = null;
        addEmployeeForm.reset();
        addEmployeeFormBtn.textContent = 'Thêm';
        cancelBtn.style.display = 'none';
        renderList(EmployeeDbModule.getAllEmployees());
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
        renderList(filteredEmployees);
    });

    // Hiển thị danh sách nhân viên lần đầu khi view được kích hoạt
    renderList(EmployeeDbModule.getAllEmployees());
};

/**
 * Khởi tạo giao diện và gán sự kiện cho module Quản lý Phòng ban.
 */
const initDepartmentsView = () => {
    const container = document.getElementById('departments-view');
    if (container.innerHTML.trim() !== '') return;
    
    container.innerHTML = `
        <h3>Quản lý Phòng ban</h3>
        <form id="dept-form">
            <input type="text" id="dept-name" placeholder="Tên phòng ban mới" required />
            <button type="submit">Thêm Phòng ban</button>
        </form>
        <ul id="dept-list"></ul>
    `;

    const listEl = container.querySelector('#dept-list');
    const formEl = container.querySelector('#dept-form');
    const nameInput = container.querySelector('#dept-name');

    const refreshList = () => {
        listEl.innerHTML = '';
        DepartmentModule.getAll().forEach(dept => {
            const li = document.createElement('li');
            li.textContent = `ID: ${dept.id} - ${dept.name}`;
            listEl.appendChild(li);
        });
    };

    formEl.onsubmit = e => {
        e.preventDefault();
        const newName = nameInput.value.trim();
        if (newName) {
            DepartmentModule.add(newName);
            nameInput.value = '';
            refreshList();
        }
    };

    refreshList();
};

// --- PHẦN 3: ROUTER VÀ CÁC HÀM ĐIỀU KHIỂN CHÍNH ---

/**
 * Hàm kích hoạt một view cụ thể và ẩn các view khác.
 * Đồng thời gọi hàm init tương ứng để chuẩn bị giao diện.
 */
const activateView = (viewId) => {
    document.querySelectorAll('.view').forEach(view => view.style.display = 'none');
    
    const viewToShow = document.getElementById(viewId);
    if (viewToShow) {
        viewToShow.style.display = 'block';
        
        // Dựa vào viewId để gọi hàm khởi tạo giao diện tương ứng
        switch (viewId) {
            case 'employees-view':
                initEmployeesView();
                break;
            case 'departments-view':
                initDepartmentsView();
                break;
            // Thêm các case khác cho module tương lai
        }
    }
};

// Hàm hiển thị Dashboard chính
const showDashboard = (username) => {
    userDisplay.textContent = username;
    authContainer.style.display = 'none';
    mainApp.style.display = 'flex';
    activateView('dashboard-view'); // Mặc định hiển thị view tổng quan
};

// Hàm hiển thị các form xác thực
const showAuthForms = () => {
    authContainer.style.display = 'block';
    mainApp.style.display = 'none';
};

// --- PHẦN 4: GÁN CÁC SỰ KIỆN TOÀN CỤC ---

// Sự kiện click cho menu điều hướng
mainMenu.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && e.target.dataset.module) {
        e.preventDefault();
        activateView(`${e.target.dataset.module}-view`);
    }
});

// Sự kiện đăng xuất
logoutBtn.addEventListener('click', () => {
    AuthModule.logout();
    showAuthForms();
});

// Sự kiện cho form đăng nhập
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

// Sự kiện cho form đăng ký
registerForm.onsubmit = async (e) => {
    e.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    const result = await AuthModule.register(username, password);
    alert(result.message);
    if (result.success) {
        loginForm.reset();
        registerForm.reset();
    }
};

// --- PHẦN 5: KHỞI ĐỘNG ỨNG DỤNG ---
document.addEventListener('DOMContentLoaded', () => {
    if (AuthModule.isLoggedIn()) {
        showDashboard(AuthModule.currentUser());
    } else {
        showAuthForms();
    }
});
