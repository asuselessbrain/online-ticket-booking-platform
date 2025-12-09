import { createBrowserRouter } from "react-router";
import MainLayout from "../Layouts/MainLayout";
import Login from "../pages/Login/Login";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                path: "/login",
                element: <Login />
            }
        ]
    },
    {
        path: "*",
        element: <div>404 Not Found</div>
    },

])

export default router;