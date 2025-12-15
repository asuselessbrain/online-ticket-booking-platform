import { NavLink, Outlet } from "react-router";
import Logo from "../components/shared/Logo";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[240px_1fr]">
      <aside className="bg-[#01602a] text-white border-r">
        <div className="p-4 border-b border-white/20">
          <Logo />
        </div>
        <nav className="p-3 space-y-1">
          <NavLink
            to="profile"
            className={({ isActive }) =>
              `block px-3 py-2 rounded ${isActive ? "bg-white/20 font-semibold" : "hover:bg-white/10"}`
            }
          >
            Admin Profile
          </NavLink>
          <NavLink
            to="manage-tickets"
            className={({ isActive }) =>
              `block px-3 py-2 rounded ${isActive ? "bg-white/20 font-semibold" : "hover:bg-white/10"}`
            }
          >
            Manage Tickets
          </NavLink>
          <NavLink
            to="manage-users"
            className={({ isActive }) =>
              `block px-3 py-2 rounded ${isActive ? "bg-white/20 font-semibold" : "hover:bg-white/10"}`
            }
          >
            Manage Users
          </NavLink>
          <NavLink
            to="advertise-tickets"
            className={({ isActive }) =>
              `block px-3 py-2 rounded ${isActive ? "bg-white/20 font-semibold" : "hover:bg-white/10"}`
            }
          >
            Advertise Tickets
          </NavLink>
        </nav>
      </aside>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;
