import React from "react";
import {
  NavLink,
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  LayoutDashboard,
  PlusCircle,
  FolderPlus,
  LogOut,
  X,
} from "lucide-react";

import { showToast } from "../../../config/toast";
import { FRONTEND_MESSAGES } from "../../../constants/messages";

const adminNavLinks = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Add Product",
    path: "/admin/add-product",
    icon: PlusCircle,
  },
  {
    name: "Add Category",
    path: "/admin/add-category",
    icon: FolderPlus,
  },
];

export default function Sidebar({
  isOpen,
  toggleSidebar,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    try {
      // Remove admin session
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");

      // Optional: remove old admin keys if any
      localStorage.removeItem("token");
      localStorage.removeItem("admin");

      sessionStorage.clear();

      showToast.success(
        FRONTEND_MESSAGES.AUTH.LOGOUT
      );

      if (
        window.innerWidth < 1024 &&
        isOpen
      ) {
        toggleSidebar();
      }

      navigate("/admin/login", {
        replace: true,
      });
    } catch (error) {
      console.error(error);

      showToast.error(
        "Unable to logout."
      );
    }
  };

  const handleLinkClick = () => {
    if (
      window.innerWidth < 1024 &&
      isOpen
    ) {
      toggleSidebar();
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col justify-between border-r border-slate-800/60 bg-slate-950 text-slate-200 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        <div>
          <div className="flex h-20 items-center justify-between border-b border-slate-800/60 px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-sm font-bold text-slate-950">
                EE
              </div>

              <span className="text-sm font-bold tracking-wide text-white">
                Earthen Echoes
              </span>
            </div>

            <button
              onClick={toggleSidebar}
              className="p-1 text-slate-400 hover:text-white lg:hidden"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="space-y-2 p-4">
            {adminNavLinks.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={handleLinkClick}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-amber-500 font-semibold text-slate-950 shadow-lg"
                        : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"
                    }`
                  }
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-slate-800/60 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-rose-400 transition-colors hover:bg-rose-500/10"
          >
            <LogOut size={18} />
            <span>Secure Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}