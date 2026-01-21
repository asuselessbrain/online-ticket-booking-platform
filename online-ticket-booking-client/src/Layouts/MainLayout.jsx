import { Outlet } from "react-router";
import NavBar from "../components/shared/NavBar";
import Footer from "../components/shared/Footer";
import useRole from "../lib/userRole";
import Loading from "../components/shared/Loading";

const MainLayout = () => {

    const { role, roleLoading } = useRole()
    console.log(role, roleLoading)

    return (
        <>
            {
                roleLoading ? <Loading fullPage message="Loading..." className="flex items-center justify-center min-h-screen" /> : <div>
                    <NavBar />
                    <Outlet />
                    <Footer />
                </div>
            }
        </>
    )
};

export default MainLayout;