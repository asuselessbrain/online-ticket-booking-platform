import { use } from "react";
import { FcGoogle } from "react-icons/fc";
import { AuthContext } from "../../providers/AuthContext";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const GoogleLogin = () => {
    const { loginWithGoogle } = use(AuthContext)
    const navigate = useNavigate()
    const handleGoogleLogin = async () => {
        try {
            const res = await loginWithGoogle()
            if(res.user){
                toast.success("Registration successful!")
                navigate("/")
            }
        } catch (error) {
            toast.error(error.message.split("/")[1].split(")")[0])
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