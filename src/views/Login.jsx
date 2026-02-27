import {  useState, useEffect } from 'react'
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;
function Login() {
       // 表單資料狀態(儲存登入表單輸入)

        const {register, handleSubmit, formState: { errors }
      } = useForm({
          mode: "onChange",
          defaultValues: {
            username: "",
            password: "",
          },
        });
        const [authData, setAuthData] = useState(null);
        const navigate = useNavigate();

        // 處理登入表單提交
        const onSubmit = async (formData) => {
            try {
            // e.preventDefault();
            const response = await axios.post(`${API_BASE}/admin/signin`, formData);
            // console.log(response);
            const { token, expired } = response.data;
            setAuthData({ token, expired });
            // getProducts();
            // setIsAuth(true);

            } catch (error) {
            // setIsAuth(false);
            console.log(error.response);
            
            }
        }
        // 處理登入狀態和導向
         useEffect(() => {

          if (authData) {
            const { token, expired } = authData;
            
            document.cookie = `hexToken=${token};expires=${new Date(expired)};path=/`;
            axios.defaults.headers.common.Authorization = token;

            alert("登入成功！");
            navigate("/products");
          }
        }, [authData, navigate]);


 return(
    <div className='container login'>
        <h1>請先登入</h1>
        <form className="form-floating" onSubmit={handleSubmit(onSubmit)}>

          <div className="form-floating mb-3">
            <input type="email" 
            className="form-control" 
            name="username" 
            placeholder="name@example.com"
             {...register("username", { 
              required: "請輸入帳號" ,
              pattern: {
                value: /^\S+@\S+$/i,
                message: "請輸入有效的電子郵件地址"
              }}
              )} />
            <label htmlFor="username">Email address</label>
            {errors.username && <p className="text-danger">{errors.username.message}</p>}
          </div>
          <div className="form-floating">
            <input type="password" 
            className="form-control" 
            name="password" 
            placeholder="Password" 
            {...register("password", { 
              required: "請輸入密碼",
              minLength: {
                value: 6,
                message: "密碼至少需要6個字元"  
              }})} />
            <label htmlFor="password">Password</label>
            {errors.password && <p className="text-danger">{errors.password.message}</p>}
          </div>
          <button type="submit" className='btn btn-primary w-100 mt-2' >登入</button>
        </form>
      </div>

 )

}
export default Login;