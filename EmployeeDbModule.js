const EmployeeDbModule = (() => {

    let employees = JSON.parse(localStorage.getItem('employees')) || [];

    const getAllEmployees = () => {
        return employees;
    }

    const addEmployee = (employeeObj) => {
        const newId = employees.length ? Math.max(...employees.map(e => e.id)) + 1 : 1;
        const employee = { ...employeeObj, id: newId };
        employees.push(employee);
        localStorage.setItem("employees", JSON.stringify(employees));

        return employee;
    }

    const updateEmployee = (id, updateObj) => {
        const index = employees.findIndex(e => e.id === id);
        if (index !== -1) {
            employees[index] = { ...employees[index], ...updateObj, id };
            localStorage.setItem("employees", JSON.stringify(employees));
            return employees[index];
        }
        return null;
    }

    const deleteEmployee = (id) => {
        // Lọc ra những nhân viên không có id trùng với id cần xóa
        employees = employees.filter(emp => emp.id !== id);
        // Cập nhật lại localStorage
        localStorage.setItem("employees", JSON.stringify(employees));
        return true; // Trả về true để báo hiệu xóa thành công
      };
      
      // Đừng quên export nó ra ngoài
      return {
        getAllEmployees,
        addEmployee,
        updateEmployee,
        deleteEmployee // Thêm vào đây
      };
      

    // let editModeId = null;
    // const editEmployee = (id) => {
    //     const emp = EmployeeDbModule.getAllEmployees().find(e => e.id === id);
    //     if (!emp) return;
    //     document.getElementById('empName').value = emp.name;
    //     document.getElementById('empDept').value = emp.department;
    //     document.getElementById('empSalary').value = emp.salary;
    //     editModeId = id;
    //     document.getElementById('addEmployeeForm').textContent = 'Cập nhật';
    //     document.getElementById('cancelEditBtn').style.display = 'inline-block';
    // }

})();

export default EmployeeDbModule;