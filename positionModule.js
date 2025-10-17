// file: positionModule.js

const PositionModule = (() => {
    const KEY = 'positions';
    let positions = JSON.parse(localStorage.getItem(KEY)) || [
        { id: 1, title: 'Lập trình viên' },
        { id: 2, title: 'Trưởng phòng Kinh doanh' },
        { id: 3, title: 'Nhân viên Marketing' }
    ];

    // Hàm lưu dữ liệu vào localStorage (có giả lập delay)
    const savePositions = () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                localStorage.setItem(KEY, JSON.stringify(positions));
                resolve(true);
            }, 500); // Giả lập độ trễ 0.5 giây
        });
    };

    const getAll = () => positions;

    const add = async (title) => {
        if (!title) return null;
        const newId = positions.length ? Math.max(...positions.map(p => p.id)) + 1 : 1;
        const newPosition = { id: newId, title };
        positions.push(newPosition);
        await savePositions();
        return newPosition;
    };
    
    // Chúng ta sẽ thêm hàm edit và delete sau

    return {
        getAll,
        add
    };
})();

export default PositionModule;
