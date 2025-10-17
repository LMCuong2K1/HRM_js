// file: searchModule.js
import EmployeeDbModule from './EmployeeDbModule.js';

const SearchModule = (() => {
    /**
     * Tìm kiếm nhân viên dựa trên các tiêu chí.
     * @param {object} criteria - Đối tượng chứa các tiêu chí tìm kiếm.
     * @param {string} [criteria.name] - Tên nhân viên (không phân biệt hoa thường).
     * @param {number} [criteria.departmentId] - ID của phòng ban.
     * @param {number} [criteria.positionId] - ID của vị trí.
     * @returns {Array} - Mảng nhân viên đã được lọc.
     */
    const filterEmployees = (criteria) => {
        let employees = EmployeeDbModule.getAllEmployees();

        if (criteria.name) {
            const nameRegex = new RegExp(criteria.name, 'i'); // 'i' for case-insensitive
            employees = employees.filter(emp => nameRegex.test(emp.name));
        }

        if (criteria.departmentId) {
            employees = employees.filter(emp => emp.departmentId === criteria.departmentId);
        }
        
        if (criteria.positionId) {
            employees = employees.filter(emp => emp.positionId === criteria.positionId);
        }

        return employees;
    };

    return {
        filterEmployees
    };
})();

export default SearchModule;
