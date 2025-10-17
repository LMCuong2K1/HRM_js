import AuthModule from "./authModule.js";
import EmployeeDbModule from "./EmployeeDbModule.js";
import DepartmentModule from './departmentModule.js';

// --- PHẦN 1: KHAI BÁO BIẾN ---
const authContainer = document.getElementById('auth-container');
const mainApp = document.getElementById('main-app');
const userDisplay = document.getElementById('userDisplay');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const logoutBtn = document.getElementById('logoutBtn');
const mainMenu = document.getElementById('main-menu');

let editModeId = null; // Biến quản lý trạng thái sửa nhân viên

// --- PHẦN 2: CÁC HÀM RENDER GIAO DIỆN CHO TỪNG MODULE ---

// Hàm render giao diện Quản lý Nhân viên
const initEmployeesView = () => {
    const container = document.getElementById('employees-view');
    // Chỉ render HTML nếu chưa có để tránh gán lại sự kiện
    if (container.innerHTML !== '') return;

    container.innerHTML = `
        <h3>Quản lý Nhân viên</h3>
        <div id="employee-controls">
            <input type="text" id="searchInput" placeholder="Nhập tên để tìm..." />
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
    
    // Lấy các element con sau khi đã render
    const searchInput = container.querySelector('#searchInput');
    const addEmployeeForm = container.querySelector('#addEmployeeForm');
    const addEmployeeFormBtn = container.querySelector('#addEmployeeFormBtn');
    const cancelBtn = container.querySelector('#cancelEditBtn');
    const employeeList = container.querySelector('#employeeList');

    const renderList = (employees) => {
        employeeList.innerHTML = '';
        employees.forEach(emp => {
            const li = document.createElement('li');
            li.textContent = `ID: ${emp.id}, Tên: ${emp.name}, Phòng ban: ${emp.department}, Lương: ${emp.salary}`;
            // ... (code thêm nút Sửa, Xóa như cũ)
            employeeList.appendChild(li);
        });
    };

    // ... (Toàn bộ các hàm xử lý sự kiện như editEmployee, handleDelete, onsubmit, onclick của cancel, sự kiện input của searchInput... bạn chuyển vào đây)

    renderList(EmployeeDbModule.getAllEmployees());
};


// Hàm render giao diện Quản lý Phòng ban
const initDepartmentsView = () => {
    const container = document.getElementById('departments-view');
    if (container.innerHTML !== '') return;
    
    container.innerHTML = `
        <h3>Quản lý Phòng ban</h3>
        <form id="dept-form">
            <input type="text" id="dept-name" placeholder="Tên phòng ban mới" required />
            <button type="submit">Thêm</button>
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
        DepartmentModule.add(nameInput.value);
        nameInput.value = '';
        refreshList();
    };

    refreshList();
};


// --- PHẦN 3: ROUTER VÀ CÁC HÀM ĐIỀU KHIỂN CHÍNH ---

// Hàm kích hoạt view
const activateView = (viewId) => {
    document.querySelectorAll('.view').forEach(view => view.style.display = 'none');
    const viewToShow = document.getElementById(viewId);
    if (viewToShow) {
        viewToShow.style.display = 'block';
        
        // Dựa vào viewId để khởi tạo giao diện tương ứng
        if (viewId === 'employees-view') {
            initEmployeesView();
        } else if (viewId === 'departments-view') {
            initDepartmentsView();
        }
    }
};

// Hàm hiển thị Dashboard
const showDashboard = (username) => {
    userDisplay.textContent = username;
    authContainer.style.display = 'none';
    mainApp.style.display = 'flex'; // Sử dụng flex để sidebar và content hiển thị cạnh nhau
    activateView('dashboard-view'); // Hiển thị view tổng quan mặc định
};

// Hàm hiển thị form đăng nhập
const showAuthForms = () => {
    authContainer.style.display = 'block';
    mainApp.style.display = 'none';
};

// --- PHẦN 4: GÁN SỰ KIỆN TOÀN CỤC ---

// Sự kiện cho menu
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

// Sự kiện form
loginForm.onsubmit = async e => { /* ... giữ nguyên ... */ };
registerForm.onsubmit = async e => { /* ... giữ nguyên ... */ };

// --- PHẦN 5: KHỞI ĐỘNG ỨNG DỤNG ---
if (AuthModule.isLoggedIn()) {
    showDashboard(AuthModule.currentUser());
} else {
    showAuthForms();
}
