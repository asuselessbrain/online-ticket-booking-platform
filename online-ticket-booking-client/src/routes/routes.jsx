import { createBrowserRouter } from "react-router";
import MainLayout from "../Layouts/MainLayout";
import Login from "../pages/Login/Login";
import Registration from "../pages/Registration/Registration";
import Home from "../pages/Home/Home";
import AllTickets from "../pages/AllTickets/AllTickets";
import About from "../pages/About/About";
import Contact from "../pages/Contact/Contact";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: "/tickets",
                element: <AllTickets />
            },
            {
                path: "/about",
                element: <About />
            },
            {
                path: "/contact",
                element: <Contact />
            },
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "/registration",
                element: <Registration />
            }
        ]
    },
    {
        path: "*",
        element: <div>404 Not Found</div>
    },

])

export default router;