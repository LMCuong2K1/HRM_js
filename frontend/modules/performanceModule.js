// file: performanceModule.js

import EmployeeDbModule from './EmployeeDbModule.js';

const PerformanceModule = (() => {
    const REVIEWS_KEY = 'performanceReviews';

    const _getReviews = () => {
        return JSON.parse(localStorage.getItem(REVIEWS_KEY)) || [];
    };

    const _saveReviews = (reviews) => {
        localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
    };

    const addReview = (employeeId, rating, feedback) => {
        if (rating < 1 || rating > 5) {
            console.warn('Điểm số phải từ 1 đến 5!');
            return null;
        }

        const reviews = _getReviews();
        const newReview = {
            id: Date.now(),
            employeeId,
            date: new Date().toLocaleDateString('vi-VN'),
            rating,
            feedback
        };

        reviews.push(newReview);
        _saveReviews(reviews);
        return newReview;
    };

    const getReviews = (employeeId) => {
        const reviews = _getReviews();
        return reviews.filter(r => r.employeeId === employeeId);
    };

    const getAverageRating = (employeeId) => {
        const empReviews = getReviews(employeeId);
        if (empReviews.length === 0) return 0;

        const totalRating = empReviews.reduce((sum, review) => sum + review.rating, 0);
        return totalRating / empReviews.length;
    };

    /**
     * ✅ FIX: Return report cho 1 employee hoặc ALL employees
     * Với parameter employeeId = null, return ALL
     */
    const getPerformanceReport = (employeeId = null) => {
        const reviews = _getReviews();

        // ✅ Nếu có employeeId, chỉ lấy report cho 1 người
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
                reviews: empReviews  // ✅ Include reviews
            };
        }

        // ✅ Nếu không có employeeId, lấy report cho tất cả
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
                reviews: empReviews  // ✅ CRITICAL: Include ALL reviews
            };
        });
    };

    const getTopPerformers = (limit = 5) => {
        const report = getPerformanceReport();
        return report
            .filter(emp => emp.reviewCount > 0)
            .sort((a, b) => {
                const ratingA = parseFloat(a.averageRating) || 0;
                const ratingB = parseFloat(b.averageRating) || 0;
                return ratingB - ratingA;
            })
            .slice(0, limit);
    };

    return {
        addReview,
        getReviews,
        getAverageRating,
        getPerformanceReport,
        getTopPerformers
    };
})();

export default PerformanceModule;
