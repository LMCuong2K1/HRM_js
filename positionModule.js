// file: positionModule.js
const PositionModule = (() => {
    const KEY = 'positions';

    // Khởi tạo dữ liệu mặc định
    let positions = JSON.parse(localStorage.getItem(KEY)) || [
        { id: 1, title: 'Lập trình viên', description: 'Phát triển phần mềm', salaryBase: 15000000 },
        { id: 2, title: 'Trưởng phòng Kinh doanh', description: 'Quản lý bộ phận kinh doanh', salaryBase: 25000000 },
        { id: 3, title: 'Nhân viên Marketing', description: 'Tiếp thị sản phẩm', salaryBase: 12000000 },
        { id: 4, title: 'Kế toán', description: 'Quản lý tài chính', salaryBase: 14000000 }
    ];

    // Lưu vào localStorage ngay khi khởi tạo nếu chưa có
    if (!localStorage.getItem(KEY)) {
        localStorage.setItem(KEY, JSON.stringify(positions));
    }

    /**
     * Hàm lưu dữ liệu vào localStorage với async/await
     */
    const savePositions = async () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                localStorage.setItem(KEY, JSON.stringify(positions));
                resolve(true);
            }, 500); // Giả lập độ trễ 0.5 giây
        });
    };

    /**
     * Lấy tất cả vị trí
     */
    const getAll = () => positions;

    /**
     * Lấy vị trí theo ID
     */
    const getById = (id) => {
        return positions.find(p => p.id === id);
    };

    /**
     * Thêm vị trí mới
     * @param {string} title - Tên vị trí
     * @param {string} description - Mô tả vị trí
     * @param {number} salaryBase - Mức lương cơ bản
     */
    const add = async (title, description = '', salaryBase = 0) => {
        if (!title || title.trim().length === 0) {
            throw new Error('Tên vị trí không được để trống!');
        }

        if (salaryBase < 0) {
            throw new Error('Mức lương cơ bản không được âm!');
        }

        // Kiểm tra trùng tên
        const exists = positions.find(p =>
            p.title.toLowerCase() === title.trim().toLowerCase()
        );
        if (exists) {
            throw new Error('Tên vị trí đã tồn tại!');
        }

        const newId = positions.length ? Math.max(...positions.map(p => p.id)) + 1 : 1;
        const newPosition = {
            id: newId,
            title: title.trim(),
            description: description.trim(),
            salaryBase
        };
        positions.push(newPosition);
        await savePositions();
        return newPosition;
    };

    /**
     * Sửa thông tin vị trí
     * @param {number} id - ID vị trí cần sửa
     * @param {object} updates - Object chứa các field cần update
     */
    const edit = async (id, updates) => {
        const index = positions.findIndex(p => p.id === id);
        if (index === -1) {
            throw new Error('Không tìm thấy vị trí!');
        }

        // Validate title nếu có update
        if (updates.title) {
            const trimmedTitle = updates.title.trim();
            if (trimmedTitle.length === 0) {
                throw new Error('Tên vị trí không được để trống!');
            }

            // Kiểm tra trùng tên với vị trí khác
            const duplicate = positions.find(p =>
                p.id !== id && p.title.toLowerCase() === trimmedTitle.toLowerCase()
            );
            if (duplicate) {
                throw new Error('Tên vị trí đã tồn tại!');
            }
        }

        // Validate salaryBase nếu có update
        if (updates.salaryBase !== undefined && updates.salaryBase < 0) {
            throw new Error('Mức lương cơ bản không được âm!');
        }

        // Cập nhật dữ liệu
        positions[index] = {
            ...positions[index],
            ...updates,
            id // Đảm bảo ID không bị thay đổi
        };
        await savePositions();
        return positions[index];
    };

    /**
     * Xóa vị trí
     * @param {number} id - ID vị trí cần xóa
     */
    const remove = async (id) => {
        const index = positions.findIndex(p => p.id === id);
        if (index === -1) {
            throw new Error('Không tìm thấy vị trí!');
        }

        // Kiểm tra xem có nhân viên nào đang giữ vị trí này không
        // (Optional - cần import EmployeeDbModule)

        positions.splice(index, 1);
        await savePositions();
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

export default PositionModule;
