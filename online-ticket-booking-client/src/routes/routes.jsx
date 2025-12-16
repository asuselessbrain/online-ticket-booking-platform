import { createBrowserRouter } from "react-router";
import MainLayout from "../Layouts/MainLayout";
import VendorDashboard from "../Layouts/VendorDashboard";
import AdminDashboard from "../Layouts/AdminDashboard";
import Login from "../pages/Login/Login";
import Registration from "../pages/Registration/Registration";
import Home from "../pages/Home/Home";
import AllTickets from "../pages/AllTickets/AllTickets";
import About from "../pages/About/About";
import Contact from "../pages/Contact/Contact";
import Profile from "../pages/Vendor/Profile";
import AddTicket from "../pages/Vendor/AddTicket";
import MyTickets from "../pages/Vendor/MyTickets";
import RequestedBookings from "../pages/Vendor/RequestedBookings";
import RevenueOverview from "../pages/Vendor/RevenueOverview";
import AdminProfile from "../pages/Admin/Profile";
import ManageTickets from "../pages/Admin/ManageTickets";
import ManageUsers from "../pages/Admin/ManageUsers";
import AdvertiseTickets from "../pages/Admin/AdvertiseTickets";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";

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
        path: "/admin",
        element: <PrivateRoute>
            <AdminRoute>
                <AdminDashboard />
            </AdminRoute>
        </PrivateRoute>,
        children: [
            { index: true, element: <AdminProfile /> },
            { path: "profile", element: <AdminProfile /> },
            { path: "manage-tickets", element: <ManageTickets /> },
            { path: "manage-users", element: <ManageUsers /> },
            { path: "advertise-tickets", element: <AdvertiseTickets /> },
        ]
    },
    {
        path: "/vendor",
        element: <VendorDashboard />,
        children: [
            { index: true, element: <Profile /> },
            { path: "profile", element: <Profile /> },
            { path: "add-ticket", element: <AddTicket /> },
            { path: "my-tickets", element: <MyTickets /> },
            { path: "requested-bookings", element: <RequestedBookings /> },
            { path: "revenue", element: <RevenueOverview /> }
        ]
    },
    {
        path: "*",
        element: <div>404 Not Found</div>
    },

])

export default router;