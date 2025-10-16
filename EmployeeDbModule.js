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
    return {
        getAllEmployees,
        addEmployee,
        updateEmployee
    }
})();

export default EmployeeDbModule;