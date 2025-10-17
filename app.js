import AuthModule from "./authModule.js";
import EmployeeDbModule from "./EmployeeDbModule.js";

let editModeId = null;
console.log("AuthModule:", AuthModule);


const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const dashboard = document.getElementById('dashboard');
const userDisplay = document.getElementById('userDisplay');
const logoutBtn = document.getElementById('logoutBtn');
const cancelBtn = document.getElementById('cancelEditBtn');
const addEmployeeForm = document.getElementById('addEmployeeForm');
const addEmployeeFormBtn = document.getElementById('addEmployeeFormBtn');
const searchInput = document.getElementById('searchInput');

if (cancelBtn) {
  cancelBtn.onclick = () => {
    editModeId = null;
    document.getElementById('addEmployeeForm').reset();
    document.getElementById('addEmployeeFormBtn').textContent = 'Thêm';
    cancelBtn.style.display = 'none';
  };
}

const showDashboard = (username) => {
  userDisplay.textContent = username;
  dashboard.style.display = 'block';
  loginForm.style.display = 'none';
  registerForm.style.display = 'none';
}

const showForms = () => {
  dashboard.style.display = 'none';
  loginForm.style.display = 'block';
  registerForm.style.display = 'block';
}

logoutBtn.addEventListener('click', () => {
  AuthModule.logout();
  showForms();
});

document.getElementById('cancelEditBtn').onclick = () => {
  editModeId = null;
  addEmployeeFormBtn.textContent = 'Thêm';
  document.getElementById('cancelEditBtn').style.display = 'none';
  addEmployeeForm.reset();
};

loginForm.onsubmit = async (e) => {
  e.preventDefault();                               // Tránh reload trang
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;
  const result = await AuthModule.login(username, password); // Gọi hàm login ở module
  alert(result.message);                            // Thông báo cho user (thành công/thất bại)
  if (result.success) showDashboard(username);      // Nếu login đúng thì chuyển sang dashboard
};

registerForm.onsubmit = async (e) => {
  e.preventDefault();
  const username = document.getElementById('registerUsername').value;
  const password = document.getElementById('registerPassword').value;
  const result = await AuthModule.register(username, password);
  alert(result.message);              // Báo kết quả cho người dùng
};

if (AuthModule.isLoggedIn()) {
  showDashboard(AuthModule.currentUser());
} else {
  showForms();
}


console.log("EmployeeDbModule:", EmployeeDbModule);

// addEmployeeForm.onsubmit = (e) => {
//   e.preventDefault();
//   const name = document.getElementById('empName').value.trim();
//   const department = document.getElementById('empDept').value.trim();
//   const salary = parseFloat(document.getElementById('empSalary').value);
//   if (!name || !department || !salary) {
//     alert("Vui lòng điền đầy đủ thông tin!");
//     return;
//   }
//   const newEmployee = {
//     name,
//     department,
//     salary
//   }

//   if (editModeId) {
//     EmployeeDbModule.updateEmployee(editModeId, { name, department, salary });
//     alert("Cập nhật thành công!");
//     editModeId = null;
//     addEmployeeForm.textContent = 'Thêm';
//   }
//   else {
//     const result = EmployeeDbModule.addEmployee(newEmployee);
//     alert(`Đã thêm nhân viên: ${result.name} với ID: ${result.id}`);
//   }
//   document.getElementById('empName').value = '';
//   document.getElementById('empDept').value = '';
//   document.getElementById('empSalary').value = '';
//   renderEmployeeList();
// };

const renderEmployeeList = (employeesToRender) => {
  // const list = EmployeeDbModule.getAllEmployees();
  const ul = document.getElementById('employeeList');
  ul.innerHTML = '';
  employeesToRender.forEach(emp => {
    const li = document.createElement('li');
    li.textContent = `ID: ${emp.id}, Tên: ${emp.name}, Phòng ban: ${emp.department}, Lương: ${emp.salary}`;

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Sửa';
    editBtn.onclick = () => editEmployee(emp.id);
    li.appendChild(editBtn);

    // Nút Xóa (MỚI)
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Xóa';
    deleteBtn.onclick = () => handleDelete(emp.id); // Gọi hàm xử lý xóa
    li.appendChild(deleteBtn);

    ul.appendChild(li);
  });
}

function editEmployee(id) {
  const emp = EmployeeDbModule.getAllEmployees().find(e => e.id === id);
  if (!emp) return;

  // Điền thông tin cũ vào form
  document.getElementById('empName').value = emp.name;
  document.getElementById('empDept').value = emp.department;
  document.getElementById('empSalary').value = emp.salary;

  // Chuyển sang chế độ sửa
  editModeId = id;
  addEmployeeFormBtn.textContent = 'Cập nhật';
  
  const cancelBtn = document.getElementById('cancelEditBtn');
  if (cancelBtn) cancelBtn.style.display = 'inline-block';
}
addEmployeeForm.onsubmit = (e) => {
  e.preventDefault();
  const name = document.getElementById('empName').value.trim();
  const department = document.getElementById('empDept').value.trim();
  const salary = parseFloat(document.getElementById('empSalary').value);

  if (!name || !department || !salary) {
    alert('Vui lòng điền đầy đủ thông tin!');
    return;
  }

  const employeeData = { name, department, salary };

  if (editModeId) {
    // Nếu đang ở chế độ sửa -> Cập nhật
    EmployeeDbModule.updateEmployee(editModeId, employeeData);
    alert('Cập nhật thành công!');
  } else {
    // Nếu không -> Thêm mới
    const result = EmployeeDbModule.addEmployee(employeeData);
    alert(`Đã thêm nhân viên: ${result.name} với ID: ${result.id}`);
  }
  
  // Reset form và trạng thái về ban đầu
  editModeId = null;
  addEmployeeForm.reset();
  addEmployeeFormBtn.textContent = 'Thêm';
  const cancelBtn = document.getElementById('cancelEditBtn');
  if (cancelBtn) cancelBtn.style.display = 'none';

  renderEmployeeList(); // Vẽ lại danh sách
};

function handleDelete(id) {
  // Hỏi người dùng để xác nhận
  const isConfirmed = confirm('Bạn có chắc chắn muốn xóa nhân viên này không?');

  if (isConfirmed) {
    // Nếu người dùng đồng ý, gọi hàm xóa trong module
    EmployeeDbModule.deleteEmployee(id);
    // Vẽ lại danh sách để cập nhật giao diện
    renderEmployeeList();
    alert('Đã xóa nhân viên thành công!');
  }
}

const searchInput = document.getElementById('searchInput');

searchInput.addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const allEmployees = EmployeeDbModule.getAllEmployees();

  // Lọc danh sách nhân viên dựa trên tên
  const filteredEmployees = allEmployees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm)
  );

  // Gọi hàm render với danh sách đã được lọc
  renderEmployeeList(filteredEmployees);
});

// Cập nhật lại các lần gọi renderEmployeeList cũ
// Ví dụ, khi khởi tạo dashboard và sau khi thêm/sửa/xóa:
renderEmployeeList(EmployeeDbModule.getAllEmployees()); 


