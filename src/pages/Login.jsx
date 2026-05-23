import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  /* ================= AUTO REDIRECT ================= */
useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token || token === "undefined" || token === "null") {
    return;
  }

  // OPTIONAL: only navigate if NOT already on dashboard
  if (window.location.pathname !== "/dashboard") {
    navigate("/dashboard", { replace: true });
  }
}, [navigate]);

  /* ================= LOGIN ================= */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      const { token, user } = res.data;

      if (!token) {
        setError("Invalid login response");
        return;
      }

      // STORE TOKEN
    localStorage.setItem("token", token);
localStorage.setItem("user", JSON.stringify(user));

      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= GOOGLE LOGIN ================= */
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      const result = await signInWithPopup(auth, googleProvider);

      const googleUser = {
        name: result.user.displayName || "",
        email: result.user.email || "",
        photo: result.user.photoURL || "",
      };

      const res = await axios.post(
        "http://localhost:5000/api/auth/google",
        googleUser
      );

      const { token, user } = res.data;

      if (!token) {
        setError("Google login failed");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.log(err);
      setError("Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4 relative overflow-hidden">

      {/* BACKGROUND */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-180px] left-[-120px] w-[500px] h-[500px] bg-purple-500/20 blur-3xl rounded-full"></div>
        <div className="absolute bottom-[-180px] right-[-120px] w-[500px] h-[500px] bg-cyan-500/20 blur-3xl rounded-full"></div>
      </div>

      {/* LOGIN CARD */}
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-[30px] border border-white/10 bg-white/[0.03] backdrop-blur-2xl shadow-2xl p-8"
      >

        {/* TITLE */}
        <div className="text-center">
          <h2 className="text-3xl font-black tracking-[4px] uppercase">
            🔐 Login
          </h2>
          <p className="text-gray-400 text-xs mt-2 uppercase tracking-[2px]">
            Welcome Back
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mt-8 px-5 py-4 rounded-2xl bg-black/40 border border-white/10 outline-none focus:border-cyan-400 transition"
        />

        {/* PASSWORD */}
        <div className="relative mt-5">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-5 py-4 rounded-2xl bg-black/40 border border-white/10 outline-none focus:border-emerald-400 transition"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {/* FORGOT PASSWORD */}
        <div className="text-right mt-2">
          <Link
            to="/forgot-password"
            className="text-xs text-cyan-400 hover:text-purple-400 transition"
          >
            Forgot Password?
          </Link>
        </div>

        {/* REMEMBER */}
        <div className="flex items-center gap-2 mt-4 text-sm text-gray-400">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="accent-cyan-400"
          />
          Remember me
        </div>

        {/* LOGIN BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-7 py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-cyan-400 text-black font-bold tracking-[2px] hover:scale-[1.03] active:scale-95 transition flex items-center justify-center"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* GOOGLE LOGIN */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full mt-4 py-4 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] transition"
        >
          Continue with Google
        </button>

        {/* REGISTER */}
        <p className="text-center text-gray-400 text-sm mt-5">
          Don’t have account?{" "}
          <Link to="/register" className="text-purple-400 hover:text-cyan-300">
            Register
          </Link>
        </p>

      </form>
    </div>
  );
}

export default Login;