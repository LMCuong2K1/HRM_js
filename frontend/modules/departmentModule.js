// file: departmentModule.js

const DepartmentModule = (() => {
    const KEY = 'departments';

    // ✅ Default departments
    const DEFAULT_DEPARTMENTS = [
        { id: 1, name: 'Kinh doanh', managerId: null },
        { id: 2, name: 'Kỹ thuật', managerId: null },
        { id: 3, name: 'Nhân sự', managerId: null }
    ];

    // ✅ HELPER: Load departments FRESH
    const _getDepartments = () => {
        return JSON.parse(localStorage.getItem(KEY)) || [];
    };

    // ✅ HELPER: Save departments
    const _saveDepartments = (depts) => {
        localStorage.setItem(KEY, JSON.stringify(depts));
    };

    // ✅ INIT: Default departments
    const _initDefaultDepartments = () => {
        const existing = _getDepartments();
        if (existing.length === 0) {
            _saveDepartments(DEFAULT_DEPARTMENTS);
            console.log('✅ Đã khởi tạo 3 phòng ban mặc định');
        }
    };

    /**
     * ✅ FIX: getAll() tự động init nếu empty
     */
    const getAll = () => {
        let departments = _getDepartments();
        if (departments.length === 0) {
            _initDefaultDepartments();
            departments = _getDepartments();
        }
        return departments;
    };

    const getById = (id) => {
        const departments = _getDepartments();
        return departments.find(d => d.id === id);
    };

    const add = (name, managerId = null) => {
        if (!name || name.trim().length === 0) {
            return null;
        }

        const departments = _getDepartments();

        const exists = departments.find(d =>
            d.name.toLowerCase() === name.trim().toLowerCase()
        );
        if (exists) {
            return null;
        }

        const newId = departments.length ? Math.max(...departments.map(d => d.id)) + 1 : 1;
        const newDept = {
            id: newId,
            name: name.trim(),
            managerId
        };

        departments.push(newDept);
        _saveDepartments(departments);
        return newDept;
    };

    const edit = (id, nameOrUpdates) => {
        const departments = _getDepartments();
        const index = departments.findIndex(d => d.id === id);

        if (index === -1) {
            return null;
        }

        const updates = typeof nameOrUpdates === 'string'
            ? { name: nameOrUpdates }
            : nameOrUpdates;

        if (updates.name) {
            const trimmedName = updates.name.trim();
            if (trimmedName.length === 0) {
                return null;
            }

            const duplicate = departments.find(d =>
                d.id !== id && d.name.toLowerCase() === trimmedName.toLowerCase()
            );
            if (duplicate) {
                return null;
            }
        }

        departments[index] = {
            ...departments[index],
            ...updates,
            id
        };

        _saveDepartments(departments);
        return departments[index];
    };

    const deleteDept = (id) => {
        const departments = _getDepartments();
        const index = departments.findIndex(d => d.id === id);

        if (index === -1) {
            return false;
        }

        departments.splice(index, 1);
        _saveDepartments(departments);
        return true;
    };

    const remove = (id) => deleteDept(id);

    return {
        getAll,
        getById,
        add,
        edit,
        delete: deleteDept,
        remove
    };
})();

export default DepartmentModule;
