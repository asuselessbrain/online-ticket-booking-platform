import { use, useState } from "react";
import { useForm } from "react-hook-form";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import GoogleLogin from "../../components/shared/GoogleLogin";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../../providers/AuthContext";
import { toast } from "react-toastify";
import api from "../../lib/axios";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { loginWithEmail, logout } = use(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (data) => {
        try {
            const firebaseResult = await loginWithEmail(data.email, data.password);
            
            if (firebaseResult.user) {
                const backendResult = await api.post('/api/v1/users/login', {
                    email: data.email,
                    password: data.password
                });

                if (backendResult.data.success) {
                    toast.success("Login successful!");
                    navigate("/");
                }
            }

            
        } catch (error) {
            await logout();
            toast.error(error.response?.data?.message || "Login failed");
        }
    }

    return (
        <div className="my-20 max-w-xl mx-auto shadow-[0_0_25px_rgba(0,0,0,0.15)] p-10 rounded">
            <h2 className="text-2xl font-semibold mb-10">Sign In</h2>
            <form onSubmit={handleSubmit(handleLogin)}>
                <input type="email" className="w-full px-4 py-2 block border border-gray-300 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-[#01602a]" {...register("email", { required: true })} placeholder="example@gmail.com" />
                {
                    errors.email && <span className="text-red-500">This field is required</span>
                }
                <div className="relative">
                    <input type={showPassword ? "text" : "password"} className="w-full px-4 py-2 block border border-gray-300 rounded mt-6 mb-2 focus:outline-none focus:ring-2 focus:ring-[#01602a]" {...register("password", { required: true })} placeholder="Password" />
                    <div className="absolute top-1/2 right-4 -translate-y-1/2">
                        {
                            showPassword ? <FaRegEyeSlash size={24} onClick={() => setShowPassword(false)} /> : <FaRegEye size={24} onClick={() => setShowPassword(true)} />
                        }
                    </div>
                </div>
                {
                    errors.password && <span className="text-red-500">This field is required</span>
                }
                <p className="text-[#01602a] my-4">Forget Password</p>
                <input type="submit" value="Sign In" className="bg-[#01602a] w-full text-white px-4 py-2 rounded cursor-pointer" />
                <p className="my-4">Don't have an account? <Link to="/registration" className="text-[#01602a]">Sign Up</Link></p>
            </form>

            <p className="text-center text-gray-500">OR</p>
            <GoogleLogin />
        </div>
    );
};

export default Login;