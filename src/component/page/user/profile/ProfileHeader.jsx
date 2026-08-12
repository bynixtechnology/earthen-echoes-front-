import React, { useRef, useState } from "react";
import { Mail, Phone, MapPin, Camera, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { C } from "../../../../constants/theme"; 

const ProfileHeader = ({ user, loading, onUpdate, onEditClick }) => {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const image =
    user?.avatar ||
    user?.profileImage ||
    user?.picture ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user?.name || "User"
    )}&background=F16937&color=FFFDF9`;

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !onUpdate) return;
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("avatar", file);
      await onUpdate(formData);
    } catch (err) {
      console.error("Avatar upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      className="overflow-hidden rounded-3xl border shadow-xs transition-all"
      style={{
        backgroundColor: C.cream,
        borderColor: `${C.dark}15`,
      }}
    >
      {/* Option 2: Mesh Pastel Blend Banner */}
      <div
        className="h-36 sm:h-44 relative overflow-hidden"
        style={{
          backgroundColor: C.cream,
          backgroundImage: `
            radial-gradient(at 0% 0%, ${C.paleCoral} 0px, transparent 50%),
            radial-gradient(at 100% 0%, ${C.paleBlush} 0px, transparent 50%),
            radial-gradient(at 50% 100%, ${C.paleGreen} 0px, transparent 50%)
          `,
        }}
      >
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(${C.dark}15 1px, transparent 1px), linear-gradient(90deg, ${C.dark}15 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div className="px-5 sm:px-8 pb-7">
        <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-6 -mt-14 sm:-mt-16">
          {/* User Info & Avatar Section */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-5">
            {/* Avatar Container */}
            <div className="relative mx-auto sm:mx-0 shrink-0">
              <img
                src={image}
                alt={user?.name || "User"}
                className="h-28 w-28 sm:h-36 sm:w-36 rounded-full border-4 object-cover shadow-md transition-transform hover:scale-[1.02]"
                style={{
                  borderColor: C.cream,
                  backgroundColor: C.cream,
                }}
                onError={(e) => {
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user?.name || "User"
                  )}&background=F16937&color=FFFDF9`;
                }}
              />

              {/* Upload Button */}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                aria-label="Upload Profile Picture"
                className="absolute bottom-1 right-1 h-9 w-9 sm:h-10 sm:w-10 rounded-full text-white flex items-center justify-center shadow-md transition-transform hover:scale-110 active:scale-95 disabled:opacity-75"
                style={{ backgroundColor: C.coral }}
              >
                {uploading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Camera size={16} />
                )}
              </button>

              <input
                ref={fileRef}
                hidden
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>

            {/* Name and Contact Metadata */}
            <div className="text-center sm:text-left sm:pb-1">
              <h1
                className="text-2xl sm:text-3xl font-bold tracking-tight font-heading"
                style={{ color: C.dark }}
              >
                {user?.name || "User"}
              </h1>

              <div className="mt-2.5 grid gap-2 text-xs sm:text-sm font-medium">
                <div
                  className="flex items-center justify-center sm:justify-start gap-2.5"
                  style={{ color: C.dark }}
                >
                  <Mail size={15} style={{ color: C.coral }} />
                  <span>{user?.email || "Not Available"}</span>
                </div>

                <div
                  className="flex items-center justify-center sm:justify-start gap-2.5"
                  style={{ color: C.dark }}
                >
                  <Phone size={15} style={{ color: C.teal }} />
                  <span>{user?.phone || "Not Added"}</span>
                </div>

                <div
                  className="flex items-center justify-center sm:justify-start gap-2.5"
                  style={{ color: C.dark }}
                >
                  <MapPin size={15} style={{ color: C.raspberry }} />
                  <span>
                    {user?.city ||
                      user?.addresses?.[0]?.city ||
                      user?.addresses?.[0]?.street ||
                      "Not Added"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 justify-center xl:justify-end sm:pb-1">
            <button
              type="button"
              onClick={onEditClick}
              className="px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.98]"
              style={{ backgroundColor: C.coral }}
            >
              Edit Profile
            </button>

            <Link
              to="/user/orders"
              className="px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm border transition-all hover:bg-white/60 active:scale-[0.98] inline-flex items-center justify-center"
              style={{
                borderColor: C.coral,
                color: C.coral,
                backgroundColor: C.paleCoral,
              }}
            >
              View Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;