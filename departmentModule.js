// file: departmentModule.js
const DepartmentModule = (() => {
    const KEY = 'departments';

    // Khởi tạo dữ liệu mặc định
    let departments = JSON.parse(localStorage.getItem(KEY)) || [
        { id: 1, name: 'Kinh doanh', managerId: null },
        { id: 2, name: 'Kỹ thuật', managerId: null },
        { id: 3, name: 'Nhân sự', managerId: null }
    ];

    // Lưu vào localStorage ngay khi khởi tạo nếu chưa có
    if (!localStorage.getItem(KEY)) {
        localStorage.setItem(KEY, JSON.stringify(departments));
    }

    /**
     * Lưu dữ liệu vào localStorage
     */
    const _saveDepartments = () => {
        localStorage.setItem(KEY, JSON.stringify(departments));
    };

    /**
     * Lấy tất cả phòng ban
     */
    const getAll = () => departments;

    /**
     * Lấy phòng ban theo ID
     */
    const getById = (id) => {
        return departments.find(d => d.id === id);
    };

    /**
     * Thêm phòng ban mới
     * @param {string} name - Tên phòng ban
     * @param {number|null} managerId - ID người quản lý (tùy chọn)
     */
    const add = (name, managerId = null) => {
        if (!name || name.trim().length === 0) {
            throw new Error('Tên phòng ban không được để trống!');
        }

        // Kiểm tra trùng tên
        const exists = departments.find(d =>
            d.name.toLowerCase() === name.trim().toLowerCase()
        );
        if (exists) {
            throw new Error('Tên phòng ban đã tồn tại!');
        }

        const newId = departments.length ? Math.max(...departments.map(d => d.id)) + 1 : 1;
        const newDept = {
            id: newId,
            name: name.trim(),
            managerId
        };
        departments.push(newDept);
        _saveDepartments();
        return newDept;
    };

    /**
     * Sửa thông tin phòng ban
     * @param {number} id - ID phòng ban cần sửa
     * @param {object} updates - Object chứa các field cần update
     */
    const edit = (id, updates) => {
        const index = departments.findIndex(d => d.id === id);
        if (index === -1) {
            throw new Error('Không tìm thấy phòng ban!');
        }

        // Validate tên nếu có update
        if (updates.name) {
            const trimmedName = updates.name.trim();
            if (trimmedName.length === 0) {
                throw new Error('Tên phòng ban không được để trống!');
            }

            // Kiểm tra trùng tên với phòng ban khác
            const duplicate = departments.find(d =>
                d.id !== id && d.name.toLowerCase() === trimmedName.toLowerCase()
            );
            if (duplicate) {
                throw new Error('Tên phòng ban đã tồn tại!');
            }
        }

        // Cập nhật dữ liệu
        departments[index] = {
            ...departments[index],
            ...updates,
            id // Đảm bảo ID không bị thay đổi
        };
        _saveDepartments();
        return departments[index];
    };

    /**
     * Xóa phòng ban
     * @param {number} id - ID phòng ban cần xóa
     * @returns {boolean} - true nếu xóa thành công
     */
    const remove = (id) => {
        const index = departments.findIndex(d => d.id === id);
        if (index === -1) {
            throw new Error('Không tìm thấy phòng ban!');
        }

        // Kiểm tra xem có nhân viên nào thuộc phòng ban này không
        // (Cần import EmployeeDbModule nếu muốn kiểm tra - optional)

        departments.splice(index, 1);
        _saveDepartments();
        return true;
    };

    return {
        getAll,
        getById,
        add,
        edit,
        remove
    };
})();

export default DepartmentModule;
