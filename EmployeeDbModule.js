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

    return {
        getAllEmployees,
        addEmployee
    }
})();

export default EmployeeDbModule;