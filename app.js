import AuthModule from "./authModule.js";
import EmployeeDbModule from "./EmploeeDbModule.js";

console.log("AuthModule:", AuthModule);


const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const dashboard = document.getElementById('dashboard');
const userDisplay = document.getElementById('userDisplay');
const logoutBtn = document.getElementById('logoutBtn');

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