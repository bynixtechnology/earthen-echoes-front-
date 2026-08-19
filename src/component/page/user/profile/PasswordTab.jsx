import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Save,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
  ShieldAlert,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { changePassword } from "../../../../redux/thunks/userAuthThunk";
import { C } from "../../../../constants/theme";

// Top-level Reusable Password Field
const PasswordField = ({
  label,
  name,
  value,
  showPassword,
  onChange,
  onToggleShow,
  placeholder,
  error,
  required = true,
}) => (
  <div className="space-y-1">
    <label
      htmlFor={name}
      className="block text-xs sm:text-sm font-bold"
      style={{ color: C.dark }}
    >
      {label} {required && <span style={{ color: C.coral }}>*</span>}
    </label>
    <div className="relative">
      <Lock
        size={18}
        className="absolute left-4 top-3.5 pointer-events-none"
        style={{ color: C.coral }}
      />
      <input
        id={name}
        type={showPassword ? "text" : "password"}
        name={name}
        value={value}
        placeholder={placeholder}
        autoComplete="new-password"
        onChange={onChange}
        className="w-full rounded-2xl border pl-11 pr-11 py-3 text-xs sm:text-sm font-medium outline-none bg-[#FFFDF9] transition-all duration-200"
        style={{
          borderColor: error ? C.raspberry : `${C.dark}20`,
          color: C.dark,
          boxShadow: error ? `0 0 0 1px ${C.raspberry}` : "none",
        }}
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={onToggleShow}
        aria-label={showPassword ? "Hide password" : "Show password"}
        className="absolute right-4 top-3.5 hover:opacity-75 transition-opacity cursor-pointer focus:outline-none"
        style={{ color: `${C.dark}70` }}
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
    {error && (
      <p
        className="text-[11px] font-semibold flex items-center gap-1 mt-1"
        style={{ color: C.raspberry }}
      >
        <AlertCircle size={13} />
        {error}
      </p>
    )}
  </div>
);

const PasswordTab = ({ loading = false, user }) => {
  const dispatch = useDispatch();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [successMessage, setSuccess] = useState("");
  const [errorMessage, setError] = useState("");

  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setError("");
    if (successMessage) setSuccess("");
  };

  // Password Strength & Rules Validation
  const v = useMemo(
    () => ({
      minLength: form.newPassword.length >= 8,
      hasUppercase: /[A-Z]/.test(form.newPassword),
      hasNumber: /\d/.test(form.newPassword),
      hasSpecial: /[^A-Za-z0-9]/.test(form.newPassword),
    }),
    [form.newPassword]
  );

  const strength = Object.values(v).filter(Boolean).length;
  const labels = ["Very Weak", "Weak", "Medium", "Strong", "Very Strong"];
  const strengthColors = [C.raspberry, "#F59E0B", "#EAB308", C.teal, C.green];

  // Agar user Google account se logged in hai
  const isGoogleUser = user?.authProvider === "google" || (!user?.password && Boolean(user?.googleId));

  if (isGoogleUser) {
    return (
      <div
        className="p-6 sm:p-8 rounded-3xl"
        style={{ backgroundColor: C.cream, color: C.dark }}
      >
        <div className="flex flex-col items-center justify-center text-center py-8 px-4 max-w-md mx-auto space-y-4">
          <div
            className="p-4 rounded-2xl border"
            style={{
              backgroundColor: C.paleTeal,
              borderColor: `${C.teal}30`,
              color: C.darkTeal,
            }}
          >
            <ShieldAlert size={36} />
          </div>
          <h2 className="text-xl font-bold font-heading" style={{ color: C.dark }}>
            Google Authentication Active
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Aapka account Google ke through authenticated hai. Password change karne ki zaroorat nahi hai.
          </p>
        </div>
      </div>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.currentPassword.trim()) {
      setError("Please enter your current password.");
      return;
    }

    if (!form.newPassword.trim()) {
      setError("Please enter a new password.");
      return;
    }

    if (form.currentPassword === form.newPassword) {
      setError("New password cannot be the same as current password.");
      return;
    }

    if (strength < 4) {
      setError("Password does not meet all security requirements.");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setSubmitting(true);

      // Backend API expects { currentPassword, newPassword }
      const res = await dispatch(
        changePassword({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        })
      ).unwrap();

      setSuccess(res?.message || "Password updated successfully.");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      const displayErr =
        typeof err === "string"
          ? err
          : err?.message || err?.data?.message || "Current password is incorrect.";
      setError(displayErr);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setError(""), 5000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="p-6 sm:p-8 rounded-3xl"
      style={{ backgroundColor: C.cream, color: C.dark }}
    >
      {/* Header */}
      <div className="mb-6 pb-4 border-b" style={{ borderColor: `${C.dark}15` }}>
        <h2 className="text-2xl font-bold font-heading">Change Password</h2>
        <p className="text-xs sm:text-sm mt-1" style={{ color: `${C.dark}80` }}>
          Update your account password for enhanced security.
        </p>
      </div>

      {/* Global Alerts */}
      {errorMessage && (
        <div
          className="mb-5 p-3.5 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all"
          style={{
            backgroundColor: C.paleBlush,
            color: C.raspberry,
            border: `1px solid ${C.raspberry}30`,
          }}
        >
          <XCircle size={18} className="shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div
          className="mb-5 p-3.5 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all"
          style={{
            backgroundColor: C.paleGreen,
            color: C.green,
            border: `1px solid ${C.green}30`,
          }}
        >
          <CheckCircle2 size={18} className="shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Password Form */}
      <form onSubmit={submit} className="space-y-5 max-w-2xl">
        <PasswordField
          label="Current Password"
          name="currentPassword"
          value={form.currentPassword}
          showPassword={show.current}
          onChange={handleChange}
          onToggleShow={() =>
            setShow((s) => ({ ...s, current: !s.current }))
          }
          placeholder="Enter current password"
        />

        <PasswordField
          label="New Password"
          name="newPassword"
          value={form.newPassword}
          showPassword={show.new}
          onChange={handleChange}
          onToggleShow={() => setShow((s) => ({ ...s, new: !s.new }))}
          placeholder="Enter new password"
        />

        {/* Dynamic Password Strength Meter */}
        {form.newPassword.length > 0 && (
          <div className="space-y-1.5 pt-0.5">
            <div className="flex justify-between text-xs font-bold">
              <span style={{ color: `${C.dark}70` }}>Password Strength</span>
              <span
                style={{
                  color: strengthColors[Math.max(0, strength - 1)],
                }}
              >
                {labels[Math.max(0, strength - 1)]}
              </span>
            </div>
            <div className="h-2 w-full rounded-full overflow-hidden bg-black/5">
              <div
                className="h-full transition-all duration-300 rounded-full"
                style={{
                  width: `${(strength / 4) * 100}%`,
                  backgroundColor:
                    strengthColors[Math.max(0, strength - 1)],
                }}
              />
            </div>
          </div>
        )}

        <PasswordField
          label="Confirm Password"
          name="confirmPassword"
          value={form.confirmPassword}
          showPassword={show.confirm}
          onChange={handleChange}
          onToggleShow={() =>
            setShow((s) => ({ ...s, confirm: !s.confirm }))
          }
          placeholder="Confirm new password"
          error={
            form.confirmPassword &&
            form.newPassword !== form.confirmPassword
              ? "Passwords do not match"
              : ""
          }
        />

        {/* Security Checklist Requirements */}
        <div
          className="border p-4 rounded-2xl space-y-2.5 bg-[#FFFDF9]"
          style={{ borderColor: `${C.dark}15` }}
        >
          <div
            className="flex gap-2 items-center text-xs font-bold"
            style={{ color: C.dark }}
          >
            <ShieldCheck size={18} style={{ color: C.teal }} />
            <span>Security Requirements</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs font-medium">
            {[
              ["Minimum 8 characters", v.minLength],
              ["Uppercase letter (A-Z)", v.hasUppercase],
              ["At least one number (0-9)", v.hasNumber],
              ["Special character (!@#$...)", v.hasSpecial],
            ].map(([text, isMet]) => (
              <div key={text} className="flex items-center gap-2">
                {isMet ? (
                  <CheckCircle2
                    size={16}
                    style={{ color: C.green }}
                    className="shrink-0"
                  />
                ) : (
                  <XCircle
                    size={16}
                    style={{ color: `${C.dark}30` }}
                    className="shrink-0"
                  />
                )}
                <span
                  style={{
                    color: isMet ? C.dark : `${C.dark}60`,
                  }}
                >
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={loading || submitting}
          className="flex items-center justify-center gap-2 px-8 py-3 rounded-full font-bold text-xs sm:text-sm text-white shadow-xs transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 cursor-pointer"
          style={{ backgroundColor: C.coral }}
        >
          {submitting ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Save size={18} />
          )}
          <span>{submitting ? "Updating..." : "Update Password"}</span>
        </button>
      </form>
    </div>
  );
};

export default PasswordTab;