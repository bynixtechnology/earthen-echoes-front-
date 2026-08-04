import React, { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Venus,
  Save,
  RotateCcw,
} from "lucide-react";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  gender: "",
  dob: "",
  bio: "",
};

const ProfileInfo = ({
  user,
  loading = false,
  onUpdate,
}) => {

  console.log("user", user)
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
    <div className="text-[var(--card-foreground)]">
      <div className="mb-8 border-b border-[var(--border)] pb-5">
        <h2 className="text-2xl font-bold">Personal Information</h2>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          Update your personal details.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {[
            ["name", "Full Name", User],
            ["email", "Email Address", Mail],
            ["phone", "Mobile Number", Phone],
          ].map(([key, label, Icon]) => (
            <div key={key}>
              <label className="block mb-2 text-sm font-medium">{label}</label>
              <div className="relative">
                <Icon size={18} className="absolute left-4 top-3.5 text-[var(--muted-foreground)]" />
                <input
                  type={key === "email" ? "email" : "text"}
                  name={key}
                  value={formData[key]}
                  odisabled
                  className="w-full border rounded pl-12 pr-4 py-3"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 text-sm font-medium">Gender</label>
            <div className="relative">
              <Venus size={18} className="absolute left-4 top-3.5" />
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full border rounded pl-12 pr-4 py-3"
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Date of Birth</label>
            <div className="relative">
              <Calendar size={18} className="absolute left-4 top-3.5" />
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full border rounded pl-12 pr-4 py-3"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">Bio</label>
          <textarea
            rows={4}
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="w-full border rounded p-4"
          />
        </div>

        <div className="flex gap-4">
          <button
            disabled={loading}
            type="submit"
            className="flex items-center gap-2 px-6 py-3 rounded bg-[var(--primary)] text-[var(--primary-foreground)]"
          >
            <Save size={18} />
            {loading ? "Saving..." : "Save Changes"}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-3 rounded border"
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
