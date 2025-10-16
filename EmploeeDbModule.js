const EmployeeDbModule = (() => {

    let employees = JSON.parse(localStorage.getItem('employees')) || [];

    const getAllEmployees = () => {
        return employees;
    }
    return {
        getAllEmployees
    }
})();

export default EmployeeDbModule;