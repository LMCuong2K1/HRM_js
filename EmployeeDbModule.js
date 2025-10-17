// file: EmployeeDbModule.js
const EmployeeDbModule = (() => {
    // Khởi tạo dữ liệu mẫu nếu localStorage trống
    const initDefaultData = () => {
        const defaultEmployees = [
            {
                id: 1,
                name: 'Nguyễn Văn An',
                departmentId: 1,
                positionId: 1,
                salary: 15000000,
                hireDate: '2023-01-15',
                bonus: 2000000,
                deduction: 500000
            },
            {
                id: 2,
                name: 'Trần Thị Bình',
                departmentId: 2,
                positionId: 2,
                salary: 25000000,
                hireDate: '2022-06-10',
                bonus: 5000000,
                deduction: 1000000
            },
            {
                id: 3,
                name: 'Lê Văn Cường',
                departmentId: 1,
                positionId: 1,
                salary: 18000000,
                hireDate: '2023-03-20',
                bonus: 3000000,
                deduction: 800000
            },
            {
                id: 4,
                name: 'Phạm Thị Dung',
                departmentId: 2,
                positionId: 3,
                salary: 12000000,
                hireDate: '2024-01-05',
                bonus: 1500000,
                deduction: 300000
            },
            {
                id: 5,
                name: 'Hoàng Văn Em',
                departmentId: 1,
                positionId: 1,
                salary: 16000000,
                hireDate: '2023-09-12',
                bonus: 2500000,
                deduction: 600000
            }
        ];
        return defaultEmployees;
    };

    // Kiểm tra và khởi tạo dữ liệu
    let employees = JSON.parse(localStorage.getItem('employees'));
    if (!employees || employees.length === 0) {
        employees = initDefaultData();
        localStorage.setItem('employees', JSON.stringify(employees));
    }

    const getAllEmployees = () => {
        return employees;
    };

    const addEmployee = (employeeObj) => {
        const newId = employees.length ? Math.max(...employees.map(e => e.id)) + 1 : 1;
        const employee = { ...employeeObj, id: newId };
        employees.push(employee);
        localStorage.setItem("employees", JSON.stringify(employees));
        return employee;
    };

    const updateEmployee = (id, updateObj) => {
        const index = employees.findIndex(e => e.id === id);
        if (index !== -1) {
            employees[index] = { ...employees[index], ...updateObj, id };
            localStorage.setItem("employees", JSON.stringify(employees));
            return employees[index];
        }
        return null;
    };

    const deleteEmployee = (id) => {
        employees = employees.filter(emp => emp.id !== id);
        localStorage.setItem("employees", JSON.stringify(employees));
        return true;
    };

    // THÊM HÀM NÀY - đây là hàm thiếu quan trọng
    const getEmployeeById = (id) => {
        return employees.find(emp => emp.id === id);
    };

    return {
        getAllEmployees,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        getEmployeeById
    };
})();

export default EmployeeDbModule;
