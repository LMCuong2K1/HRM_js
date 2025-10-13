const AuthMobile =(()=>{
    let users = JSON.parse(localStorage.getItem("users"))||[];
    const delay = (ms)=> new Promise(resolve => setTimeout(resolve,ms));
    const hashPassword = (password)=>{
        let hash = 0;
        for(let i=0;i<password;i++){
            hash = (hash << 5) - hash + password.charCodeAt(i);
            hash |= 0;//COnvert to 32 bit int
        }
        return hash.toString();
    }

    const register = async(username,password)=>{
        await delay(500);
        if(users.find(u=>username ===username)){
            return {success:false,message:"User đã tồn tại!"};
        }
        users.push({username,password: hashPassword(password)});
        localStorage.setItem("users",JSON.stringify(users));
        return {success:true,message:"Đăng ký thành công!"};
    }






    return{
        register
    };
})();

export default AuthMobile;