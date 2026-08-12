import React, { useMemo, useState } from "react";
import { Lock, Eye, EyeOff, ShieldCheck, Save, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { changePassword } from "../../../../redux/thunks/userAuthThunk";
import { C } from "../../../../constants/theme";

// Top-level Field component to prevent re-render focus loss
const PasswordField = ({ label, name, value, showPassword, onChange, onToggleShow, placeholder }) => (
  <div>
    <label className="block mb-1.5 text-xs sm:text-sm font-bold" style={{ color: C.dark }}>
      {label}
    </label>
    <div className="relative">
      <Lock size={18} className="absolute left-4 top-3.5" style={{ color: C.coral }} />
      <input
        type={showPassword ? "text" : "password"}
        name={name}
        value={value}
        placeholder={placeholder}
        autoComplete="off"
        onChange={onChange}
        className="w-full rounded-2xl border pl-11 pr-11 py-3 text-xs sm:text-sm font-medium outline-none bg-[#FFFDF9] focus:border-[#F16937] focus:ring-2 focus:ring-[#F16937]/15 transition-all"
        style={{ borderColor: `${C.dark}20`, color: C.dark }}
      />
      <button
        type="button"
        onClick={onToggleShow}
        className="absolute right-4 top-3.5 hover:opacity-75 transition-opacity cursor-pointer"
        style={{ color: `${C.dark}70` }}
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  </div>
);

const PasswordTab = ({ loading = false, user }) => {
  const dispatch = useDispatch();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [show, setShow] = useState({ c: false, n: false, f: false });
  const [successMessage, setSuccess] = useState("");
  const [errorMessage, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccess("");
  };

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

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      setError("Please fill all fields.");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (strength < 4) {
      setError("Password does not meet all security requirements.");
      return;
    }

    try {
      setSubmitting(true);
      await dispatch(
        changePassword({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
          confirmPassword: form.confirmPassword,
        })
      ).unwrap();

      setSuccess("Password updated successfully.");
      setTimeout(() => setSuccess(""), 3000);

      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setError(typeof err === "string" ? err : "Unable to update password.");
      setTimeout(() => setError(""), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl" style={{ backgroundColor: C.cream, color: C.dark }}>
      <div className="mb-6 pb-4 border-b" style={{ borderColor: `${C.dark}15` }}>
        <h2 className="text-2xl font-bold font-heading">Change Password</h2>
        <p className="text-xs sm:text-sm mt-1" style={{ color: `${C.dark}80` }}>
          Update your account password for enhanced security.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-5 p-3.5 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2" style={{ backgroundColor: `${C.raspberry}15`, color: C.raspberry }}>
          <XCircle size={18} className="shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="mb-5 p-3.5 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2" style={{ backgroundColor: C.paleGreen, color: C.green }}>
          <CheckCircle2 size={18} className="shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={submit} className="space-y-5 max-w-2xl">
        <PasswordField
          label="Current Password"
          name="currentPassword"
          value={form.currentPassword}
          showPassword={show.c}
          onChange={handleChange}
          onToggleShow={() => setShow((s) => ({ ...s, c: !s.c }))}
          placeholder="Enter current password"
        />

        <PasswordField
          label="New Password"
          name="newPassword"
          value={form.newPassword}
          showPassword={show.n}
          onChange={handleChange}
          onToggleShow={() => setShow((s) => ({ ...s, n: !s.n }))}
          placeholder="Enter new password"
        />

        <PasswordField
          label="Confirm Password"
          name="confirmPassword"
          value={form.confirmPassword}
          showPassword={show.f}
          onChange={handleChange}
          onToggleShow={() => setShow((s) => ({ ...s, f: !s.f }))}
          placeholder="Confirm new password"
        />

        {/* Password Strength Indicator */}
        {form.newPassword && (
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-xs font-bold">
              <span style={{ color: `${C.dark}70` }}>Password Strength</span>
              <span style={{ color: strengthColors[Math.max(0, strength - 1)] }}>
                {labels[Math.max(0, strength - 1)]}
              </span>
            </div>
            <div className="h-2 w-full rounded-full overflow-hidden bg-black/5">
              <div
                className="h-full transition-all duration-300 rounded-full"
                style={{
                  width: `${(strength / 4) * 100}%`,
                  backgroundColor: strengthColors[Math.max(0, strength - 1)],
                }}
              />
            </div>
          </div>
        )}

        {/* Password Requirements Card */}
        <div className="border p-4 rounded-2xl space-y-2.5 bg-[#FFFDF9]" style={{ borderColor: `${C.dark}15` }}>
          <div className="flex gap-2 items-center text-xs font-bold" style={{ color: C.dark }}>
            <ShieldCheck size={18} style={{ color: C.teal }} />
            <span>Security Requirements</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs font-medium">
            {[
              ["Minimum 8 characters", v.minLength],
              ["Uppercase letter (A-Z)", v.hasUppercase],
              ["At least one number (0-9)", v.hasNumber],
              ["Special character (!@#$)", v.hasSpecial],
            ].map(([text, isMet]) => (
              <div key={text} className="flex items-center gap-2">
                {isMet ? (
                  <CheckCircle2 size={16} style={{ color: C.green }} className="shrink-0" />
                ) : (
                  <XCircle size={16} style={{ color: `${C.dark}30` }} className="shrink-0" />
                )}
                <span style={{ color: isMet ? C.dark : `${C.dark}60` }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || submitting}
          className="flex items-center justify-center gap-2 px-8 py-3 rounded-full font-bold text-xs sm:text-sm text-white shadow-xs transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 cursor-pointer"
          style={{ backgroundColor: C.coral }}
        >
          {submitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          <span>{submitting ? "Updating..." : "Update Password"}</span>
        </button>
      </form>
    </div>
  );
};

export default PasswordTab;