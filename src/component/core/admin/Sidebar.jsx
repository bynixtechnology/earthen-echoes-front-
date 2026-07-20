

import React from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, PlusCircle, FolderPlus, LogOut, X } from "lucide-react"; 
import { showToast } from "../../../config/toast";
import { FRONTEND_MESSAGES } from "../../../constants/messages";

const adminNavLinks = [
  { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Add Product", path: "/admin/add-product", icon: PlusCircle },
  { name: "Add Category", path: "/admin/add-category", icon: FolderPlus }, 
];

export default function Sidebar({ isOpen, toggleSidebar }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    try {
      localStorage.removeItem("adminToken");
      sessionStorage.clear();

      showToast.success(FRONTEND_MESSAGES.AUTH.LOGOUT);

      if (isOpen) toggleSidebar();
      navigate("/admin/login", { replace: true });
    } catch (error) {
      showToast.error("An error occurred during system termination.");
    }
  };

  
  const handleLinkClick = () => {
    if (window.innerWidth < 1024 && isOpen) {
      toggleSidebar();
    }
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside 
        className={`fixed inset-y-0 left-0 bg-slate-950 text-slate-200 border-r border-slate-800/60 flex flex-col justify-between transition-transform duration-300 ease-in-out z-50 w-64 lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800/60">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-bold text-sm">EE</div>
              <span className="font-bold text-sm text-white tracking-wide">Earthen Echoes</span>
            </div>
            
            <button onClick={toggleSidebar} className="p-1 lg:hidden text-slate-400 hover:text-white">
              <X size={20} />
            </button>
          </div>

          <nav className="p-4 space-y-1.5">
            {adminNavLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <NavLink
                  key={item.path} 
                  to={item.path} 
                  onClick={handleLinkClick} 
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive ? "bg-amber-500 text-slate-950 font-semibold shadow-lg" : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800/60">
          <button onClick={handleLogout} className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-colors">
            <LogOut size={18} />
            <span>Secure Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}