// file: salaryModule.js
import EmployeeDbModule from './EmployeeDbModule.js';
import DepartmentModule from './departmentModule.js';
import PositionModule from './positionModule.js';

const SalaryModule = (() => {
    /**
     * Tính lương thực nhận cho một nhân viên.
     * @param {object} employee - Đối tượng nhân viên.
     * @returns {number} Lương thực nhận.
     */
    const calculateNetSalary = (employee) => {
        const bonus = employee.bonus || 0;
        const deduction = employee.deduction || 0;
        return employee.salary + bonus - deduction;
    };

    /**
     * Tạo báo cáo bảng lương cho tất cả nhân viên.
     * @returns {Array} Mảng các đối tượng chứa thông tin chi tiết cho báo cáo.
     */
    const generatePayrollReport = () => {
        const employees = EmployeeDbModule.getAllEmployees();
        
        const report = employees.map(emp => {
            const department = DepartmentModule.getAll().find(d => d.id === emp.departmentId)?.name || 'N/A';
            const position = PositionModule.getAll().find(p => p.id === emp.positionId)?.title || 'N/A';
            const netSalary = calculateNetSalary(emp);

            return {
                id: emp.id,
                name: emp.name,
                department: department,
                position: position,
                baseSalary: emp.salary,
                bonus: emp.bonus || 0,
                deduction: emp.deduction || 0,
                netSalary: netSalary
            };
        });

        return report;
    };

    return {
        generatePayrollReport
    };
})();

export default SalaryModule;

