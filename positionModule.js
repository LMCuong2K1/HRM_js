// file: positionModule.js

const PositionModule = (() => {
    const KEY = 'positions';

    // ✅ Default positions
    const DEFAULT_POSITIONS = [
        { id: 1, title: 'Lập trình viên', description: 'Phát triển phần mềm', salaryBase: 15000000 },
        { id: 2, title: 'Trưởng phòng Kinh doanh', description: 'Quản lý bộ phận kinh doanh', salaryBase: 25000000 },
        { id: 3, title: 'Nhân viên Marketing', description: 'Tiếp thị sản phẩm', salaryBase: 12000000 },
        { id: 4, title: 'Kế toán', description: 'Quản lý tài chính', salaryBase: 14000000 }
    ];

    const _getPositions = () => {
        return JSON.parse(localStorage.getItem(KEY)) || [];
    };

    const _savePositions = (positions) => {
        localStorage.setItem(KEY, JSON.stringify(positions));
    };

    const _initDefaultPositions = () => {
        const existing = _getPositions();
        if (existing.length === 0) {
            _savePositions(DEFAULT_POSITIONS);
            console.log('✅ Khởi tạo 4 positions mặc định');
        }
    };

    /**
     * ✅ FIX: getAll() tự động init nếu empty
     */
    const getAll = () => {
        let positions = _getPositions();
        if (positions.length === 0) {
            _initDefaultPositions();
            positions = _getPositions();
        }
        return positions;
    };

    const getById = (id) => {
        const positions = _getPositions();
        return positions.find(p => p.id === id);
    };

    const add = async (title, description = '', salaryBase = 0) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const positions = _getPositions();

                if (!title || title.trim().length === 0) {
                    resolve(null);
                    return;
                }

                if (salaryBase < 0) {
                    resolve(null);
                    return;
                }

                const exists = positions.find(p =>
                    p.title.toLowerCase() === title.trim().toLowerCase()
                );
                if (exists) {
                    resolve(null);
                    return;
                }

                const newId = positions.length ? Math.max(...positions.map(p => p.id)) + 1 : 1;
                const newPosition = {
                    id: newId,
                    title: title.trim(),
                    description: description.trim(),
                    salaryBase
                };

                positions.push(newPosition);
                _savePositions(positions);
                resolve(newPosition);
            }, 100);
        });
    };

    const edit = async (id, titleOrUpdates, description, salaryBase) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const positions = _getPositions();
                const index = positions.findIndex(p => p.id === id);

                if (index === -1) {
                    resolve(null);
                    return;
                }

                let updates;
                if (typeof titleOrUpdates === 'object') {
                    updates = titleOrUpdates;
                } else {
                    updates = {
                        title: titleOrUpdates,
                        description: description,
                        salaryBase: salaryBase
                    };
                }

                if (updates.title) {
                    const trimmedTitle = updates.title.trim();
                    if (trimmedTitle.length === 0) {
                        resolve(null);
                        return;
                    }

                    const duplicate = positions.find(p =>
                        p.id !== id && p.title.toLowerCase() === trimmedTitle.toLowerCase()
                    );
                    if (duplicate) {
                        resolve(null);
                        return;
                    }
                }

                if (updates.salaryBase !== undefined && updates.salaryBase < 0) {
                    resolve(null);
                    return;
                }

                positions[index] = {
                    ...positions[index],
                    ...updates,
                    id
                };

                _savePositions(positions);
                resolve(positions[index]);
            }, 100);
        });
    };

    const remove = async (id) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const positions = _getPositions();
                const index = positions.findIndex(p => p.id === id);

                if (index === -1) {
                    resolve(false);
                    return;
                }

                positions.splice(index, 1);
                _savePositions(positions);
                resolve(true);
            }, 100);
        });
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
