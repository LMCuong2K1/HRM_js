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

    document.getElementById('addEmployeeForm').onsubmit = (e) => {
        e.preventDefault();
        const name = document.getElementById('empName').ariaValueMax.trim();
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
        const result = EmployeeDbModule.addEmployee(newEmployee);
        alert(`Đã thêm nhân viên: ${result.name} với ID: ${result.id}`);
        renderEmployeeList();
    };

    const renderEmployeeList = () => {
        const list = EmployeeDbModule.getAllEmployees();
        const ul = document.getElementById('employeeList');
        ul.innerHTML = '';
        list.forEach(emp => {
            const li = document.createElement('li');
            li.textContent = `ID: ${emp.id}, Tên: ${emp.name}, Phòng ban: ${emp.department}, Lương: ${emp.salary}`;
            ul.appendChild(li);
        });
        renderEmployeeList();
    }
    return {
        getAllEmployees,
        addEmployee
    }
})();

export default EmployeeDbModule;