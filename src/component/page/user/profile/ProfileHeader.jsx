import React, { useRef, useState } from "react";
import { Mail, Phone, MapPin, Camera } from "lucide-react";

const ProfileHeader = ({ user, loading, onUpdate }) => {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const image =
    user?.avatar ||
    user?.profileImage ||
    user?.picture ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}`;

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !onUpdate) return;
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("avatar", file);
      await onUpdate(formData);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-lg">
      <div className="h-40 sm:h-48 bg-gradient-to-r from-amber-700 via-orange-500 to-orange-300"/>
      <div className="px-5 sm:px-8 pb-8">
        <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-6 -mt-16">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="relative mx-auto sm:mx-0">
              <img
                src={image}
                alt={user?.name || "User"}
                className="h-32 w-32 sm:h-40 sm:w-40 rounded-full border-4 border-white bg-white object-cover shadow-xl"
                onError={(e)=>{e.currentTarget.src=`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name||"User")}`}}
              />
              <button
                type="button"
                onClick={()=>fileRef.current?.click()}
                disabled={uploading}
                className="absolute bottom-2 right-2 h-11 w-11 rounded-full bg-[var(--primary)] text-white flex items-center justify-center shadow-lg"
              >
                {uploading ? "..." : <Camera size={18}/>}
              </button>
              <input ref={fileRef} hidden type="file" accept="image/*" onChange={handleImageUpload}/>
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-bold">{user?.name || "User"}</h1>
              <div className="mt-5 grid gap-3">
                <div className="flex items-center gap-2"><Mail size={16}/><span>{user?.email || "Not Available"}</span></div>
                <div className="flex items-center gap-2"><Phone size={16}/><span>{user?.phone || "Not Added"}</span></div>
                <div className="flex items-center gap-2"><MapPin size={16}/><span>{user?.city || user?.addresses?.[0]?.city || user?.addresses?.[0]?.street || "Not Added"}</span></div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 justify-center xl:justify-end">
            <button className="px-6 py-3 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold">Edit Profile</button>
            <button className="px-6 py-3 rounded-xl border border-[var(--border)] font-semibold">View Orders</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
