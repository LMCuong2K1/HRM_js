// file: departmentModule.js
const DepartmentModule = (() => {
    const key = 'departments';
    let departments = JSON.parse(localStorage.getItem(key)) || [
        { id: 1, name: 'Kinh doanh' },
        { id: 2, name: 'Kỹ thuật' }
    ];

    const getAll = () => departments;

    const add = (name) => {
        const newId = departments.length ? Math.max(...departments.map(d => d.id)) + 1 : 1;
        const newDept = { id: newId, name };
        departments.push(newDept);
        localStorage.setItem(key, JSON.stringify(departments));
        return newDept;
    };

    // Thêm các hàm edit, delete sau
    
    return { getAll, add };
})();

export default DepartmentModule;
