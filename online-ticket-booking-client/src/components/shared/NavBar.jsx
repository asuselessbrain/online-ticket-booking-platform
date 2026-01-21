import { Link, NavLink } from "react-router";
import Logo from "./Logo";
import { use, useState } from "react";
import { IoMenu } from "react-icons/io5";
import { AuthContext } from "../../providers/AuthContext";
import { toast } from "react-toastify";
import useRole from "../../lib/userRole";
import Loading from "./Loading";

const NavBar = () => {
    const baseLinks = [
        { name: 'Home', link: '/' },
        { name: 'All Tickets', link: '/tickets' },
        { name: 'About', link: '/about' },
        { name: 'Contact', link: '/contact' }
    ];


    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = use(AuthContext)
    const { role, roleLoading } = useRole()

    if (roleLoading) {
        return <Loading fullPage message="Loading..." />;
    }

    const navLinks = user ? [...baseLinks, { name: 'Dashboard', link: `/${role}` }] : baseLinks;


    const handelLogout = async () => {
        try {
            await logout();
            toast.success("Logout successful!")
        } catch (error) {
            toast.error(error.message.split("/")[1].split(")")[0])
        }
    }

    return (
        <header className="bg-[#01602a]">
            <nav className="max-w-[1440px] mx-auto px-2 2xl:px-0 py-4 flex justify-between items-center">
                <Logo />
                <ul className={`flex flex-col md:flex-row items-center gap-2 md:gap-6 absolute md:static left-0 w-full md:w-auto bg-[#01602a] md:bg-transparent transition-all duration-500 ease-in-out ${isOpen ? "top-16 opacity-100 mt-4" : "-top-full opacity-0 md:opacity-100"}`}>
                    {
                        navLinks.map((navLink, index) => (
                            <li key={index} className="w-full md:w-auto text-white">
                                <NavLink to={navLink.link} className="block w-full text-left px-2">{navLink.name}</NavLink>
                            </li>
                        ))
                    }
                    <li className="w-full md:w-auto mt-2 md:mt-0">
                        {
                            user ? <button
                                type="button"
                                onClick={handelLogout}
                                className="text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-500/50 font-medium rounded text-sm cursor-pointer px-4 py-2 text-center dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-500/50"
                            >
                                Logout
                            </button> :
                                <Link
                                    to="/login"
                                    className="w-full block text-center md:w-auto bg-[#079d49] text-white px-4 py-2 rounded hover:bg-[#06863e] transition-all duration-700 font-semibold"
                                >
                                    Login
                                </Link>
                        }
                    </li>
                </ul>
                <IoMenu size={30} className="block md:hidden text-white" onClick={() => setIsOpen(!isOpen)} />
            </nav>
        </header>
    );
};

export default NavBar;