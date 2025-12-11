import { FcGoogle } from "react-icons/fc";

const GoogleLogin = () => {
    return (
        <button className="bg-white cursor-pointer w-full text-black border border-gray-300 px-4 py-2 rounded mt-4 flex items-center justify-center gap-4">
            <FcGoogle size={30} />
            Continue with Google
        </button>
    );
};

export default GoogleLogin;