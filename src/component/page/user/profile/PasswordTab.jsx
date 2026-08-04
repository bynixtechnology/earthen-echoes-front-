import React, { useMemo, useState } from "react";
import { Lock, Eye, EyeOff, ShieldCheck, Save, CheckCircle2, XCircle } from "lucide-react";
import { useDispatch } from "react-redux";
import { changePassword } from "../../../../redux/thunks/userAuthThunk";

const PasswordTab = ({
  loading = false,
  user,
}) => {

  const dispatch = useDispatch();
  const [submitting, setSubmitting] =
    useState(false);
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [show, setShow] = useState({ c: false, n: false, f: false });
  const [successMessage, setSuccess] = useState("");
  const [errorMessage, setError] = useState("");

  const handleChange = e => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    setError(""); setSuccess("");
  };
  const v = useMemo(() => ({
    minLength: form.newPassword.length >= 8,
    hasUppercase: /[A-Z]/.test(form.newPassword),
    hasNumber: /\d/.test(form.newPassword),
    hasSpecial: /[^A-Za-z0-9]/.test(form.newPassword),
  }), [form.newPassword]);


  const strength =
    Object.values(v)
      .filter(Boolean)
      .length;


  const labels = ["Very Weak", "Weak", "Medium", "Strong", "Very Strong"];


  const colors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"];

  const submit = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !form.currentPassword ||
      !form.newPassword ||
      !form.confirmPassword
    ) {

      setError(
        "Please fill all fields."
      );

      return;

    }

    if (
      form.newPassword !==
      form.confirmPassword
    ) {

      setError(
        "Passwords do not match."
      );

      return;

    }

    if (strength < 4) {

      setError(
        "Password does not meet security requirements."
      );

      return;

    }

    try {

      setSubmitting(true);

      await dispatch(
        changePassword({

          currentPassword:
            form.currentPassword,

          newPassword:
            form.newPassword,

          confirmPassword:
            form.confirmPassword,

        })
      ).unwrap();

      setSuccess(
        "Password updated successfully."
      );
      setTimeout(() => {

  setSuccess("");

}, 3000);

      setForm({

        currentPassword: "",

        newPassword: "",

        confirmPassword: "",

      });

    } catch (err) {

      setError(

        typeof err === "string"

          ? err

          : "Unable to update password."

      );
      setTimeout(() => {

  setError("");

}, 3000);

    } finally {

      setSubmitting(false);

    }

  };

  const Field = ({
    label,
    name,
    showKey,
    placeholder,
  }) => (
    <div>

      <label className="block mb-2 text-sm">

        {label}

      </label>

      <div className="relative">

        <Lock
          size={18}
          className="absolute left-3 top-3.5"
        />

        <input

          type={
            show[showKey]
              ? "text"
              : "password"
          }

          name={name}

          value={form[name]}

          placeholder={placeholder}

          autoComplete="off"

          onChange={handleChange}

          className="w-full border rounded pl-10 pr-10 py-3"

        />

        <button

          type="button"

          onClick={() =>
            setShow((s) => ({
              ...s,
              [showKey]:
                !s[showKey],
            }))
          }

          className="absolute right-3 top-3.5"

        >

          {show[showKey]

            ? <EyeOff size={18} />

            : <Eye size={18} />}

        </button>

      </div>

    </div>
  );

  return <div>
    <h2 className="text-2xl font-bold mb-6">Change Password</h2>
    {errorMessage && <div className="mb-4 text-red-600">{errorMessage}</div>}
    {successMessage && <div className="mb-4 text-green-600">{successMessage}</div>}
    <form onSubmit={submit} className="space-y-5">
      <Field
        label="Current Password"
        name="currentPassword"
        showKey="c"
        placeholder="Enter current password"
      />
      <Field
        label="New Password"
        name="newPassword"
        showKey="n"
        placeholder="Enter new password"
      />
      <Field
        label="Confirm Password"
        name="confirmPassword"
        showKey="f"
        placeholder="Confirm password"
      />
      {form.newPassword && <div><div className="flex justify-between text-sm"><span>Strength</span><span>{labels[strength]}</span></div><div className="h-2 bg-gray-200 rounded"><div className={colors[strength] + " h-2"} style={{ width: `${(strength + 1) * 20}%` }}></div></div></div>}
      <div className="border p-4 rounded"><div className="flex gap-2 items-center mb-2"><ShieldCheck size={18} /><b>Requirements</b></div>
        {[["Minimum 8 characters", v.minLength], ["Uppercase letter", v.hasUppercase], ["Number", v.hasNumber], ["Special character", v.hasSpecial]].map(([t, ok]) => <div key={t} className="flex gap-2">{ok ? <CheckCircle2 size={16} /> : <XCircle size={16} />}<span>{t}</span></div>)}
      </div>
      <button disabled={loading || submitting} className="flex items-center gap-2 px-6 py-3 rounded bg-[var(--primary)] text-[var(--primary-foreground)]"><Save size={18} />{submitting

        ? "Updating..."

        : "Update Password"

      }</button>
    </form></div>;
};
export default PasswordTab;
