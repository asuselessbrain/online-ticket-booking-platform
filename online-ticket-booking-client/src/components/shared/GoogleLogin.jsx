import { use } from "react";
import { FcGoogle } from "react-icons/fc";
import { AuthContext } from "../../providers/AuthContext";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import api from "../../lib/axios";

const GoogleLogin = () => {
    const { loginWithGoogle } = use(AuthContext)
    const navigate = useNavigate()
    const handleGoogleLogin = async () => {
        try {
            const res = await loginWithGoogle()
            if(res.user){
                // Check if user exists in backend, if not create account
                try {
                    // Try to login first (user might already exist)
                    const loginResult = await api.post('/api/v1/users/login', {
                        email: res.user.email,
                        password: res.user.uid // Use Firebase UID as password for Google users
                    });
                    
                    if (loginResult.data.success) {
                        toast.success("Login successful!");
                        navigate("/");
                    }
                // eslint-disable-next-line no-unused-vars
                } catch (loginError) {
                    // If login fails, create new account
                    const userData = {
                        name: res.user.displayName,
                        email: res.user.email,
                        password: res.user.uid, // Use Firebase UID as password
                        imageUrl: res.user.photoURL || 'https://via.placeholder.com/150'
                    };
                    
                    const signupResult = await api.post('/api/v1/users', userData);
                    
                    if (signupResult.data.success) {
                        toast.success("Account created successfully!");
                        navigate("/");
                    }
                }
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Authentication failed");
        }
    }
    return (
        <button onClick={handleGoogleLogin} className="bg-white cursor-pointer w-full text-black border border-gray-300 px-4 py-2 rounded mt-4 flex items-center justify-center gap-4">
            <FcGoogle size={30} />
            Continue with Google
        </button>
    );
};

export default GoogleLogin;