import { useState } from "react";
import { Lock, User, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";

export default function LoginForm({ email, setemail, password, setPassword, handleSubmit, error, loading }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-slate-200/80 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
      
      {/* Premium Branding Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-950 text-amber-500 mb-4 shadow-inner ring-4 ring-slate-100">
          <ShieldCheck size={28} />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight font-heading">
          Earthen Echoes
        </h2>
        <p className="text-xs uppercase tracking-[0.15em] text-slate-400 mt-1.5 font-medium">
          Admin Control Center
        </p>
      </div>

     
      {error && (
        <div className="bg-red-50 text-red-700 p-3.5 rounded-xl text-sm mb-5 font-medium text-center border border-red-100 animate-shake flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          {error}
        </div>
      )}

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Username Field */}
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5 pl-1">
   email
          </label>
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 transition-colors group-focus-within:text-slate-800">
              <User size={18} />
            </span>
            <input 
              type="text" 
              required
              value={email}
              onChange={(e) => setemail(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-950/20 focus:border-slate-950 focus:bg-white transition-all duration-200 text-sm text-slate-800 placeholder-slate-400" 
              placeholder="Enter admin email"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5 pl-1">
            Password
          </label>
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 transition-colors group-focus-within:text-slate-800">
              <Lock size={18} />
            </span>
            <input 
              type={showPassword ? "text" : "password"} 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-11 pr-11 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-950/20 focus:border-slate-950 focus:bg-white transition-all duration-200 text-sm text-slate-800 placeholder-slate-400 font-mono" 
              placeholder="••••••••"
            />
            {/* Password Eye Toggle Icon */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-700 transition"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Action Button */}
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-slate-950 text-white py-3.5 rounded-xl font-bold hover:bg-slate-900 active:scale-[0.99] transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-75 disabled:pointer-events-none flex items-center justify-center gap-2 mt-2"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Verifying Security Token...
            </>
          ) : (
            "Secure Sign In"
          )}
        </button>
      </form>
    </div>
  );
}