import React from "react";
import {
  User,
  MapPin,
  Lock,
  LogOut,
  ShoppingBag,
} from "lucide-react";
import { Link } from "react-router-dom";
import { C } from "../../../../constants/theme"; // Import theme object

const ProfileSidebar = ({ activeTab, setActiveTab }) => {
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
    <div className="flex flex-col justify-between h-full">
      {/* Menu List */}
      <div className="space-y-1.5 p-1">
        {menus.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all text-xs sm:text-sm font-bold ${
                isActive ? "shadow-xs" : "hover:bg-white/50"
              }`}
              style={{
                backgroundColor: isActive ? C.paleCoral : "transparent",
                color: isActive ? C.coral : C.dark,
              }}
            >
              <Icon
                size={18}
                style={{
                  color: isActive ? C.coral : `${C.dark}70`,
                }}
              />
              <span>{item.title}</span>
            </button>
          );
        })}

        {/* Quick Link to My Orders */}
        <Link
          to="/user/orders"
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all text-xs sm:text-sm font-bold hover:bg-white/50"
          style={{ color: C.dark }}
        >
          <ShoppingBag size={18} style={{ color: `${C.dark}70` }} />
          <span>My Orders</span>
        </Link>
      </div>

      {/* Logout Action */}
      <div
        className="pt-3 mt-4 border-t"
        style={{ borderColor: `${C.dark}15` }}
      >
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 rounded-2xl py-3 text-xs sm:text-sm font-bold transition-all hover:opacity-90 active:scale-[0.98]"
          style={{
            backgroundColor: `${C.raspberry}15`,
            color: C.raspberry,
          }}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileSidebar;