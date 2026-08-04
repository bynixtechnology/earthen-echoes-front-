import React from "react";
import {
  User,
  Camera,
  MapPin,
  Lock,
  Settings,
  LogOut,
} from "lucide-react";

const ProfileSidebar = ({
  activeTab,
  setActiveTab,
}) => {
  const menus = [
    {
      id: "profile",
      title: "Profile Information",
      icon: User,
    },
   
    {
      id: "address",
      title: "Address Book",
      icon: MapPin,
    },
    {
      id: "password",
      title: "Change Password",
      icon: Lock,
    },
   
  ];

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");

    window.location.href = "/user/login";
  };

  return (
    <div className="bg-[var(--card)] text-[var(--card-foreground)] ">

      {/* Profile Card / Header Banner */}
      <div className="bg-[image:var(--brand-gradient,linear-gradient(135deg,var(--primary),var(--accent))] text-[var(--primary-foreground)] p-6">
        <div className="flex flex-col items-center">
          <img
            src="https://ui-avatars.com/api/?name=User&background=ffffff&color=a0522d&size=128"
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-[var(--card)] object-cover shadow-sm"
          />

          <h3 className="mt-4 text-lg font-semibold text-[var(--primary-foreground)]">
            User Name
          </h3>

          <p className="text-sm opacity-90 text-[var(--primary-foreground)]">
            user@email.com
          </p>
        </div>
      </div>

      {/* Menu List */}
      <div className="py-2">
        {menus.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-5 py-4 transition-all duration-200 text-sm font-medium
                ${
                  isActive
                    ? "bg-[var(--secondary)] text-[var(--primary)] border-r-4 border-[var(--primary)] font-semibold"
                    : "text-[var(--foreground)] hover:bg-[var(--secondary)]/50"
                }`}
            >
              <Icon 
                size={20} 
                className={isActive ? "text-[var(--primary)]" : "text-[var(--muted-foreground)]"} 
              />
              <span>{item.title}</span>
            </button>
          );
        })}
      </div>

      {/* Logout Action */}
      <div className="border-t border-[var(--border)] p-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 rounded-[var(--radius)] bg-[var(--destructive)]/10 text-[var(--destructive)] py-3 font-medium hover:bg-[var(--destructive)]/20 transition"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>

    </div>
  );
};

export default ProfileSidebar;