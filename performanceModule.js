// file: performanceModule.js
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
        if (rating < 1 || rating > 5) {
            throw new Error('Điểm số phải từ 1 đến 5!');
        }

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
            const averageRating = empReviews.length > 0
                ? (totalRating / empReviews.length).toFixed(2)
                : 'Chưa có';

            // ✅ Trả về đầy đủ thông tin từ employee object + thông tin đánh giá
            return {
                id: emp.id,
                name: emp.name,
                departmentId: emp.departmentId,
                positionId: emp.positionId,
                reviewCount: empReviews.length,
                averageRating: averageRating,
                reviews: empReviews // Danh sách chi tiết các đánh giá
            };
        });
    };

    /**
     * Lấy top performers (sắp xếp theo điểm trung bình cao nhất)
     * @param {number} limit - Số lượng nhân viên cần lấy
     */
    const getTopPerformers = (limit = 5) => {
        const report = getPerformanceReport();

        return report
            .filter(emp => emp.reviewCount > 0) // Chỉ lấy nhân viên có đánh giá
            .sort((a, b) => {
                const ratingA = parseFloat(a.averageRating) || 0;
                const ratingB = parseFloat(b.averageRating) || 0;
                return ratingB - ratingA; // Sắp xếp giảm dần
            })
            .slice(0, limit);
    };

    return {
        addReview,
        getPerformanceReport,
        getTopPerformers
    };
})();

export default PerformanceModule;
