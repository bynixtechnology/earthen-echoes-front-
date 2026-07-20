import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../../../services/productService"; 
import { showToast } from "../../../config/toast";
import LoginForm from "../../../component/core/admin/LoginForm";

export default function AdminLogin() {
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const data = await AuthService.login({ email, password });
      
      if (data?.token) {
        localStorage.setItem("adminToken", data.token);
        showToast.success("Authorization granted. Welcome back.");
        navigate("/admin/dashboard");
      }
    } catch (err) {
      
      setError(err.message);
      showToast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <LoginForm 
        email={email}
        setemail={setemail}
        password={password}
        setPassword={setPassword}
        handleSubmit={handleLogin}
        error={error}
        loading={loading}
      />
    </div>
  );
}