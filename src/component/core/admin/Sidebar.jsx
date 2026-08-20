import React from "react";
import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  LayoutDashboard,
  PlusCircle,
  FolderPlus,
  Users,
  ShoppingBag,
  LogOut,
  X,
} from "lucide-react";

import { showToast } from "../../../config/toast";
import { FRONTEND_MESSAGES } from "../../../constants/messages";

const adminNavLinks = [
  {
    name: "All Users",
    path: "/admin/users", // 👈 Added All Users Route
    icon: Users,
  },
  {
    name: "Add Category",
    path: "/admin/add-category",
    icon: FolderPlus,
  },
  {
    name: "Products",
    path: "/admin/product",
    icon: LayoutDashboard,
  },
  {
    name: "Add Product",
    path: "/admin/add-product",
    icon: PlusCircle,
  },
  {
    name: "Add Product Tags",
    path: "/admin/add-product-tags",
    icon: PlusCircle,
  },
  {
    name:"All Order",
    path:"/admin/order",
    icon:ShoppingBag,
  }
];

export default function Sidebar({
  isOpen,
  toggleSidebar,
}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      // Remove Admin Session
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");

      // Remove legacy admin keys if used
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

      showToast.error("Unable to logout.");
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
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 sm:w-72 flex-col justify-between border-r border-slate-800 bg-slate-950 text-slate-200 shadow-2xl transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        <div>
          {/* Header */}
          <div className="flex h-16 sm:h-20 items-center justify-between border-b border-slate-800 px-4 sm:px-6">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-amber-500 text-sm sm:text-base font-bold text-slate-950 shadow-lg shrink-0">
                EE
              </div>

              <div className="min-w-0">
                <h2 className="text-sm sm:text-base font-bold text-white truncate">
                  Earthen Echoes
                </h2>

                <p className="text-[11px] sm:text-xs text-slate-400 truncate">
                  Admin Panel
                </p>
              </div>
            </div>

            <button
              onClick={toggleSidebar}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-900 hover:text-white lg:hidden shrink-0"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="space-y-1.5 sm:space-y-2 p-3 sm:p-4">
            {adminNavLinks.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={handleLinkClick}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "border-l-4 border-white bg-amber-500 font-semibold text-slate-950 shadow-lg"
                        : "text-slate-400 hover:bg-slate-900 hover:text-white"
                    }`
                  }
                >
                  <Icon size={18} className="shrink-0" />
                  <span className="truncate">{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Logout */}
        <div className="border-t border-slate-800 p-3 sm:p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-rose-400 transition-all duration-200 hover:bg-rose-500/10 hover:text-rose-300"
          >
            <LogOut size={18} className="shrink-0" />
            <span className="truncate">Secure Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}