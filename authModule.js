// file: authModule.js
const AuthModule = (() => {
    const KEY = 'users';
    const SESSION_KEY = 'session';

    // Khởi tạo users với admin mặc định
    let users = JSON.parse(localStorage.getItem(KEY)) || [];

    // ✅ THÊM ĐOẠN NÀY: Tạo admin mặc định nếu chưa có
    if (users.length === 0) {
        const defaultAdmin = {
            username: 'admin',
            password: hashPassword('12345')
        };
        users.push(defaultAdmin);
        localStorage.setItem(KEY, JSON.stringify(users));
        console.log('✅ Đã tạo tài khoản admin mặc định');
    }

    const hashPassword = (password) => {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash |= 0;
        }
        return hash;
    };

    const login = async (username, password) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const user = users.find(u => u.username === username);
                if (!user) {
                    resolve({ success: false, message: 'Không tìm thấy user!' });
                    return;
                }
                if (user.password !== hashPassword(password)) {
                    resolve({ success: false, message: 'Sai mật khẩu!' });
                    return;
                }

                localStorage.setItem(SESSION_KEY, JSON.stringify({ username }));
                resolve({ success: true, message: 'Đăng nhập thành công!' });
            }, 500);
        });
    };

    const register = async (username, password) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (users.find(u => u.username === username)) {
                    resolve({ success: false, message: 'User đã tồn tại!' });
                    return;
                }

                users.push({ username, password: hashPassword(password) });
                localStorage.setItem(KEY, JSON.stringify(users));
                resolve({ success: true, message: 'Đăng ký thành công!' });
            }, 500);
        });
    };

    const logout = () => {
        localStorage.removeItem(SESSION_KEY);
    };

    const getCurrentUser = () => {
        return JSON.parse(localStorage.getItem(SESSION_KEY));
    };

    return {
        login,
        register,
        logout,
        getCurrentUser
    };
})();

export default AuthModule;
