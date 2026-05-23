import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaShieldAlt,
  FaEye,
  FaEyeSlash,
  FaSpinner,
  FaPaperPlane,
} from "react-icons/fa";

function Register() {

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [otp, setOtp] =
    useState("");

  const [otpSent, setOtpSent] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const navigate = useNavigate();

  /* ================= SEND OTP ================= */

  const sendOtp = async () => {

    setError("");
    setSuccess("");

    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      return setError(
        "Please fill all fields"
      );
    }

    if (password.length < 6) {
      return setError(
        "Password must be at least 6 characters"
      );
    }

    if (password !== confirmPassword) {
      return setError(
        "Passwords do not match"
      );
    }

    try {

      setLoading(true);

      const res = await axios.post(
        "https://todo-hqdd.onrender.com/api/auth/send-otp",
        { email }
      );

      setSuccess(
        res.data.message ||
          "OTP sent successfully"
      );

      setOtpSent(true);

    } catch (err) {

      console.log(err);

      setError(
        err.response?.data?.message ||
        "Failed to send OTP"
      );

    } finally {

      setLoading(false);

    }
  };

  /* ================= REGISTER ================= */

  const handleRegister = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");

    if (!otp) {
      return setError(
        "Enter OTP"
      );
    }

    try {

      setLoading(true);

      const res = await axios.post(
        "https://todo-hqdd.onrender.com/api/auth/register",
        {
          name,
          email,
          password,
          otp,
        }
      );

      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(
          res.data.user
        )
      );

      setSuccess(
        "Account created successfully 🔥"
      );

      setTimeout(() => {

        navigate("/dashboard");

      }, 1500);

    } catch (err) {

      console.log(err);

      setError(
        err.response?.data?.message ||
        "Register failed"
      );

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

      {/* CARD */}

      <form
        onSubmit={handleRegister}
        className="w-full max-w-md rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl shadow-2xl p-8"
      >

        {/* TITLE */}

        <div className="text-center">

          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 flex items-center justify-center text-black text-4xl shadow-lg shadow-cyan-500/20">

            <FaShieldAlt />

          </div>

          <h1 className="text-4xl font-black mt-6 tracking-[4px] uppercase">

            Register

          </h1>

          <p className="text-gray-400 text-xs mt-3 tracking-[3px] uppercase">

            Create Your Smart Account

          </p>

        </div>

        {/* NAME */}

        <div className="relative mt-8">

          <FaUser className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" />

          <input
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
            className="w-full pl-14 pr-5 py-4 rounded-2xl bg-black/40 border border-white/10 outline-none focus:border-purple-400 transition"
          />

        </div>

        {/* EMAIL */}

        <div className="relative mt-5">

          <FaEnvelope className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" />

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            className="w-full pl-14 pr-5 py-4 rounded-2xl bg-black/40 border border-white/10 outline-none focus:border-cyan-400 transition"
          />

        </div>

        {/* PASSWORD */}

        <div className="relative mt-5">

          <FaLock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" />

          <input
            type={
              showPassword
                ? "text"
                : "password"
            }
            placeholder="Enter Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            className="w-full pl-14 pr-14 py-4 rounded-2xl bg-black/40 border border-white/10 outline-none focus:border-emerald-400 transition"
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(
                !showPassword
              )
            }
            className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >

            {showPassword ? (
              <FaEyeSlash />
            ) : (
              <FaEye />
            )}

          </button>

        </div>

        {/* CONFIRM PASSWORD */}

        <div className="relative mt-5">

          <FaLock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" />

          <input
            type={
              showConfirmPassword
                ? "text"
                : "password"
            }
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(
                e.target.value
              )
            }
            className="w-full pl-14 pr-14 py-4 rounded-2xl bg-black/40 border border-white/10 outline-none focus:border-pink-400 transition"
          />

          <button
            type="button"
            onClick={() =>
              setShowConfirmPassword(
                !showConfirmPassword
              )
            }
            className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >

            {showConfirmPassword ? (
              <FaEyeSlash />
            ) : (
              <FaEye />
            )}

          </button>

        </div>

        {/* SEND OTP */}

        {!otpSent && (

          <button
            type="button"
            onClick={sendOtp}
            disabled={loading}
            className="w-full mt-6 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-purple-500 text-black font-black tracking-[2px] hover:scale-[1.02] transition duration-300 flex items-center justify-center gap-3"
          >

            {loading ? (
              <>
                <FaSpinner className="animate-spin" />
                Sending OTP...
              </>
            ) : (
              <>
                <FaPaperPlane />
                Send OTP
              </>
            )}

          </button>

        )}

        {/* OTP */}

        {otpSent && (

          <>

            <div className="relative mt-6">

              <FaShieldAlt className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" />

              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) =>
                  setOtp(
                    e.target.value
                  )
                }
                className="w-full pl-14 pr-5 py-4 rounded-2xl bg-black/40 border border-white/10 outline-none focus:border-emerald-400 transition"
              />

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-black font-black tracking-[2px] hover:scale-[1.02] transition duration-300 flex items-center justify-center gap-3"
            >

              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Creating...
                </>
              ) : (
                "Verify OTP & Register"
              )}

            </button>

          </>

        )}

        {/* ERROR */}

        {error && (

          <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-red-400 text-sm">

            {error}

          </div>

        )}

        {/* SUCCESS */}

        {success && (

          <div className="mt-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-4 text-emerald-400 text-sm">

            {success}

          </div>

        )}

        {/* LOGIN */}

        <p className="text-center text-gray-400 text-sm mt-6">

          Already have account?{" "}

          <Link
            to="/"
            className="text-cyan-400 hover:text-purple-400 transition"
          >

            Login

          </Link>

        </p>

      </form>

    </div>
  );
}

export default Register;