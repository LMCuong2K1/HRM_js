// file: searchModule.js

import EmployeeDbModule from './EmployeeDbModule.js';

const SearchModule = (() => {
    /**
     * Tìm kiếm nhân viên dựa trên các tiêu chí nâng cao.
     * @param {object} criteria - Đối tượng chứa các tiêu chí tìm kiếm.
     * @param {string} [criteria.name] - Tên nhân viên (không phân biệt hoa thường, hỗ trợ RegExp).
     * @param {number} [criteria.departmentId] - ID của phòng ban.
     * @param {number} [criteria.positionId] - ID của vị trí.
     * @param {number} [criteria.minSalary] - Mức lương tối thiểu (salary range).
     * @param {number} [criteria.maxSalary] - Mức lương tối đa (salary range).
     * @param {string} [criteria.sortBy] - Sắp xếp theo: 'name', 'salary-asc', 'salary-desc'.
     * @returns {Array} - Mảng nhân viên đã được lọc và sắp xếp.
     */
    const filterEmployees = (criteria) => {
        let employees = EmployeeDbModule.getAllEmployees();

        // ✅ Filter by Name (RegExp, case-insensitive)
        if (criteria.name) {
            const nameRegex = new RegExp(criteria.name, 'i'); // 'i' for case-insensitive
            employees = employees.filter(emp => nameRegex.test(emp.name));
        }

        // ✅ Filter by Department
        if (criteria.departmentId !== undefined && criteria.departmentId !== '') {
            employees = employees.filter(emp => emp.departmentId === Number(criteria.departmentId));
        }

        // ✅ Filter by Position
        if (criteria.positionId !== undefined && criteria.positionId !== '') {
            employees = employees.filter(emp => emp.positionId === Number(criteria.positionId));
        }

        // ✅ NEW: Filter by Salary Range (min-max)
        if (criteria.minSalary !== undefined && criteria.minSalary !== '') {
            const minSal = Number(criteria.minSalary);
            employees = employees.filter(emp => emp.salary >= minSal);
        }

        if (criteria.maxSalary !== undefined && criteria.maxSalary !== '') {
            const maxSal = Number(criteria.maxSalary);
            employees = employees.filter(emp => emp.salary <= maxSal);
        }

        // ✅ NEW: Sorting functionality
        if (criteria.sortBy) {
            switch (criteria.sortBy) {
                case 'name':
                    // Sort alphabetically by name (A-Z)
                    employees.sort((a, b) => a.name.localeCompare(b.name, 'vi-VN'));
                    break;
                case 'salary-asc':
                    // Sort salary ascending (low to high)
                    employees.sort((a, b) => a.salary - b.salary);
                    break;
                case 'salary-desc':
                    // Sort salary descending (high to low)
                    employees.sort((a, b) => b.salary - a.salary);
                    break;
                case 'hireDate-asc':
                    // Sort by hire date (oldest first)
                    employees.sort((a, b) => new Date(a.hireDate) - new Date(b.hireDate));
                    break;
                case 'hireDate-desc':
                    // Sort by hire date (newest first)
                    employees.sort((a, b) => new Date(b.hireDate) - new Date(a.hireDate));
                    break;
                default:
                    // No sorting
                    break;
            }
        }

        return employees;
    };

    /**
     * Đếm tổng số kết quả tìm kiếm.
     * @param {object} criteria - Tiêu chí tìm kiếm.
     * @returns {number} - Số lượng nhân viên tìm thấy.
     */
    const countResults = (criteria) => {
        return filterEmployees(criteria).length;
    };

    /**
     * Tìm kiếm nhanh theo tên (helper function).
     * @param {string} searchTerm - Từ khóa tìm kiếm.
     * @returns {Array} - Mảng nhân viên phù hợp.
     */
    const quickSearch = (searchTerm) => {
        return filterEmployees({ name: searchTerm });
    };

    return {
        filterEmployees,
        countResults,
        quickSearch
    };
})();

export default SearchModule;
