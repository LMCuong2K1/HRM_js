// file: authModule.js

const AuthModule = (() => {
    const KEY = 'users';
    const SESSION_KEY = 'session';

    const hashPassword = (password) => {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash |= 0;
        }
        return hash;
    };

    // ✅ HELPER: Load users FRESH từ localStorage mỗi lần
    const _getUsers = () => {
        return JSON.parse(localStorage.getItem(KEY)) || [];
    };

    // ✅ HELPER: Save users vào localStorage
    const _saveUsers = (users) => {
        localStorage.setItem(KEY, JSON.stringify(users));
    };

    // ✅ KHỞI TẠO: Chỉ chạy 1 lần khi module load
    const _initDefaultAdmin = () => {
        const users = _getUsers();
        if (users.length === 0) {
            const defaultAdmin = {
                username: 'admin',
                password: hashPassword('12345')
            };
            users.push(defaultAdmin);
            _saveUsers(users);
            console.log('✅ Đã tạo admin mặc định');
        }
    };
    _initDefaultAdmin(); // Gọi init ngay khi load module

    const login = async (username, password) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const users = _getUsers(); // ✅ Load fresh từ localStorage
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
                const users = _getUsers(); // ✅ Load fresh từ localStorage

                if (users.find(u => u.username === username)) {
                    resolve({ success: false, message: 'User đã tồn tại!' });
                    return;
                }

                users.push({ username, password: hashPassword(password) });
                _saveUsers(users); // ✅ Save vào localStorage
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
