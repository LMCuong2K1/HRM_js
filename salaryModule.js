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
        const salary = employee.salary || 0;
        return salary + bonus - deduction;
    };

    /**
     * Tạo báo cáo bảng lương cho tất cả nhân viên.
     * @returns {Array} Mảng các đối tượng chứa thông tin chi tiết cho báo cáo.
     */
    const generatePayrollReport = () => {
        const employees = EmployeeDbModule.getAllEmployees();
        const report = employees.map(emp => {
            const department = DepartmentModule.getById(emp.departmentId);
            const position = PositionModule.getById(emp.positionId);

            // Đảm bảo tất cả giá trị đều là số, không phải undefined
            const salary = emp.salary || 0;
            const bonus = emp.bonus || 0;
            const deduction = emp.deduction || 0;
            const netSalary = calculateNetSalary(emp);

            return {
                id: emp.id,
                name: emp.name,
                department: department ? department.name : 'N/A',
                position: position ? position.title : 'N/A',
                salary: salary,
                bonus: bonus,
                deduction: deduction,
                netSalary: netSalary
            };
        });
        return report;
    };

    return {
        calculateNetSalary,
        generatePayrollReport
    };
})();

export default SalaryModule;
