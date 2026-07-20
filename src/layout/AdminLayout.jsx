



import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import Sidebar from "../component/core/admin/Sidebar";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full overflow-x-hidden bg-slate-50 font-sans">
      
   
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

  
      <div className="flex min-h-screen flex-1 flex-col overflow-hidden">
        
                <header className="flex h-16 sm:h-18 lg:h-20 w-full shrink-0 items-center justify-between border-b border-slate-200/80 bg-white px-4 sm:px-6 lg:px-8 shadow-sm">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            {/* Mobile Hamburger Trigger (Hidden on Desktop) */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-xl bg-slate-100 p-2 text-slate-700 transition hover:bg-slate-200 lg:hidden flex-shrink-0"
            >
              <Menu size={20} />
            </button>

            <div className="min-w-0">
              <h2 className="hidden truncate text-[10px] font-bold uppercase tracking-widest text-slate-400 sm:block">
                Security Clearance Level-1
              </h2>

              <p className="truncate text-sm font-semibold text-slate-700 sm:text-base">
                Operational Dashboard
              </p>
            </div>
          </div>

          <div className="ml-3 flex flex-shrink-0 items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />

            <span className="rounded-lg border bg-slate-100 px-2 py-1 text-[9px] font-mono font-bold text-slate-500 sm:px-3 sm:py-1.5 sm:text-xs whitespace-nowrap">
              SYS_LIVE_5000
            </span>
          </div>
        </header>

        {/* Dynamic Outlet Section Workspace */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-50 p-3 sm:p-5 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}