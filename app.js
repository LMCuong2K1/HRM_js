// --- PHẦN IMPORT MODULES ---
import AuthModule from './authModule.js';
import EmployeeDbModule from './EmployeeDbModule.js';
import DepartmentModule from './departmentModule.js';
import PositionModule from './positionModule.js';
import SearchModule from './searchModule.js';
import SalaryModule from './salaryModule.js';
import DeleteEmployeeModule from './deleteEmployeeModule.js';
import EmployeeFormModule from './employeeFormModule.js';
import AttendanceModule from './attendanceModule.js';
import LeaveModule from './leaveModule.js';
import PerformanceModule from './performanceModule.js';

// --- PHẦN 1: LẤY CÁC DOM ELEMENT TOÀN CỤC ---
const authContainer = document.getElementById('auth-container');
const mainApp = document.getElementById('main-app');
const userDisplay = document.getElementById('userDisplay');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const logoutBtn = document.getElementById('logoutBtn');
const mainMenu = document.getElementById('main-menu');

let editModeId = null; // Biến trạng thái cho việc sửa nhân viên

// --- PHẦN 2: CÁC HÀM XỬ LÝ SỰ KIỆN & ĐIỀU KHIỂN CHÍNH ---

/**
 * Hiển thị giao diện chính (dashboard) và ẩn form xác thực.
 * @param {string} username - Tên người dùng để hiển thị.
 */
const showDashboard = (username) => {
    authContainer.style.display = 'none';
    mainApp.style.display = 'block';
    userDisplay.textContent = `Xin chào, ${username}`;
    activateView('dashboard-view');
};

/**
 * Hiển thị form xác thực (đăng nhập/đăng ký) và ẩn giao diện chính.
 */
const showAuthForms = () => {
    mainApp.style.display = 'none';
    authContainer.style.display = 'block';
    document.getElementById('login-box').style.display = 'block';
    document.getElementById('register-box').style.display = 'none';
};

/**
 * Kích hoạt một view cụ thể và ẩn các view khác.
 * @param {string} viewId - ID của view cần hiển thị.
 */
const activateView = (viewId) => {
    document.querySelectorAll('.view').forEach(view => {
        view.style.display = 'none';
    });
    const activeView = document.getElementById(viewId);
    if (activeView) {
        activeView.style.display = 'block';
        // Gọi hàm init tương ứng cho view nếu cần
        switch (viewId) {
            case 'employees-view':
                initEmployeesView();
                break;
            case 'departments-view':
                initDepartmentsView();
                break;
            case 'positions-view':
                initPositionsView();
                break;
            case 'salary-view':
                initSalaryView();
                break;
            case 'attendance-view':
                initAttendanceView();
                break;
            case 'leave-view':
                initLeaveView();
                break;
            case 'performance-view':
                initPerformanceView();
                break;
        }
    }
};

const handleLogin = async (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const result = await AuthModule.login(username, password);

    if (result.success) {
        showDashboard(username);
    } else {
        alert(result.message);
    }
};

const handleRegister = async (e) => {
    e.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    const result = await AuthModule.register(username, password);

    alert(result.message);
    if (result.success) {
        document.getElementById('registerForm').reset();
        document.getElementById('register-box').style.display = 'none';
        document.getElementById('login-box').style.display = 'block';
    }
};

const handleLogout = () => {
    AuthModule.logout();
    showAuthForms();
};

const checkLoginStatus = () => {
    const user = AuthModule.getCurrentUser();
    if (user) {
        showDashboard(user.username);
    } else {
        showAuthForms();
    }
};


// --- PHẦN 3: CÁC HÀM KHỞI TẠO VÀ RENDER CHO TỪNG VIEW ---

const renderEmployeeList = (employeeList) => {
    const list = employeeList || EmployeeDbModule.getAllEmployees();
    const tableBody = document.getElementById('employee-list');
    tableBody.innerHTML = '';
    list.forEach(emp => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${emp.id}</td>
            <td>${emp.name}</td>
            <td>${emp.department}</td>
            <td>${emp.position}</td>
            <td>
                <button class="edit-btn" data-id="${emp.id}">Sửa</button>
                <button class="delete-btn" data-id="${emp.id}">Xóa</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
};

const initEmployeesView = () => {
    const container = document.getElementById('employees-view');
    if (container.querySelector('#employee-form')) return;

    container.innerHTML = `
        <h3>Quản lý Nhân viên</h3>
        <div id="employee-form-container"></div>
        <div id="search-container">
            <input type="text" id="searchInput" placeholder="Tìm kiếm nhân viên...">
            <button id="searchBtn">Tìm</button>
        </div>
        <table id="employee-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Tên</th>
                    <th>Phòng ban</th>
                    <th>Vị trí</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody id="employee-list"></tbody>
        </table>
    `;

    EmployeeFormModule.renderForm(document.getElementById('employee-form-container'));
    document.getElementById('employee-form').addEventListener('submit', EmployeeFormModule.handleSubmit);
    document.getElementById('searchBtn').addEventListener('click', () => {
        const query = document.getElementById('searchInput').value;
        const results = SearchModule.searchByName(query);
        renderEmployeeList(results);
    });
    document.getElementById('employee-list').addEventListener('click', async (e) => {
        const id = e.target.dataset.id;
        if (e.target.classList.contains('delete-btn')) {
            await DeleteEmployeeModule.handleDelete(id);
            renderEmployeeList();
        }
        if (e.target.classList.contains('edit-btn')) {
            EmployeeFormModule.handleEdit(id);
        }
    });

    renderEmployeeList();
};

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

const initPositionsView = () => {
    const container = document.getElementById('positions-view');
    if (container.innerHTML.trim() !== '') return;

    container.innerHTML = `
      <h3>Quản lý Vị trí</h3>
      <form id="pos-form">
          <input type="text" id="pos-title" placeholder="Tên vị trí mới" required />
          <button type="submit">Thêm Vị trí</button>
      </form>
      <ul id="pos-list"></ul>
  `;

    const listEl = container.querySelector('#pos-list');
    const formEl = container.querySelector('#pos-form');
    const titleInput = container.querySelector('#pos-title');
    const submitBtn = formEl.querySelector('button');

    const refreshList = () => {
        listEl.innerHTML = '';
        PositionModule.getAll().forEach(pos => {
            const li = document.createElement('li');
            li.textContent = `ID: ${pos.id} - ${pos.title}`;
            listEl.appendChild(li);
        });
    };

    formEl.onsubmit = async (e) => {
        e.preventDefault();
        const newTitle = titleInput.value.trim();
        if (newName) {
            submitBtn.textContent = 'Đang lưu...';
            submitBtn.disabled = true;

            await PositionModule.add(newTitle);

            titleInput.value = '';
            submitBtn.textContent = 'Thêm Vị trí';
            submitBtn.disabled = false;
            refreshList();
        }
    };

    refreshList();
};

const initSalaryView = () => {
    const container = document.getElementById('salary-view');
    container.innerHTML = ''; // Xóa nội dung cũ để cập nhật

    const reportData = SalaryModule.generatePayrollReport();

    const table = document.createElement('table');
    table.innerHTML = `
      <thead>
          <tr>
              <th>ID</th>
              <th>Tên Nhân viên</th>
              <th>Phòng ban</th>
              <th>Lương cơ bản</th>
              <th>Thưởng</th>
              <th>Khấu trừ</th>
              <th>Lương thực nhận</th>
          </tr>
      </thead>
      <tbody>
      </tbody>
  `;

    const tbody = table.querySelector('tbody');
    reportData.forEach(item => {
        const row = tbody.insertRow();
        row.innerHTML = `
          <td>${item.id}</td>
          <td>${item.name}</td>
          <td>${item.department}</td>
          <td>${item.baseSalary.toLocaleString()}</td>
          <td>${item.bonus.toLocaleString()}</td>
          <td>${item.deduction.toLocaleString()}</td>
          <td><strong>${item.netSalary.toLocaleString()}</strong></td>
      `;
    });

    container.innerHTML = '<h3>Báo cáo Bảng lương</h3>';
    container.appendChild(table);
};

const initAttendanceView = () => {
    const container = document.getElementById('attendance-view');
    container.innerHTML = `<h3>Quản lý Chấm công</h3>`;

    const employees = EmployeeDbModule.getAllEmployees();
    const attendanceLog = AttendanceModule.getLog();
    const today = new Date().toLocaleDateString('vi-VN');

    const table = document.createElement('table');
    table.innerHTML = `
        <thead>
            <tr>
                <th>Tên Nhân viên</th>
                <th>Trạng thái hôm nay</th>
                <th>Hành động</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;
    const tbody = table.querySelector('tbody');

    employees.forEach(emp => {
        const logToday = attendanceLog.find(log => log.employeeId === emp.id && log.date === today);

        let status = 'Chưa chấm công';
        if (logToday && logToday.checkIn && !logToday.checkOut) {
            status = `Đã check-in lúc ${new Date(logToday.checkIn).toLocaleTimeString()}`;
        } else if (logToday && logToday.checkOut) {
            status = 'Đã hoàn thành chấm công';
        }

        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${emp.name}</td>
            <td>${status}</td>
            <td>
                <button class="check-in-btn" data-id="${emp.id}">Check-in</button>
                <button class="check-out-btn" data-id="${emp.id}">Check-out</button>
            </td>
        `;
    });

    container.appendChild(table);

    // Gán sự kiện cho các nút check-in/check-out
    container.querySelectorAll('.check-in-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const empId = parseInt(e.target.dataset.id);
            AttendanceModule.checkIn(empId);
            initAttendanceView(); // Render lại để cập nhật trạng thái
        });
    });

    container.querySelectorAll('.check-out-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const empId = parseInt(e.target.dataset.id);
            AttendanceModule.checkOut(empId);
            initAttendanceView(); // Render lại
        });
    });
};
const initLeaveView = () => {
    const container = document.getElementById('leave-view');
    const employees = EmployeeDbModule.getAllEmployees();

    // Render form tạo yêu cầu
    let options = employees.map(emp => `<option value="${emp.id}">${emp.name}</option>`).join('');

    container.innerHTML = `
        <h3>Quản lý Nghỉ phép</h3>
        <form id="leaveRequestForm">
            <h4>Tạo Yêu cầu Nghỉ phép</h4>
            <select id="leaveEmployee" required>${options}</select>
            <input type="date" id="leaveStartDate" required />
            <input type="date" id="leaveEndDate" required />
            <input type="text" id="leaveReason" placeholder="Lý do nghỉ phép" required />
            <button type="submit">Gửi yêu cầu</button>
        </form>
        <hr />
        <h4>Danh sách Yêu cầu</h4>
        <div id="leave-requests-list"></div>
    `;

    // Render danh sách các yêu cầu đã có
    renderLeaveRequests();

    // Gán sự kiện cho form
    document.getElementById('leaveRequestForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const employeeId = parseInt(document.getElementById('leaveEmployee').value);
        const startDate = document.getElementById('leaveStartDate').value;
        const endDate = document.getElementById('leaveEndDate').value;
        const reason = document.getElementById('leaveReason').value;

        LeaveModule.requestLeave(employeeId, startDate, endDate, reason);
        alert('Đã gửi yêu cầu thành công!');
        document.getElementById('leaveRequestForm').reset();
        renderLeaveRequests(); // Cập nhật lại danh sách
    });
};

const initPerformanceView = () => {
    const container = document.getElementById('performance-view');
    const employees = EmployeeDbModule.getAllEmployees();

    // Render form thêm đánh giá
    let options = employees.map(emp => `<option value="${emp.id}">${emp.name}</option>`).join('');

    container.innerHTML = `
        <h3>Đánh giá Hiệu suất</h3>
        <form id="performanceReviewForm">
            <h4>Thêm Đánh giá Mới</h4>
            <select id="reviewEmployee" required>${options}</select>
            <select id="reviewRating" required>
                <option value="">-- Chọn điểm --</option>
                <option value="5">5 - Xuất sắc</option>
                <option value="4">4 - Tốt</option>
                <option value="3">3 - Khá</option>
                <option value="2">2 - Cần cải thiện</option>
                <option value="1">1 - Yếu</option>
            </select>
            <input type="text" id="reviewFeedback" placeholder="Nhận xét chi tiết" required />
            <button type="submit">Lưu đánh giá</button>
        </form>
        <hr />
        <h4>Báo cáo Hiệu suất</h4>
        <div id="performance-report-list"></div>
    `;

    // Render bảng báo cáo
    renderPerformanceReport();

    // Gán sự kiện cho form
    document.getElementById('performanceReviewForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const employeeId = parseInt(document.getElementById('reviewEmployee').value);
        const rating = parseInt(document.getElementById('reviewRating').value);
        const feedback = document.getElementById('reviewFeedback').value;

        PerformanceModule.addReview(employeeId, rating, feedback);
        alert('Đã lưu đánh giá thành công!');
        document.getElementById('performanceReviewForm').reset();
        renderPerformanceReport(); // Cập nhật lại báo cáo
    });
};


// --- PHẦN 4: KHỞI TẠO ỨNG DỤNG ---

const initAuthView = () => {
    const loginBox = document.getElementById('login-box');
    const registerBox = document.getElementById('register-box');
    const showRegisterBtn = document.getElementById('showRegister');
    const showLoginBtn = document.getElementById('showLogin');

    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);

    showRegisterBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loginBox.style.display = 'none';
        registerBox.style.display = 'block';
    });

    showLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        registerBox.style.display = 'none';
        loginBox.style.display = 'block';
    });
};

document.addEventListener('DOMContentLoaded', () => {
    logoutBtn.addEventListener('click', handleLogout);
    mainMenu.addEventListener('click', (e) => {
        if (e.target.tagName === 'A' && e.target.dataset.module) {
            e.preventDefault();
            const viewId = `${e.target.dataset.module}-view`;
            activateView(viewId);
        }
    });

    initAuthView();
    checkLoginStatus();
});
