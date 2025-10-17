// file: app.js

// --- PHẦN IMPORT MODULES ---
import AuthModule from './authModule.js';
import EmployeeDbModule from './EmployeeDbModule.js';
import DepartmentModule from './departmentModule.js';
import PositionModule from './positionModule.js';
import SearchModule from './searchModule.js';
import SalaryModule from './salaryModule.js';
import DeleteEmployeeModule from './deleteEmployeeModule.js';
import AttendanceModule from './attendanceModule.js';
import LeaveModule from './leaveModule.js';
import PerformanceModule from './performanceModule.js';
// Import các module MỚI
import AddEmployeeModule from './addEmployeeModule.js';
import EditEmployeeModule from './editEmployeeModule.js';

// --- PHẦN 1: LẤY CÁC DOM ELEMENT TOÀN CỤC ---
const authContainer = document.getElementById('auth-container');
const mainApp = document.getElementById('main-app');
const userDisplay = document.getElementById('userDisplay');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const logoutBtn = document.getElementById('logoutBtn');
const mainMenu = document.getElementById('main-menu');

// --- PHẦN 2: CÁC HÀM XỬ LÝ SỰ KIỆN & ĐIỀU KHIỂN CHÍNH ---

/**
 * Hiển thị giao diện chính (dashboard) và ẩn form xác thực.
 * @param {string} username - Tên người dùng để hiển thị.
 */
const showDashboard = (username) => {
    authContainer.style.display = 'none';
    mainApp.style.display = 'flex';
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
    // Ẩn tất cả views
    document.querySelectorAll('.view').forEach(view => {
        view.style.display = 'none';
    });

    // Hiển thị view được chọn
    const activeView = document.getElementById(viewId);
    if (activeView) {
        activeView.style.display = 'block';

        // Gọi hàm init tương ứng cho view
        try {
            switch (viewId) {
                case 'employees-view':
                    initEmployeesView();
                    break;
                case 'add-employee-view':
                    initAddEmployeeView();
                    break;
                case 'edit-employee-view':
                    initEditEmployeeView();
                    break;
                case 'search-view':
                    initSearchView();
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
        } catch (error) {
            console.error(`Lỗi khi khởi tạo view ${viewId}:`, error);
            alert(`Có lỗi xảy ra: ${error.message}`);
        }
    }
};

// Xử lý đăng nhập
const handleLogin = async (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const result = await AuthModule.login(username, password);
        if (result.success) {
            showDashboard(username);
        } else {
            alert(result.message);
        }
    } catch (error) {
        alert('Có lỗi xảy ra khi đăng nhập!');
        console.error(error);
    }
};

// Xử lý đăng ký
const handleRegister = async (e) => {
    e.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;

    try {
        const result = await AuthModule.register(username, password);
        alert(result.message);
        if (result.success) {
            document.getElementById('registerForm').reset();
            document.getElementById('register-box').style.display = 'none';
            document.getElementById('login-box').style.display = 'block';
        }
    } catch (error) {
        alert('Có lỗi xảy ra khi đăng ký!');
        console.error(error);
    }
};

// Xử lý đăng xuất
const handleLogout = () => {
    AuthModule.logout();
    showAuthForms();
};

// Kiểm tra trạng thái đăng nhập khi load trang
const checkLoginStatus = () => {
    const user = AuthModule.getCurrentUser();
    if (user) {
        showDashboard(user.username);
    } else {
        showAuthForms();
    }
};

// --- PHẦN 3: CÁC HÀM KHỞI TẠO VÀ RENDER CHO TỪNG VIEW ---

/**
 * Render danh sách nhân viên vào bảng
 */
const renderEmployeeList = (employeeList) => {
    const list = employeeList || EmployeeDbModule.getAllEmployees();
    const tableBody = document.getElementById('employee-list');

    if (!tableBody) return;

    tableBody.innerHTML = '';

    if (list.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Chưa có nhân viên nào</td></tr>';
        return;
    }

    list.forEach(emp => {
        const dept = DepartmentModule.getById(emp.departmentId);
        const pos = PositionModule.getById(emp.positionId);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${emp.id}</td>
            <td>${emp.name}</td>
            <td>${dept ? dept.name : 'N/A'}</td>
            <td>${pos ? pos.title : 'N/A'}</td>
            <td>
                <button class="btn-edit" data-id="${emp.id}">Sửa</button>
                <button class="btn-delete" data-id="${emp.id}">Xóa</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    // Gắn sự kiện cho các nút Sửa và Xóa
    tableBody.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            activateView('edit-employee-view');
        });
    });

    tableBody.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            DeleteEmployeeModule.handleDelete(id, () => {
                renderEmployeeList();
            });
        });
    });
};

/**
 * Khởi tạo view danh sách nhân viên
 */
const initEmployeesView = () => {
    renderEmployeeList();
};

/**
 * Khởi tạo view thêm nhân viên MỚI
 */
const initAddEmployeeView = () => {
    const container = document.getElementById('add-employee-container');
    if (container) {
        AddEmployeeModule.renderForm(container, () => {
            // Callback sau khi thêm thành công
            alert('Đã chuyển về danh sách nhân viên');
            activateView('employees-view');
        });
    }
};

/**
 * Khởi tạo view sửa nhân viên MỚI
 */
const initEditEmployeeView = () => {
    const container = document.getElementById('edit-employee-container');
    if (container) {
        EditEmployeeModule.renderForm(container, () => {
            // Callback sau khi sửa thành công
            activateView('employees-view');
        });
    }
};

/**
 * Khởi tạo view tìm kiếm nhân viên
 */
const initSearchView = () => {
    const container = document.getElementById('search-container');
    const resultsContainer = document.getElementById('search-results');

    if (!container || !resultsContainer) return;

    container.innerHTML = `
        <h3>Tìm kiếm Nhân viên</h3>
        <form id="searchForm">
            <div class="form-group">
                <label>Tên nhân viên:</label>
                <input type="text" id="searchName" placeholder="Nhập tên (có thể để trống)">
            </div>
            <div class="form-group">
                <label>Phòng ban:</label>
                <select id="searchDept">
                    <option value="">-- Tất cả --</option>
                    ${DepartmentModule.getAll().map(d => `<option value="${d.id}">${d.name}</option>`).join('')}
                </select>
            </div>
            <div class="form-group">
                <label>Vị trí:</label>
                <select id="searchPos">
                    <option value="">-- Tất cả --</option>
                    ${PositionModule.getAll().map(p => `<option value="${p.id}">${p.title}</option>`).join('')}
                </select>
            </div>
            <button type="submit" class="btn-primary">Tìm kiếm</button>
        </form>
    `;

    const form = container.querySelector('#searchForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const criteria = {
            name: form.querySelector('#searchName').value.trim(),
            departmentId: form.querySelector('#searchDept').value ? parseInt(form.querySelector('#searchDept').value) : null,
            positionId: form.querySelector('#searchPos').value ? parseInt(form.querySelector('#searchPos').value) : null
        };

        // Lọc bỏ các criteria null/empty
        Object.keys(criteria).forEach(key => {
            if (!criteria[key]) delete criteria[key];
        });

        const results = SearchModule.filterEmployees(criteria);

        // Hiển thị kết quả
        if (results.length === 0) {
            resultsContainer.innerHTML = '<p>Không tìm thấy nhân viên nào!</p>';
        } else {
            resultsContainer.innerHTML = `
                <h4>Kết quả tìm kiếm (${results.length} nhân viên):</h4>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên</th>
                            <th>Phòng ban</th>
                            <th>Vị trí</th>
                            <th>Lương</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${results.map(emp => {
                const dept = DepartmentModule.getById(emp.departmentId);
                const pos = PositionModule.getById(emp.positionId);
                return `
                                <tr>
                                    <td>${emp.id}</td>
                                    <td>${emp.name}</td>
                                    <td>${dept ? dept.name : 'N/A'}</td>
                                    <td>${pos ? pos.title : 'N/A'}</td>
                                    <td>${emp.salary.toLocaleString('vi-VN')} VNĐ</td>
                                </tr>
                            `;
            }).join('')}
                    </tbody>
                </table>
            `;
        }
    });
};

/**
 * Khởi tạo view quản lý phòng ban - CẢI THIỆN
 */
const initDepartmentsView = () => {
    const container = document.getElementById('departments-container');
    if (!container) return;

    const renderDepartments = () => {
        const departments = DepartmentModule.getAll();

        container.innerHTML = `
            <h3>Quản lý Phòng ban</h3>
            
            <!-- Form thêm phòng ban -->
            <div class="form-section">
                <h4>Thêm Phòng ban Mới</h4>
                <form id="addDeptForm">
                    <div class="form-group">
                        <label>Tên phòng ban:</label>
                        <input type="text" id="newDeptName" required>
                    </div>
                    <button type="submit" class="btn-primary">Thêm</button>
                </form>
            </div>

            <!-- Danh sách phòng ban -->
            <div class="list-section">
                <h4>Danh sách Phòng ban (${departments.length})</h4>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên Phòng ban</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${departments.map(dept => `
                            <tr>
                                <td>${dept.id}</td>
                                <td>${dept.name}</td>
                                <td>
                                    <button class="btn-edit" data-id="${dept.id}" data-name="${dept.name}">Sửa</button>
                                    <button class="btn-delete" data-id="${dept.id}">Xóa</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            <div id="deptMessage" class="message"></div>
        `;

        // Xử lý thêm phòng ban
        const addForm = container.querySelector('#addDeptForm');
        addForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = container.querySelector('#newDeptName').value.trim();

            try {
                DepartmentModule.add(name);
                showMessage('Thêm phòng ban thành công!', 'success');
                renderDepartments();
            } catch (error) {
                showMessage(error.message, 'error');
            }
        });

        // Xử lý sửa phòng ban
        container.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                const oldName = e.target.dataset.name;
                const newName = prompt('Nhập tên mới cho phòng ban:', oldName);

                if (newName && newName.trim() !== oldName) {
                    try {
                        DepartmentModule.edit(id, { name: newName.trim() });
                        showMessage('Cập nhật thành công!', 'success');
                        renderDepartments();
                    } catch (error) {
                        showMessage(error.message, 'error');
                    }
                }
            });
        });

        // Xử lý xóa phòng ban
        container.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                const dept = DepartmentModule.getById(id);

                if (confirm(`Bạn có chắc chắn muốn xóa phòng ban "${dept.name}"?`)) {
                    try {
                        DepartmentModule.remove(id);
                        showMessage('Xóa thành công!', 'success');
                        renderDepartments();
                    } catch (error) {
                        showMessage(error.message, 'error');
                    }
                }
            });
        });
    };

    const showMessage = (msg, type) => {
        const msgDiv = container.querySelector('#deptMessage');
        if (msgDiv) {
            msgDiv.textContent = msg;
            msgDiv.className = `message ${type}`;
            msgDiv.style.display = 'block';
            setTimeout(() => msgDiv.style.display = 'none', 3000);
        }
    };

    renderDepartments();
};

/**
 * Khởi tạo view quản lý vị trí - CẢI THIỆN
 */
const initPositionsView = () => {
    const container = document.getElementById('positions-container');
    if (!container) return;

    const renderPositions = () => {
        const positions = PositionModule.getAll();

        container.innerHTML = `
            <h3>Quản lý Vị trí</h3>
            
            <!-- Form thêm vị trí -->
            <div class="form-section">
                <h4>Thêm Vị trí Mới</h4>
                <form id="addPosForm">
                    <div class="form-group">
                        <label>Tên vị trí:</label>
                        <input type="text" id="newPosTitle" required>
                    </div>
                    <div class="form-group">
                        <label>Mô tả:</label>
                        <textarea id="newPosDesc" rows="2"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Mức lương cơ bản:</label>
                        <input type="number" id="newPosSalary" min="0" value="0">
                    </div>
                    <button type="submit" class="btn-primary">Thêm</button>
                </form>
            </div>

            <!-- Danh sách vị trí -->
            <div class="list-section">
                <h4>Danh sách Vị trí (${positions.length})</h4>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên Vị trí</th>
                            <th>Mô tả</th>
                            <th>Lương CB</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${positions.map(pos => `
                            <tr>
                                <td>${pos.id}</td>
                                <td>${pos.title}</td>
                                <td>${pos.description || 'N/A'}</td>
                                <td>${pos.salaryBase?.toLocaleString('vi-VN') || '0'} VNĐ</td>
                                <td>
                                    <button class="btn-edit" data-id="${pos.id}">Sửa</button>
                                    <button class="btn-delete" data-id="${pos.id}">Xóa</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            <div id="posMessage" class="message"></div>
        `;

        // Xử lý thêm vị trí
        const addForm = container.querySelector('#addPosForm');
        addForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const title = container.querySelector('#newPosTitle').value.trim();
            const description = container.querySelector('#newPosDesc').value.trim();
            const salaryBase = parseFloat(container.querySelector('#newPosSalary').value) || 0;

            try {
                await PositionModule.add(title, description, salaryBase);
                showMessage('Thêm vị trí thành công!', 'success');
                renderPositions();
            } catch (error) {
                showMessage(error.message, 'error');
            }
        });

        // Xử lý sửa vị trí
        container.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = parseInt(e.target.dataset.id);
                const pos = PositionModule.getById(id);

                const newTitle = prompt('Tên vị trí:', pos.title);
                if (!newTitle) return;

                const newDesc = prompt('Mô tả:', pos.description || '');
                const newSalary = prompt('Lương cơ bản:', pos.salaryBase || 0);

                try {
                    await PositionModule.edit(id, {
                        title: newTitle.trim(),
                        description: newDesc?.trim() || '',
                        salaryBase: parseFloat(newSalary) || 0
                    });
                    showMessage('Cập nhật thành công!', 'success');
                    renderPositions();
                } catch (error) {
                    showMessage(error.message, 'error');
                }
            });
        });

        // Xử lý xóa vị trí
        container.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = parseInt(e.target.dataset.id);
                const pos = PositionModule.getById(id);

                if (confirm(`Bạn có chắc chắn muốn xóa vị trí "${pos.title}"?`)) {
                    try {
                        await PositionModule.remove(id);
                        showMessage('Xóa thành công!', 'success');
                        renderPositions();
                    } catch (error) {
                        showMessage(error.message, 'error');
                    }
                }
            });
        });
    };

    const showMessage = (msg, type) => {
        const msgDiv = container.querySelector('#posMessage');
        if (msgDiv) {
            msgDiv.textContent = msg;
            msgDiv.className = `message ${type}`;
            msgDiv.style.display = 'block';
            setTimeout(() => msgDiv.style.display = 'none', 3000);
        }
    };

    renderPositions();
};

/**
 * Khởi tạo view bảng lương
 */
const initSalaryView = () => {
    const container = document.getElementById('salary-container');
    if (!container) return;

    try {
        const report = SalaryModule.generatePayrollReport();

        if (!report || report.length === 0) {
            container.innerHTML = '<p>Chưa có dữ liệu nhân viên để tạo bảng lương.</p>';
            return;
        }

        container.innerHTML = `
            <h3>Bảng Lương Nhân viên</h3>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên</th>
                        <th>Phòng ban</th>
                        <th>Vị trí</th>
                        <th>Lương CB</th>
                        <th>Thưởng</th>
                        <th>Khấu trừ</th>
                        <th>Thực nhận</th>
                    </tr>
                </thead>
                <tbody>
                    ${report.map(r => `
                        <tr>
                            <td>${r.id}</td>
                            <td>${r.name}</td>
                            <td>${r.department}</td>
                            <td>${r.position}</td>
                            <td>${(r.salary || 0).toLocaleString('vi-VN')}</td>
                            <td>${(r.bonus || 0).toLocaleString('vi-VN')}</td>
                            <td>${(r.deduction || 0).toLocaleString('vi-VN')}</td>
                            <td><strong>${(r.netSalary || 0).toLocaleString('vi-VN')}</strong> VNĐ</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <div class="summary">
                <h4>Tổng chi phí lương: ${report.reduce((sum, r) => sum + (r.netSalary || 0), 0).toLocaleString('vi-VN')} VNĐ</h4>
            </div>
        `;
    } catch (error) {
        console.error('Lỗi khi tạo bảng lương:', error);
        container.innerHTML = `<p class="error">Có lỗi xảy ra khi tạo bảng lương: ${error.message}</p>`;
    }
};


/**
 * Khởi tạo view chấm công - CẢI THIỆN
 */
const initAttendanceView = () => {
    const container = document.getElementById('attendance-container');
    if (!container) return;

    container.innerHTML = `
        <h3>Quản lý Chấm công</h3>
        
        <!-- Check-in/out -->
        <div class="form-section">
            <h4>Check In/Out</h4>
            <div class="form-group">
                <label>Chọn nhân viên:</label>
                <select id="attEmpSelect">
                    <option value="">-- Chọn nhân viên --</option>
                    ${EmployeeDbModule.getAllEmployees().map(emp =>
        `<option value="${emp.id}">${emp.name}</option>`
    ).join('')}
                </select>
            </div>
            <button id="checkInBtn" class="btn-primary">Check In</button>
            <button id="checkOutBtn" class="btn-secondary">Check Out</button>
        </div>

        <!-- Báo cáo chấm công -->
        <div class="form-section">
            <h4>Báo cáo Chấm công</h4>
            <form id="attReportForm">
                <div class="form-group">
                    <label>Nhân viên:</label>
                    <select id="reportEmpSelect" required>
                        <option value="">-- Chọn nhân viên --</option>
                        ${EmployeeDbModule.getAllEmployees().map(emp =>
        `<option value="${emp.id}">${emp.name}</option>`
    ).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>Từ ngày (DD/MM/YYYY):</label>
                    <input type="text" id="reportFromDate" placeholder="01/10/2025">
                </div>
                <div class="form-group">
                    <label>Đến ngày (DD/MM/YYYY):</label>
                    <input type="text" id="reportToDate" placeholder="31/10/2025">
                </div>
                <button type="submit" class="btn-primary">Xem Báo cáo</button>
            </form>
        </div>

        <div id="attReportResult"></div>
        <div id="attMessage" class="message"></div>
    `;

    // Check In
    container.querySelector('#checkInBtn').addEventListener('click', () => {
        const empId = parseInt(container.querySelector('#attEmpSelect').value);
        if (!empId) {
            alert('Vui lòng chọn nhân viên!');
            return;
        }
        AttendanceModule.checkIn(empId);
    });

    // Check Out
    container.querySelector('#checkOutBtn').addEventListener('click', () => {
        const empId = parseInt(container.querySelector('#attEmpSelect').value);
        if (!empId) {
            alert('Vui lòng chọn nhân viên!');
            return;
        }
        AttendanceModule.checkOut(empId);
    });

    // Báo cáo
    container.querySelector('#attReportForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const empId = parseInt(container.querySelector('#reportEmpSelect').value);
        const fromDate = container.querySelector('#reportFromDate').value.trim();
        const toDate = container.querySelector('#reportToDate').value.trim();

        try {
            const report = AttendanceModule.getAttendanceReport(empId, fromDate, toDate);

            const resultDiv = container.querySelector('#attReportResult');
            resultDiv.innerHTML = `
                <h4>Báo cáo chấm công: ${report.employeeName}</h4>
                <p>Từ ${report.fromDate || 'đầu'} đến ${report.toDate || 'hiện tại'}</p>
                <p><strong>Tổng số ngày: ${report.totalDays}</strong></p>
                <p><strong>Tổng số giờ làm: ${report.totalHours} giờ</strong></p>
                <table>
                    <thead>
                        <tr>
                            <th>Ngày</th>
                            <th>Check In</th>
                            <th>Check Out</th>
                            <th>Giờ làm</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${report.logs.map(log => `
                            <tr>
                                <td>${log.date}</td>
                                <td>${log.checkIn}</td>
                                <td>${log.checkOut}</td>
                                <td>${log.workHours} giờ</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        } catch (error) {
            alert(`Lỗi: ${error.message}`);
        }
    });
};

/**
 * Khởi tạo view nghỉ phép - CẢI THIỆN
 */
const initLeaveView = () => {
    const container = document.getElementById('leave-container');
    if (!container) return;

    const renderLeaveView = () => {
        const allRequests = LeaveModule.getAllLeaveRequests('pending');

        container.innerHTML = `
            <h3>Quản lý Nghỉ phép</h3>
            
            <!-- Yêu cầu nghỉ phép -->
            <div class="form-section">
                <h4>Tạo Yêu cầu Nghỉ phép</h4>
                <form id="leaveRequestForm">
                    <div class="form-group">
                        <label>Nhân viên:</label>
                        <select id="leaveEmpSelect" required>
                            <option value="">-- Chọn nhân viên --</option>
                            ${EmployeeDbModule.getAllEmployees().map(emp =>
            `<option value="${emp.id}">${emp.name}</option>`
        ).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Từ ngày:</label>
                        <input type="date" id="leaveStartDate" required>
                    </div>
                    <div class="form-group">
                        <label>Đến ngày:</label>
                        <input type="date" id="leaveEndDate" required>
                    </div>
                    <div class="form-group">
                        <label>Loại nghỉ:</label>
                        <select id="leaveType" required>
                            <option value="annual">Phép năm</option>
                            <option value="sick">Ốm đau</option>
                            <option value="unpaid">Không lương</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Lý do:</label>
                        <textarea id="leaveReason" rows="2"></textarea>
                    </div>
                    <button type="submit" class="btn-primary">Gửi Yêu cầu</button>
                </form>
            </div>

            <!-- Kiểm tra số ngày phép -->
            <div class="form-section">
                <h4>Kiểm tra Số ngày phép</h4>
                <div class="form-group">
                    <label>Chọn nhân viên:</label>
                    <select id="balanceEmpSelect">
                        <option value="">-- Chọn nhân viên --</option>
                        ${EmployeeDbModule.getAllEmployees().map(emp =>
            `<option value="${emp.id}">${emp.name}</option>`
        ).join('')}
                    </select>
                    <button id="checkBalanceBtn" class="btn-secondary">Kiểm tra</button>
                </div>
                <div id="balanceResult"></div>
            </div>

            <!-- Danh sách yêu cầu chờ duyệt -->
            <div class="list-section">
                <h4>Yêu cầu Chờ Duyệt (${allRequests.length})</h4>
                ${allRequests.length === 0 ? '<p>Không có yêu cầu nào</p>' : `
                    <table>
                        <thead>
                            <tr>
                                <th>Nhân viên</th>
                                <th>Từ ngày</th>
                                <th>Đến ngày</th>
                                <th>Số ngày</th>
                                <th>Loại</th>
                                <th>Lý do</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${allRequests.map(req => {
            const emp = EmployeeDbModule.getEmployeeById(req.employeeId);
            return `
                                    <tr>
                                        <td>${emp ? emp.name : 'N/A'}</td>
                                        <td>${req.startDate}</td>
                                        <td>${req.endDate}</td>
                                        <td>${req.leaveDays}</td>
                                        <td>${req.type}</td>
                                        <td>${req.reason || 'N/A'}</td>
                                        <td>
                                            <button class="btn-approve" data-id="${req.id}">Duyệt</button>
                                            <button class="btn-reject" data-id="${req.id}">Từ chối</button>
                                        </td>
                                    </tr>
                                `;
        }).join('')}
                        </tbody>
                    </table>
                `}
            </div>
            <div id="leaveMessage" class="message"></div>
        `;

        // Submit yêu cầu nghỉ phép
        container.querySelector('#leaveRequestForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const empId = parseInt(container.querySelector('#leaveEmpSelect').value);
            const startDate = container.querySelector('#leaveStartDate').value;
            const endDate = container.querySelector('#leaveEndDate').value;
            const type = container.querySelector('#leaveType').value;
            const reason = container.querySelector('#leaveReason').value.trim();

            try {
                LeaveModule.requestLeave(empId, startDate, endDate, type, reason);
                showMessage('Tạo yêu cầu nghỉ phép thành công!', 'success');
                renderLeaveView();
            } catch (error) {
                showMessage(error.message, 'error');
            }
        });

        // Kiểm tra balance
        container.querySelector('#checkBalanceBtn').addEventListener('click', () => {
            const empId = parseInt(container.querySelector('#balanceEmpSelect').value);
            if (!empId) {
                alert('Vui lòng chọn nhân viên!');
                return;
            }

            const balance = LeaveModule.getLeaveBalance(empId);
            const resultDiv = container.querySelector('#balanceResult');
            resultDiv.innerHTML = `
                <div class="balance-card">
                    <h5>${balance.employeeName}</h5>
                    <p>Tổng ngày phép: <strong>${balance.totalLeave}</strong></p>
                    <p>Đã sử dụng: <strong>${balance.usedLeave}</strong></p>
                    <p>Còn lại: <strong>${balance.remainingLeave}</strong></p>
                    <p>Yêu cầu chờ duyệt: ${balance.pendingRequests}</p>
                </div>
            `;
        });

        // Duyệt yêu cầu
        container.querySelectorAll('.btn-approve').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const reqId = parseInt(e.target.dataset.id);
                try {
                    LeaveModule.updateLeaveStatus(reqId, 'approved');
                    showMessage('Đã duyệt yêu cầu!', 'success');
                    renderLeaveView();
                } catch (error) {
                    showMessage(error.message, 'error');
                }
            });
        });

        // Từ chối yêu cầu
        container.querySelectorAll('.btn-reject').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const reqId = parseInt(e.target.dataset.id);
                try {
                    LeaveModule.updateLeaveStatus(reqId, 'rejected');
                    showMessage('Đã từ chối yêu cầu!', 'success');
                    renderLeaveView();
                } catch (error) {
                    showMessage(error.message, 'error');
                }
            });
        });
    };

    const showMessage = (msg, type) => {
        const msgDiv = container.querySelector('#leaveMessage');
        if (msgDiv) {
            msgDiv.textContent = msg;
            msgDiv.className = `message ${type}`;
            msgDiv.style.display = 'block';
            setTimeout(() => msgDiv.style.display = 'none', 3000);
        }
    };

    renderLeaveView();
};

/**
 * Khởi tạo view đánh giá hiệu suất
 */
/**
 * Khởi tạo view đánh giá hiệu suất
 */
const initPerformanceView = () => {
    const container = document.getElementById('performance-container');
    if (!container) return;

    const renderPerformance = () => {
        try {
            const report = PerformanceModule.getPerformanceReport();

            container.innerHTML = `
                <h3>Đánh giá Hiệu suất</h3>
                
                <!-- Form thêm đánh giá -->
                <div class="form-section">
                    <h4>Thêm Đánh giá</h4>
                    <form id="addReviewForm">
                        <div class="form-group">
                            <label>Nhân viên:</label>
                            <select id="reviewEmpSelect" required>
                                <option value="">-- Chọn nhân viên --</option>
                                ${EmployeeDbModule.getAllEmployees().map(emp =>
                `<option value="${emp.id}">${emp.name}</option>`
            ).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Điểm số (1-5):</label>
                            <input type="number" id="reviewRating" min="1" max="5" required>
                        </div>
                        <div class="form-group">
                            <label>Nhận xét:</label>
                            <textarea id="reviewFeedback" rows="3" required></textarea>
                        </div>
                        <button type="submit" class="btn-primary">Thêm Đánh giá</button>
                    </form>
                </div>

                <!-- Báo cáo hiệu suất -->
                <div class="list-section">
                    <h4>Báo cáo Hiệu suất</h4>
                    ${report.length === 0 ? '<p>Chưa có dữ liệu nhân viên</p>' : `
                        <table>
                            <thead>
                                <tr>
                                    <th>Tên</th>
                                    <th>Phòng ban</th>
                                    <th>Vị trí</th>
                                    <th>Điểm TB</th>
                                    <th>Số đánh giá</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${report.map(emp => {
                const dept = DepartmentModule.getById(emp.departmentId);
                const pos = PositionModule.getById(emp.positionId);
                return `
                                        <tr>
                                            <td>${emp.name || 'N/A'}</td>
                                            <td>${dept ? dept.name : 'N/A'}</td>
                                            <td>${pos ? pos.title : 'N/A'}</td>
                                            <td><strong>${emp.averageRating}</strong>/5</td>
                                            <td>${emp.reviewCount}</td>
                                        </tr>
                                    `;
            }).join('')}
                            </tbody>
                        </table>
                    `}
                </div>
                <div id="perfMessage" class="message"></div>
            `;

            // Thêm đánh giá
            const addForm = container.querySelector('#addReviewForm');
            if (addForm) {
                addForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const empId = parseInt(container.querySelector('#reviewEmpSelect').value);
                    const rating = parseInt(container.querySelector('#reviewRating').value);
                    const feedback = container.querySelector('#reviewFeedback').value.trim();

                    try {
                        PerformanceModule.addReview(empId, rating, feedback);
                        showMessage('Thêm đánh giá thành công!', 'success');
                        addForm.reset();
                        renderPerformance();
                    } catch (error) {
                        showMessage(error.message, 'error');
                    }
                });
            }
        } catch (error) {
            console.error('Lỗi khi render performance view:', error);
            container.innerHTML = `<p class="error">Có lỗi xảy ra: ${error.message}</p>`;
        }
    };

    const showMessage = (msg, type) => {
        const msgDiv = container.querySelector('#perfMessage');
        if (msgDiv) {
            msgDiv.textContent = msg;
            msgDiv.className = `message ${type}`;
            msgDiv.style.display = 'block';
            setTimeout(() => msgDiv.style.display = 'none', 3000);
        }
    };

    renderPerformance();
};


// --- PHẦN 4: GẮN CÁC SỰ KIỆN VÀ KHỞI ĐỘNG ỨNG DỤNG ---

// Gắn sự kiện cho form đăng nhập/đăng ký
loginForm?.addEventListener('submit', handleLogin);
registerForm?.addEventListener('submit', handleRegister);
logoutBtn?.addEventListener('click', handleLogout);

// Chuyển đổi giữa form đăng nhập và đăng ký
document.getElementById('show-register')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('login-box').style.display = 'none';
    document.getElementById('register-box').style.display = 'block';
});

document.getElementById('show-login')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('register-box').style.display = 'none';
    document.getElementById('login-box').style.display = 'block';
});

// Gắn sự kiện cho menu điều hướng
mainMenu?.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', (e) => {
        const viewId = e.target.dataset.view;
        if (viewId) {
            activateView(viewId);
        }
    });
});

// Khởi động ứng dụng
document.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus();
});
