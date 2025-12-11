import { use, useState } from "react";
import { useForm } from "react-hook-form";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import GoogleLogin from "../../components/shared/GoogleLogin";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { AuthContext } from "../../providers/AuthContext";

const Registration = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { createUser, updateUser } = use(AuthContext)
    const navigate = useNavigate()

    const handleLogin = async (data) => {
        console.log(data);
        if (data.password !== data.confirmPassword) {
            return toast.error("Password and confirm Password must match")
        }
        const formData = new FormData();

        formData.append('file', data.profilePicture)
        formData.append('upload_preset', "my_preset")


        try {
            const res = await createUser(data.email, data.password)
            if (res.user) {
                const imgRes = await fetch('https://api.cloudinary.com/v1_1/dwduymu1l/image/upload', {
                    method: "POST",
                    body: formData
                })
                const data = await imgRes.json()
                const photoURL = data.secure_url

                const payload = {
                    displayName: data.name,
                    photoURL
                }

                await updateUser(payload)

                toast.success("Registration successful!")
                navigate("/")
            }

        } catch (error) {
            toast.error(error.message.split("/")[1].split(")")[0])
        }

    }
    return (
        <div className="my-20 max-w-xl mx-auto shadow-[0_0_25px_rgba(0,0,0,0.15)] p-10 rounded">
            <h2 className="text-2xl font-semibold">sign up</h2>
            <p className="mt-4 mb-6">Create an account to easily use bus365 services</p>
            <form onSubmit={handleSubmit(handleLogin)}>
                <input type="text" className="w-full px-4 py-2 block border border-gray-300 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-[#01602a]" {...register("name", { required: true })} placeholder="Arfan Ahmed" />
                {
                    errors.name && <span className="text-red-500">This field is required</span>
                }
                <input type="email" className="w-full px-4 py-2 block border border-gray-300 rounded mb-2 mt-6 focus:outline-none focus:ring-2 focus:ring-[#01602a]" {...register("email", { required: true })} placeholder="example@gmail.com" />
                {
                    errors.email && <span className="text-red-500">This field is required</span>
                }
                <input type="file" className="w-full px-4 py-2 block border border-gray-300 rounded mb-2 mt-6 focus:outline-none focus:ring-2 focus:ring-[#01602a]" {...register("profilePicture", { required: true })} placeholder="profile Picture" />
                {
                    errors.profilePicture && <span className="text-red-500">This field is required</span>
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
                <div className="relative">
                    <input type={showConfirmPassword ? "text" : "password"} className="w-full px-4 py-2 block border border-gray-300 rounded mt-6 mb-2 focus:outline-none focus:ring-2 focus:ring-[#01602a]" {...register("confirmPassword", { required: true })} placeholder="Confirm Password" />
                    <div className="absolute top-1/2 right-4 -translate-y-1/2">
                        {
                            showConfirmPassword ? <FaRegEyeSlash size={24} onClick={() => setShowConfirmPassword(false)} /> : <FaRegEye size={24} onClick={() => setShowConfirmPassword(true)} />
                        }
                    </div>
                </div>
                {
                    errors.confirmPassword && <span className="text-red-500">This field is required</span>
                }
                <p className="text-[#01602a] my-4">Forget Password</p>
                <input type="submit" value="Sign In" className="bg-[#01602a] w-full text-white px-4 py-2 rounded cursor-pointer" />
                <p className="my-4">Don't have an account? <Link to="/login" className="text-[#01602a]">Sign Up</Link></p>
            </form>

            <p className="text-center text-gray-500">OR</p>
            <GoogleLogin />
        </div>
    );
};

export default Registration;