import EmployeeDbModule from './EmployeeDbModule.js';

const PerformanceModule = (() => {
    const REVIEWS_KEY = 'performanceReviews';
    let reviews = JSON.parse(localStorage.getItem(REVIEWS_KEY)) || [];

    const _saveReviews = () => {
        localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
    };

    /**
     * Thêm một đánh giá mới cho nhân viên.
     * @param {number} employeeId
     * @param {number} rating - Điểm số từ 1 đến 5
     * @param {string} feedback - Nhận xét
     */
    const addReview = (employeeId, rating, feedback) => {
        const newReview = {
            id: Date.now(),
            employeeId,
            date: new Date().toLocaleDateString('vi-VN'),
            rating,
            feedback
        };
        reviews.push(newReview);
        _saveReviews();
    };

    /**
     * Lấy tất cả đánh giá và tính điểm trung bình cho mỗi nhân viên.
     * @returns {Array} Mảng các đối tượng nhân viên với thông tin đánh giá.
     */
    const getPerformanceReport = () => {
        const employees = EmployeeDbModule.getAllEmployees();

        return employees.map(emp => {
            // Lọc ra tất cả đánh giá của nhân viên này
            const empReviews = reviews.filter(r => r.employeeId === emp.id);

            // Sử dụng reduce để tính tổng điểm
            const totalRating = empReviews.reduce((sum, review) => sum + review.rating, 0);

            // Tính điểm trung bình
            const averageRating = empReviews.length > 0 ? (totalRating / empReviews.length).toFixed(2) : 'Chưa có';

            return {
                employeeId: emp.id,
                employeeName: emp.name,
                reviewCount: empReviews.length,
                averageRating: averageRating,
                reviews: empReviews // Danh sách chi tiết các đánh giá
            };
        });
    };

    return {
        addReview,
        getPerformanceReport
    };
})();

export default PerformanceModule;
