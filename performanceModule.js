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

    // ✅ THÊM MỚI: Lấy reviews của 1 nhân viên cụ thể
    const getReviews = (employeeId) => {
        return reviews.filter(r => r.employeeId === employeeId);
    };

    // ✅ THÊM MỚI: Tính rating trung bình của 1 nhân viên
    const getAverageRating = (employeeId) => {
        const empReviews = reviews.filter(r => r.employeeId === employeeId);
        if (empReviews.length === 0) return 0;

        const totalRating = empReviews.reduce((sum, review) => sum + review.rating, 0);
        return totalRating / empReviews.length;
    };

    // ✅ SỬA: Thêm parameter employeeId (optional)
    const getPerformanceReport = (employeeId = null) => {
        // Nếu có employeeId, chỉ lấy report cho 1 người
        if (employeeId !== null) {
            const employee = EmployeeDbModule.getEmployeeById(employeeId);
            if (!employee) return null;

            const empReviews = reviews.filter(r => r.employeeId === employeeId);
            const totalRating = empReviews.reduce((sum, review) => sum + review.rating, 0);
            const averageRating = empReviews.length > 0
                ? parseFloat((totalRating / empReviews.length).toFixed(2))
                : 0;

            return {
                id: employee.id,
                name: employee.name,
                departmentId: employee.departmentId,
                positionId: employee.positionId,
                reviewCount: empReviews.length,
                averageRating: averageRating,
                reviews: empReviews
            };
        }

        // Nếu không có employeeId, lấy report cho tất cả
        const employees = EmployeeDbModule.getAllEmployees();
        return employees.map(emp => {
            const empReviews = reviews.filter(r => r.employeeId === emp.id);
            const totalRating = empReviews.reduce((sum, review) => sum + review.rating, 0);
            const averageRating = empReviews.length > 0
                ? parseFloat((totalRating / empReviews.length).toFixed(2))
                : 0;

            return {
                id: emp.id,
                name: emp.name,
                departmentId: emp.departmentId,
                positionId: emp.positionId,
                reviewCount: empReviews.length,
                averageRating: averageRating,
                reviews: empReviews
            };
        });
    };

    const getTopPerformers = (limit = 5) => {
        const report = getPerformanceReport(); // Lấy tất cả
        return report
            .filter(emp => emp.reviewCount > 0)
            .sort((a, b) => {
                const ratingA = parseFloat(a.averageRating) || 0;
                const ratingB = parseFloat(b.averageRating) || 0;
                return ratingB - ratingA;
            })
            .slice(0, limit);
    };

    // ✅ EXPORT ĐẦY ĐỦ 5 FUNCTIONS
    return {
        addReview,
        getReviews,              // ← THÊM MỚI
        getAverageRating,        // ← THÊM MỚI
        getPerformanceReport,
        getTopPerformers
    };
})();

export default PerformanceModule;
