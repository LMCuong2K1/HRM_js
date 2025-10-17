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
  AuthMobile.logout();
  showForms();
});

document.getElementById('cancelEditBtn').onclick = () => {
  editModeId = null;
  document.getElementById('addEmployeeFormBtn').textContent = 'Thêm';
  document.getElementById('cancelEditBtn').style.display = 'none';
  document.getElementById('addEmployeeForm').reset();
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

document.getElementById('addEmployeeForm').onsubmit = (e) => {
  e.preventDefault();
  const name = document.getElementById('empName').value.trim();
  const department = document.getElementById('empDept').value.trim();
  const salary = parseFloat(document.getElementById('empSalary').value);
  if (!name || !department || !salary) {
    alert("Vui lòng điền đầy đủ thông tin!");
    return;
  }
  const newEmployee = {
    name,
    department,
    salary
  }

  if (editModeId) {
    EmployeeDbModule.updateEmployee(editModeId, { name, department, salary });
    alert("Cập nhật thành công!");
    editModeId = null;
    document.getElementById('addEmployeeForm').textContent = 'Thêm';
  }
  else {
    const result = EmployeeDbModule.addEmployee(newEmployee);
    alert(`Đã thêm nhân viên: ${result.name} với ID: ${result.id}`);
  }
  document.getElementById('empName').value = '';
  document.getElementById('empDept').value = '';
  document.getElementById('empSalary').value = '';
  renderEmployeeList();
};

const renderEmployeeList = () => {
  const list = EmployeeDbModule.getAllEmployees();
  const ul = document.getElementById('employeeList');
  ul.innerHTML = '';
  list.forEach(emp => {
    const li = document.createElement('li');
    li.textContent = `ID: ${emp.id}, Tên: ${emp.name}, Phòng ban: ${emp.department}, Lương: ${emp.salary}`;

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Sửa';
    editBtn.onclick = () => editEmployee(emp.id);
    li.appendChild(editBtn);
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
  document.getElementById('addEmployeeFormBtn').textContent = 'Cập nhật';
  
  const cancelBtn = document.getElementById('cancelEditBtn');
  if (cancelBtn) cancelBtn.style.display = 'inline-block';
}
document.getElementById('addEmployeeForm').onsubmit = (e) => {
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
  document.getElementById('addEmployeeForm').reset();
  document.getElementById('addEmployeeFormBtn').textContent = 'Thêm';
  const cancelBtn = document.getElementById('cancelEditBtn');
  if (cancelBtn) cancelBtn.style.display = 'none';

  renderEmployeeList(); // Vẽ lại danh sách
};

renderEmployeeList();

