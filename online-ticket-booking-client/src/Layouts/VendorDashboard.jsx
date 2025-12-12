import { NavLink, Outlet } from "react-router";
import Logo from "../components/shared/Logo";

const VendorDashboard = () => {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[240px_1fr]">
      <aside className="bg-[#01602a] text-white border-r">
        <div className="p-4 border-b">
          <Logo />
        </div>
        <nav className="p-3 space-y-1">
          <NavLink
            to="profile"
            className={({ isActive }) =>
              `block px-3 py-2 rounded ${isActive ? "bg-white/20 font-semibold" : "hover:bg-white/10"}`
            }
          >
            Vendor Profile
          </NavLink>
          <NavLink
            to="add-ticket"
            className={({ isActive }) =>
              `block px-3 py-2 rounded ${isActive ? "bg-white/20 font-semibold" : "hover:bg-white/10"}`
            }
          >
            Add Ticket
          </NavLink>
          <NavLink
            to="my-tickets"
            className={({ isActive }) =>
              `block px-3 py-2 rounded ${isActive ? "bg-white/20 font-semibold" : "hover:bg-white/10"}`
            }
          >
            My Added Tickets
          </NavLink>
          <NavLink
            to="requested-bookings"
            className={({ isActive }) =>
              `block px-3 py-2 rounded ${isActive ? "bg-white/20 font-semibold" : "hover:bg-white/10"}`
            }
          >
            Requested Bookings
          </NavLink>
          <NavLink
            to="revenue"
            className={({ isActive }) =>
              `block px-3 py-2 rounded ${isActive ? "bg-white/20 font-semibold" : "hover:bg-white/10"}`
            }
          >
            Revenue Overview
          </NavLink>
        </nav>
      </aside>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default VendorDashboard;
