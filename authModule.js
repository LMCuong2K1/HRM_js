// file: authModule.js

const AuthModule = (() => {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const hashPassword = (password) => {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash |= 0; // Chuyển thành số nguyên 32-bit
        }
        return hash;
    };

    const register = async (username, password) => {
        await delay(500);
        if (users.find(u => u.username === username)) {
            return { success: false, message: "User đã tồn tại!" };
        }
        users.push({ username, password: hashPassword(password) });
        localStorage.setItem("users", JSON.stringify(users));
        return { success: true, message: "Đăng ký thành công!" };
    };

    const login = async (username, password) => {
        await delay(500);
        // Sửa lỗi: `users.find` thay vì `user.find`
        const user = users.find(u => u.username === username);
        if (!user) {
            return { success: false, message: "Không tìm thấy user!" };
        }
        if (user.password !== hashPassword(password)) {
            return { success: false, message: "Sai mật khẩu!" };
        }
        localStorage.setItem('session', JSON.stringify({ username }));
        return { success: true, message: "Đăng nhập thành công!" };
    };

    /**
     * Lấy thông tin người dùng đang đăng nhập.
     * Sửa tên hàm từ currentUser thành getCurrentUser cho nhất quán.
     */
    const getCurrentUser = () => {
        const sessionData = localStorage.getItem("session");
        if (!sessionData) return null;
        try {
            // Trả về cả object user, không chỉ username
            return JSON.parse(sessionData);
        } catch (e) {
            console.error("Lỗi parse session JSON:", e);
            return null;
        }
    };

    const logout = () => {
        localStorage.removeItem("session");
    };

    return {
        register,
        login,
        getCurrentUser, // Export đúng tên hàm
        logout
    };
})();

// Sửa lỗi: export đúng tên Module
export default AuthModule; 
