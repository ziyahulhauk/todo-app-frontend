import { useState } from "react";

import axios from "axios";

import {
  FaEnvelope,
  FaPaperPlane,
  FaSpinner,
  FaArrowLeft,
  FaLock,
} from "react-icons/fa";

import { Link } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!email.trim()) {
      return setError(
        "Email is required"
      );
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        {
          email,
        }
      );

      setMessage(
        res.data.message ||
          "Reset link sent successfully"
      );

      setEmail("");
    } catch (err) {
      console.log(err);

      setError(
        err.response?.data
          ?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center overflow-hidden relative px-4">

      {/* ================= BACKGROUND ================= */}

      <div className="absolute inset-0 -z-10">

        <div className="absolute inset-0 bg-gradient-to-br from-[#06120d] via-black to-[#08111d]"></div>

        <div className="absolute top-[-200px] left-[-150px] w-[500px] h-[500px] rounded-full bg-emerald-500/20 blur-3xl"></div>

        <div className="absolute bottom-[-200px] right-[-150px] w-[500px] h-[500px] rounded-full bg-cyan-500/20 blur-3xl"></div>

      </div>

      {/* ================= CARD ================= */}

      <div className="w-full max-w-md rounded-[35px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-8 relative overflow-hidden">

        {/* GLOW */}

        <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl"></div>

        {/* HEADER */}

        <div className="relative z-10 text-center">

          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 flex items-center justify-center text-black text-4xl shadow-lg shadow-emerald-500/20">

            <FaLock />

          </div>

          <h1 className="text-4xl font-black mt-6 tracking-[3px] uppercase">

            Forgot Password

          </h1>

          <p className="text-gray-400 mt-4 tracking-[2px] uppercase text-sm">

            Reset your account password securely

          </p>

        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="relative z-10 mt-10 space-y-6"
        >

          {/* EMAIL */}

          <div>

            <label className="text-sm uppercase tracking-[3px] text-gray-400">

              Email Address

            </label>

            <div className="relative mt-3">

              <FaEnvelope className="absolute top-1/2 left-5 -translate-y-1/2 text-gray-500" />

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                className="w-full bg-black/40 border border-white/10 pl-14 pr-5 py-4 rounded-2xl outline-none focus:border-cyan-400 transition"
              />

            </div>

          </div>

          {/* ERROR */}

          {error && (

            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-red-400 text-sm">

              {error}

            </div>

          )}

          {/* SUCCESS */}

          {message && (

            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-4 text-emerald-400 text-sm">

              {message}

            </div>

          )}

          {/* BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-[60px] rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-black font-black tracking-[2px] uppercase hover:scale-[1.02] transition duration-300 disabled:opacity-50 flex items-center justify-center gap-3"
          >

            {loading ? (
              <>
                <FaSpinner className="animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <FaPaperPlane />
                Send Reset Link
              </>
            )}

          </button>

        </form>

        {/* FOOTER */}

        <div className="relative z-10 mt-8 text-center">

          <Link
            to="/"
            className="inline-flex items-center gap-3 text-cyan-400 hover:text-emerald-400 transition duration-300 uppercase tracking-[2px] text-sm"
          >

            <FaArrowLeft />

            Back To Login

          </Link>

        </div>

      </div>

    </div>
  );
}

export default ForgotPassword;