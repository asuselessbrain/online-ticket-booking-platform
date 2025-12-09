import { Link, NavLink } from "react-router";

const NavBar = () => {
    const navLinks = [
        {
            name: 'Home',
            link: '/'
        },
        {
            name: 'About',
            link: '/about'
        },
        {
            name: 'Contact',
            link: '/contact'
        }
    ]
    return (
        <header className="bg-[#01602a]">
            <nav className="max-w-[1440px] mx-auto px-2 2xl:px-0 py-4 flex justify-between items-center">
                <h1 className="text-white text-2xl md:text-3xl font-bold">Bus365</h1>
                <ul className="flex flex-col md:flex-row items-center gap-6">
                    {
                        navLinks.map((navLink, index) => (
                            <li key={index} className="inline-block mr-6 text-white">
                                <NavLink to={navLink.link}>{navLink.name}</NavLink>
                            </li>
                        ))
                    }
                    <li>
                        <Link to="/login" className="bg-[#079d49] text-white px-4 py-2 rounded hover:bg-[#06863e] transition-all duration-700 font-semibold">Login</Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default NavBar;