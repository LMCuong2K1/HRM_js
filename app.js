import AuthModule from "./authModule.js";
import EmployeeDbModule from "./EmployeeDbModule.js";
import DepartmentModule from './departmentModule.js';
import PositionModule from './positionModule.js';
import SearchModule from './searchModule.js';
import SalaryModule from './salaryModule.js';
import DeleteEmployeeModule from './deleteEmployeeModule.js';

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

    // Thay thế đoạn container.innerHTML trong hàm initEmployeesView
    container.innerHTML = `
<h3>Quản lý Nhân viên</h3>
<form id="search-form">
    <input type="text" id="searchName" placeholder="Tên nhân viên..." />
    <select id="searchDept">
        <option value="">Tất cả Phòng ban</option>
    </select>
    <select id="searchPos">
        <option value="">Tất cả Vị trí</option>
    </select>
    <button type="submit">Tìm kiếm</button>
</form>

<form id="addEmployeeForm">
    <input type="text" id="empName" placeholder="Tên nhân viên" required />
    
    <!-- THAY ĐỔI: Sử dụng SELECT thay vì INPUT -->
    <select id="empDept" required>
        <option value="">-- Chọn Phòng ban --</option>
    </select>
    <select id="empPos" required>
        <option value="">-- Chọn Vị trí --</option>
    </select>

    <input type="number" id="empSalary" placeholder="Lương" required />
    <button type="submit" id="addEmployeeFormBtn">Thêm</button>
    <button type="button" id="cancelEditBtn" style="display:none;">Hủy</button>
</form>
<ul id="employeeList"></ul>
`;
    // Thêm đoạn này vào sau container.innerHTML trong initEmployeesView

    const deptSelect = container.querySelector('#empDept');
    const posSelect = container.querySelector('#empPos');

    // Lấy dữ liệu từ DepartmentModule và tạo options
    DepartmentModule.getAll().forEach(dept => {
        const option = document.createElement('option');
        option.value = dept.id;
        option.textContent = dept.name;
        deptSelect.appendChild(option);
    });

    // Lấy dữ liệu từ PositionModule và tạo options
    PositionModule.getAll().forEach(pos => {
        const option = document.createElement('option');
        option.value = pos.id;
        option.textContent = pos.title;
        posSelect.appendChild(option);
    });


    // Lấy các element con sau khi đã render vào container
    const searchInput = container.querySelector('#searchInput');
    const addEmployeeForm = container.querySelector('#addEmployeeForm');
    const addEmployeeFormBtn = container.querySelector('#addEmployeeFormBtn');
    const cancelBtn = container.querySelector('#cancelEditBtn');
    const employeeList = container.querySelector('#employeeList');

    // Hàm vẽ lại danh sách nhân viên
    // Hàm vẽ lại danh sách nhân viên
    const renderList = (employees) => {
        employeeList.innerHTML = '';
        employees.forEach(emp => {
            // Tìm tên phòng ban và vị trí từ ID tương ứng
            const department = DepartmentModule.getAll().find(d => d.id === emp.departmentId)?.name || 'Không xác định';
            const position = PositionModule.getAll().find(p => p.id === emp.positionId)?.title || 'Không xác định';

            const li = document.createElement('li');
            // Hiển thị tên đã tìm được
            li.textContent = `ID: ${emp.id}, Tên: ${emp.name}, Phòng ban: ${department}, Vị trí: ${position}, Lương: ${emp.salary}`;

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
    // Hàm xử lý khi bấm nút "Sửa"
    const editEmployee = (id) => {
        const emp = EmployeeDbModule.getAllEmployees().find(e => e.id === id);
        if (!emp) return;

        container.querySelector('#empName').value = emp.name;
        container.querySelector('#empSalary').value = emp.salary;
        // Set giá trị cho các ô select bằng ID tương ứng
        container.querySelector('#empDept').value = emp.departmentId;
        container.querySelector('#empPos').value = emp.positionId;

        editModeId = id;
        addEmployeeFormBtn.textContent = 'Cập nhật';
        cancelBtn.style.display = 'inline-block';
    };


    // Hàm xử lý khi bấm nút "Xóa"
    // Hàm xử lý khi bấm nút "Xóa", giờ chỉ gọi module chuyên dụng
    const handleDelete = (id) => {
        // Gọi module xóa và truyền vào hàm renderList để nó tự cập nhật UI
        DeleteEmployeeModule.handleDelete(id, () => renderList(EmployeeDbModule.getAllEmployees()));
    };


    // Gán sự kiện cho form Thêm/Sửa
    // Gán sự kiện cho form Thêm/Sửa
    addEmployeeForm.onsubmit = (e) => {
        e.preventDefault();
        const name = container.querySelector('#empName').value.trim();
        const departmentId = parseInt(container.querySelector('#empDept').value);
        const positionId = parseInt(container.querySelector('#empPos').value);
        const salary = parseFloat(container.querySelector('#empSalary').value);

        // Cập nhật validation để kiểm tra cả departmentId và positionId
        if (!name || !departmentId || !positionId || isNaN(salary)) {
            alert('Vui lòng điền đầy đủ tất cả các trường thông tin!');
            return;
        }

        const employeeData = { name, departmentId, positionId, salary };

        if (editModeId) {
            EmployeeDbModule.updateEmployee(editModeId, employeeData);
            alert('Cập nhật nhân viên thành công!');
        } else {
            EmployeeDbModule.addEmployee(employeeData);
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
    // searchInput.addEventListener('input', (e) => {
    //     const searchTerm = e.target.value.toLowerCase();
    //     const allEmployees = EmployeeDbModule.getAllEmployees();
    //     const filteredEmployees = allEmployees.filter(emp =>
    //         emp.name.toLowerCase().includes(searchTerm)
    //     );
    //     renderList(filteredEmployees);
    // });

    // Hiển thị danh sách nhân viên lần đầu khi view được kích hoạt
    renderList(EmployeeDbModule.getAllEmployees());

    // Thêm vào cuối hàm initEmployeesView

    // --- LOGIC CHO TÌM KIẾM NÂNG CAO ---
    const searchForm = container.querySelector('#search-form');
    const searchNameInput = container.querySelector('#searchName');
    const searchDeptSelect = container.querySelector('#searchDept');
    const searchPosSelect = container.querySelector('#searchPos');

    // Đổ dữ liệu cho các ô select của form tìm kiếm
    DepartmentModule.getAll().forEach(dept => {
        const option = document.createElement('option');
        option.value = dept.id;
        option.textContent = dept.name;
        searchDeptSelect.appendChild(option);
    });

    PositionModule.getAll().forEach(pos => {
        const option = document.createElement('option');
        option.value = pos.id;
        option.textContent = pos.title;
        searchPosSelect.appendChild(option);
    });

    // Lắng nghe sự kiện submit của form tìm kiếm
    searchForm.onsubmit = (e) => {
        e.preventDefault();
        const criteria = {
            name: searchNameInput.value.trim(),
            departmentId: parseInt(searchDeptSelect.value) || null,
            positionId: parseInt(searchPosSelect.value) || null
        };

        const filteredEmployees = SearchModule.filterEmployees(criteria);
        renderList(filteredEmployees);
    };

};

/**
 * Khởi tạo giao diện cho module Báo cáo Lương.
 */
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

/**
 * Khởi tạo giao diện và gán sự kiện cho module Quản lý Vị trí.
 */
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
            case 'positions-view':
                initPositionsView();
                break;
            case 'salary-view':
                initSalaryView();
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
