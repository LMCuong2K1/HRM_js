// file: salaryModule.js

import EmployeeDbModule from './EmployeeDbModule.js';
import DepartmentModule from './departmentModule.js';
import PositionModule from './positionModule.js';

const SalaryModule = (() => {
    /**
     * Tính lương thực nhận cho một nhân viên.
     */
    const calculateNetSalary = (employee) => {
        const bonus = employee.bonus || 0;
        const deduction = employee.deduction || 0;
        const salary = employee.salary || 0;
        return salary + bonus - deduction;
    };

    /**
     * ✅ FIX CRITICAL: Accept optional employees parameter for testing
     * @param {Array} employees - Optional: array of employees to generate report for
     * If not provided, uses EmployeeDbModule.getAllEmployees()
     */
    const generatePayrollReport = (employees = null) => {
        // ✅ Use provided employees OR fetch from database
        const employeeList = employees || EmployeeDbModule.getAllEmployees();

        const report = employeeList.map(emp => {
            const department = DepartmentModule.getById(emp.departmentId);
            const position = PositionModule.getById(emp.positionId);

            // Ensure all values are numbers
            const salary = typeof emp.salary === 'number' ? emp.salary : 0;
            const bonus = typeof emp.bonus === 'number' ? emp.bonus : 0;
            const deduction = typeof emp.deduction === 'number' ? emp.deduction : 0;

            // ✅ Calculate netSalary
            const netSalary = salary + bonus - deduction;

            return {
                id: emp.id,
                name: emp.name,
                departmentName: department ? department.name : 'N/A',
                positionTitle: position ? position.title : 'N/A',
                salary: salary,
                bonus: bonus,
                deduction: deduction,
                netSalary: netSalary  // ✅ MUST include this field
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
