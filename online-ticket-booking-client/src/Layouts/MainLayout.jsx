import { Outlet } from "react-router";
import NavBar from "../components/shared/NavBar";

const MainLayout = () => {
    return (
        <div>
            <NavBar />
            <Outlet />
        </div>
    );
};

export default MainLayout;