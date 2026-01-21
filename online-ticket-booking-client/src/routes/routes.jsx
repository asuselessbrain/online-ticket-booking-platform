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
import TicketDetails from "../pages/TicketDetails/TicketDetails";
import MyBookings from "../pages/User/MyBookings";
import UserDashboard from "../Layouts/UserDashboard";
import UserProfile from "../pages/User/Profile";
import TransactionHistory from "../pages/User/TransactionHistory";
import PaymentSuccess from "../pages/User/PaymentSuccess";
import UserRoute from "./UserRoute";
import VendorRoute from "./VendorRoute";
import NotFound from "../pages/NotFound";

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
                path: "/tickets/:id",
                element: <TicketDetails />
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
        path: "/user",
        element: <PrivateRoute>
            <UserRoute>
                <UserDashboard />
            </UserRoute>
        </PrivateRoute>,
        children: [
            {
                index: true,
                element: <PrivateRoute>
                    <UserRoute>
                        <UserProfile />
                    </UserRoute>
                </PrivateRoute>
            },
            {
                path: "profile",
                element: <PrivateRoute>
                    <UserRoute>
                        <UserProfile />
                    </UserRoute>
                </PrivateRoute>
            },
            {
                path: "my-bookings",
                element: <PrivateRoute>
                    <UserRoute>
                        <MyBookings />
                    </UserRoute>
                </PrivateRoute>
            },
            {
                path: "payment-success",
                element: <PrivateRoute>
                    <UserRoute>
                        <PaymentSuccess />
                    </UserRoute>
                </PrivateRoute>
            },
            {
                path: "transactions",
                element: <PrivateRoute>
                    <UserRoute>
                        <TransactionHistory />
                    </UserRoute>
                </PrivateRoute>
            },
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
            {
                index: true,
                element: <PrivateRoute>
                    <AdminRoute>
                        <AdminProfile />
                    </AdminRoute>
                </PrivateRoute>
            },
            {
                path: "profile",
                element: <PrivateRoute>
                    <AdminRoute>
                        <AdminProfile />
                    </AdminRoute>
                </PrivateRoute>
            },
            {
                path: "manage-tickets",
                element: <PrivateRoute>
                    <AdminRoute>
                        <ManageTickets />
                    </AdminRoute>
                </PrivateRoute>
            },
            {
                path: "manage-users",
                element: <PrivateRoute>
                    <AdminRoute>
                        <ManageUsers />
                    </AdminRoute>
                </PrivateRoute>
            },
            {
                path: "advertise-tickets",
                element: <PrivateRoute>
                    <AdminRoute>
                        <AdvertiseTickets />
                    </AdminRoute>
                </PrivateRoute>
            },
        ]
    },
    {
        path: "/vendor",
        element: <PrivateRoute>
            <VendorRoute>
                <VendorDashboard />
            </VendorRoute>
        </PrivateRoute>,
        children: [
            {
                index: true,
                element: <PrivateRoute>
                    <VendorRoute>
                        <Profile />
                    </VendorRoute>
                </PrivateRoute>
            },
            {
                path: "profile",
                element: <PrivateRoute>
                    <VendorRoute>
                        <Profile />
                    </VendorRoute>
                </PrivateRoute>
            },
            {
                path: "add-ticket",
                element: <PrivateRoute>
                    <VendorRoute>
                        <AddTicket />
                    </VendorRoute>
                </PrivateRoute>
            },
            {
                path: "my-tickets",
                element: <PrivateRoute>
                    <VendorRoute>
                        <MyTickets />
                    </VendorRoute>
                </PrivateRoute>
            },
            {
                path: "requested-bookings",
                element: <PrivateRoute>
                    <VendorRoute>
                        <RequestedBookings />
                    </VendorRoute>
                </PrivateRoute>
            },
            {
                path: "revenue",
                element: <PrivateRoute>
                    <VendorRoute>
                        <RevenueOverview />
                    </VendorRoute>
                </PrivateRoute>
            }
        ]
    },
    {
        path: "*",
        element: <NotFound />
    },

])

export default router;