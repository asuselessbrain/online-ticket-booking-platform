import { use, useState } from "react";
import { AuthContext } from "../providers/AuthContext";
import { NavLink, Outlet } from "react-router";
import { FiUser, FiBookmark, FiCreditCard, FiMenu } from "react-icons/fi";
import Logo from "../components/shared/Logo";

const navItems = [
  { name: "User Profile", to: "/user/profile", icon: FiUser },
  { name: "My Booked Tickets", to: "/user/my-bookings", icon: FiBookmark },
  { name: "Transaction History", to: "/user/transactions", icon: FiCreditCard },
];

const UserDashboard = () => {
  const { user } = use(AuthContext);
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[240px_1fr] bg-gray-50">
      <aside className={`bg-[#01602a] text-white border-r ${open ? "block" : "hidden md:block"}`}>
        <div className="p-4 border-b border-white/20 flex items-center justify-between md:block">
          <Logo />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="md:hidden text-white/80"
          >
            ✕
          </button>
        </div>
        <div className="p-4 border-b border-white/15">
          <div className="h-12 w-12 rounded-full bg-white/15 flex items-center justify-center text-lg font-semibold uppercase">
            {user?.displayName?.charAt(0) || user?.email?.charAt(0) || "U"}
          </div>
          <p className="mt-3 text-sm text-white/80">{user?.displayName || "User"}</p>
          <p className="text-xs text-white/60 break-all">{user?.email}</p>
        </div>
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded ${
                    isActive ? "bg-white/20 font-semibold" : "hover:bg-white/10"
                  }`
                }
              >
                <Icon size={18} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      <main className="p-4 md:p-6 lg:p-8">
        <div className="md:hidden mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#01602a]">Dashboard</p>
            <h1 className="text-xl font-bold text-gray-900">Welcome back</h1>
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="p-2 rounded-lg border border-gray-200 bg-white shadow-sm"
          >
            <FiMenu size={20} />
          </button>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 md:p-7">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
