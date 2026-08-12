import React, { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Venus,
  Save,
  RotateCcw,
  Loader2,
} from "lucide-react";
import { C } from "../../../../constants/theme"; // Adjust relative import path as needed

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  gender: "",
  dob: "",
  bio: "",
};

const ProfileInfo = ({ user, loading = false, onUpdate }) => {
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    if (!user) return;

    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      gender: user.gender || "Male",
      dob: user.dob
        ? new Date(user.dob).toISOString().split("T")[0]
        : "",
      bio: user.bio || "",
    });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!onUpdate) return;

    await onUpdate({
      name: formData.name,
      phone: formData.phone,
      gender: formData.gender,
      dob: formData.dob,
      bio: formData.bio,
    });
  };

  const handleReset = () => {
    if (!user) {
      setFormData(emptyForm);
      return;
    }

    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      gender: user.gender || "Male",
      dob: user.dob
        ? new Date(user.dob).toISOString().split("T")[0]
        : "",
      bio: user.bio || "",
    });
  };

  return (
    <div
      className="p-6 sm:p-8 rounded-3xl border shadow-xs transition-all"
      style={{
        backgroundColor: C.cream,
        borderColor: `${C.dark}15`,
      }}
    >
      {/* Header Section */}
      <div
        className="mb-8 border-b pb-5"
        style={{ borderColor: `${C.dark}15` }}
      >
        <h2
          className="text-2xl font-bold font-heading tracking-tight"
          style={{ color: C.dark }}
        >
          Personal Information
        </h2>
        <p className="text-xs sm:text-sm mt-1" style={{ color: `${C.dark}80` }}>
          Update your personal details and contact information.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name, Email, Phone Inputs */}
        <div className="grid md:grid-cols-2 gap-6">
          {[
            ["name", "Full Name", User, false],
            ["email", "Email Address", Mail, true], // Email disabled for editing
            ["phone", "Mobile Number", Phone, false],
          ].map(([key, label, Icon, isDisabled]) => (
            <div key={key}>
              <label
                className="block mb-2 text-xs sm:text-sm font-bold"
                style={{ color: C.dark }}
              >
                {label}
              </label>
              <div className="relative">
                <Icon
                  size={18}
                  className="absolute left-4 top-3.5 transition-colors"
                  style={{ color: isDisabled ? `${C.dark}50` : C.coral }}
                />
                <input
                  type={key === "email" ? "email" : "text"}
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  disabled={isDisabled}
                  placeholder={`Enter your ${label.toLowerCase()}`}
                  className={`w-full rounded-2xl border pl-12 pr-4 py-3 text-xs sm:text-sm font-medium outline-none transition-all ${
                    isDisabled
                      ? "cursor-not-allowed opacity-70 bg-black/5"
                      : "bg-[#FFFDF9] focus:border-[#F16937] focus:ring-2 focus:ring-[#F16937]/15"
                  }`}
                  style={{
                    borderColor: `${C.dark}20`,
                    color: C.dark,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Gender & DOB Inputs */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label
              className="block mb-2 text-xs sm:text-sm font-bold"
              style={{ color: C.dark }}
            >
              Gender
            </label>
            <div className="relative">
              <Venus
                size={18}
                className="absolute left-4 top-3.5 pointer-events-none"
                style={{ color: C.teal }}
              />
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full rounded-2xl border pl-12 pr-4 py-3 text-xs sm:text-sm font-medium outline-none bg-[#FFFDF9] focus:border-[#F16937] focus:ring-2 focus:ring-[#F16937]/15 appearance-none cursor-pointer"
                style={{
                  borderColor: `${C.dark}20`,
                  color: C.dark,
                }}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label
              className="block mb-2 text-xs sm:text-sm font-bold"
              style={{ color: C.dark }}
            >
              Date of Birth
            </label>
            <div className="relative">
              <Calendar
                size={18}
                className="absolute left-4 top-3.5 pointer-events-none"
                style={{ color: C.raspberry }}
              />
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full rounded-2xl border pl-12 pr-4 py-3 text-xs sm:text-sm font-medium outline-none bg-[#FFFDF9] focus:border-[#F16937] focus:ring-2 focus:ring-[#F16937]/15 cursor-pointer"
                style={{
                  borderColor: `${C.dark}20`,
                  color: C.dark,
                }}
              />
            </div>
          </div>
        </div>

        {/* Bio Textarea */}
        <div>
          <label
            className="block mb-2 text-xs sm:text-sm font-bold"
            style={{ color: C.dark }}
          >
            Bio
          </label>
          <textarea
            rows={4}
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell us a little bit about yourself..."
            className="w-full rounded-2xl border p-4 text-xs sm:text-sm font-medium outline-none bg-[#FFFDF9] focus:border-[#F16937] focus:ring-2 focus:ring-[#F16937]/15"
            style={{
              borderColor: `${C.dark}20`,
              color: C.dark,
            }}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            disabled={loading}
            type="submit"
            className="flex items-center gap-2 px-7 py-3 rounded-full font-bold text-xs sm:text-sm text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
            style={{ backgroundColor: C.coral }}
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            {loading ? "Saving..." : "Save Changes"}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-xs sm:text-sm border transition-all hover:bg-white/60 active:scale-[0.98]"
            style={{
              borderColor: `${C.dark}30`,
              color: C.dark,
              backgroundColor: C.ivory,
            }}
          >
            <RotateCcw size={18} />
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileInfo;