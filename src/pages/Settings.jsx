import { useEffect, useState } from "react";

import {
  FaUserCircle,
  FaLock,
  FaBell,
  FaPalette,
  FaShieldAlt,
  FaSave,
  FaMoon,
  FaSun,
  FaEnvelope,
  FaUser,
  FaSpinner,
} from "react-icons/fa";

import {
  getCurrentUser,
  updateUser,
} from "../api/authApi";

function Settings() {
  const token =
    localStorage.getItem("token");

  /* ================= STATES ================= */

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [darkMode, setDarkMode] =
    useState(
      localStorage.getItem("theme") ===
        "dark"
    );

  const [notifications, setNotifications] =
    useState(
      JSON.parse(
        localStorage.getItem(
          "notifications"
        )
      ) ?? true
    );

  const [profile, setProfile] =
    useState({
      name: "",

      email: "",

      password: "",
    });

  /* ================= FETCH USER ================= */

useEffect(() => {
  if (!token) return;

  fetchUser();
}, []);

  const fetchUser =
    async () => {
      try {
        setLoading(true);

        const res =
          await getCurrentUser(
            token
          );

      setProfile({
  name: res.data.user?.name || "",
  email: res.data.user?.email || "",
  password: "",
});

    localStorage.setItem("userName", res.data.user?.name || "");
localStorage.setItem("userEmail", res.data.user?.email || "");
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

  /* ================= THEME ================= */

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add(
        "dark"
      );

      localStorage.setItem(
        "theme",
        "dark"
      );
    } else {
      document.documentElement.classList.remove(
        "dark"
      );

      localStorage.setItem(
        "theme",
        "light"
      );
    }
  }, [darkMode]);

  /* ================= NOTIFICATION ================= */

  useEffect(() => {
    localStorage.setItem(
      "notifications",
      JSON.stringify(
        notifications
      )
    );
  }, [notifications]);

  /* ================= HANDLE INPUT ================= */

  const handleChange = (
    e
  ) => {
    setProfile({
      ...profile,

      [e.target.name]:
        e.target.value,
    });
  };

  /* ================= SAVE SETTINGS ================= */

const saveSettings = async () => {
  try {
    setSaving(true);

    if (
      profile.password &&
      profile.password.length < 6
    ) {
      alert(
        "Password must be at least 6 characters"
      );

      setSaving(false);

      return;
    }

    const payload = {
      name: profile.name,
      email: profile.email,
    };

    if (
      profile.password.trim() !== ""
    ) {
      payload.password =
        profile.password;
    }

    const res =
      await updateUser(
        token,
        payload
      );

    setProfile({
      name: res.data.user.name,
      email: res.data.user.email,
      password: "",
    });

    localStorage.setItem(
      "userName",
      res.data.user.name
    );

    localStorage.setItem(
      "userEmail",
      res.data.user.email
    );

    alert(
      "Settings Updated Successfully 🚀"
    );
  } catch (error) {
    console.log(error);

    alert(
      error?.response?.data
        ?.message ||
        "Failed To Update"
    );
  } finally {
    setSaving(false);
  }
};

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">

      {/* ================= BACKGROUND ================= */}

      <div className="fixed inset-0 -z-10">

        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-black to-slate-950"></div>

        <div className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-3xl"></div>

        <div className="absolute bottom-[-200px] right-[-100px] w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-3xl"></div>

      </div>

      {/* ================= PAGE ================= */}

      <div className="p-5 md:p-8">

        {/* ================= HEADER ================= */}

        <div className="flex items-center justify-between flex-wrap gap-5">

          <div>

            <h1 className="text-4xl md:text-6xl font-thin tracking-[8px] uppercase">

              Settings{" "}

              <span className="font-black">

                Panel

              </span>

            </h1>

            <p className="text-gray-400 tracking-[3px] uppercase mt-4 text-sm">

              Smart User Preferences Dashboard

            </p>

          </div>

          <button
            onClick={saveSettings}
            disabled={saving}
            className="flex items-center gap-3 px-7 py-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-black font-bold hover:scale-105 transition duration-300 disabled:opacity-50"
          >

            {saving ? (
              <FaSpinner className="animate-spin" />
            ) : (
              <FaSave />
            )}

            {saving
              ? "Saving..."
              : "Save Settings"}

          </button>

        </div>

        {/* ================= LOADING ================= */}

        {loading ? (
          <div className="flex items-center justify-center h-[60vh]">

            <div className="text-center">

              <div className="w-20 h-20 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto"></div>

              <p className="mt-6 tracking-[4px] uppercase text-gray-400">

                Loading Settings...

              </p>

            </div>

          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">

            {/* ================= LEFT ================= */}

            <div className="xl:col-span-2 space-y-6">

              {/* PROFILE */}

              <div className="rounded-[35px] border border-white/10 bg-white/[0.03] backdrop-blur-2xl p-6">

                <div className="flex items-center gap-4 mb-8">

                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 flex items-center justify-center text-black text-3xl">

                    <FaUserCircle />

                  </div>

                  <div>

                    <h1 className="text-3xl font-black tracking-[3px] uppercase">

                      Profile Settings

                    </h1>

                    <p className="text-gray-400 mt-2">

                      Manage your personal information

                    </p>

                  </div>

                </div>

                <div className="space-y-5">

                  {/* NAME */}

                  <div>

                    <label className="text-sm uppercase tracking-[3px] text-gray-400">

                      Full Name

                    </label>

                    <div className="relative mt-3">

                      <FaUser className="absolute top-1/2 left-5 -translate-y-1/2 text-gray-500" />

                      <input
                        type="text"
                        name="name"
                        value={profile.name}
                        onChange={
                          handleChange
                        }
                        placeholder="Enter your name"
                        className="w-full bg-black/40 border border-white/10 pl-14 pr-5 py-4 rounded-2xl outline-none focus:border-emerald-400"
                      />

                    </div>

                  </div>

                  {/* EMAIL */}

                  <div>

                    <label className="text-sm uppercase tracking-[3px] text-gray-400">

                      Email Address

                    </label>

                    <div className="relative mt-3">

                      <FaEnvelope className="absolute top-1/2 left-5 -translate-y-1/2 text-gray-500" />

                      <input
                        type="email"
                        name="email"
                        value={profile.email}
                        onChange={
                          handleChange
                        }
                        placeholder="Enter email"
                        className="w-full bg-black/40 border border-white/10 pl-14 pr-5 py-4 rounded-2xl outline-none focus:border-cyan-400"
                      />

                    </div>

                  </div>

                  {/* PASSWORD */}

                  <div>

                    <label className="text-sm uppercase tracking-[3px] text-gray-400">

                      Password

                    </label>

                    <div className="relative mt-3">

                      <FaLock className="absolute top-1/2 left-5 -translate-y-1/2 text-gray-500" />

                  <input
  type="password"
  name="password"
  value={profile.password}
  onChange={handleChange}
  placeholder="Enter new password minimum 6 characters"
  minLength={6}
  autoComplete="new-password"
  className="w-full bg-black/40 border border-white/10 pl-14 pr-5 py-4 rounded-2xl outline-none focus:border-pink-400"
/>

                    </div>

                  </div>

                </div>

              </div>

              {/* SECURITY */}

              <div className="rounded-[35px] border border-white/10 bg-white/[0.03] backdrop-blur-2xl p-6">

                <div className="flex items-center gap-4 mb-8">

                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-pink-500 to-orange-400 flex items-center justify-center text-black text-2xl">

                    <FaShieldAlt />

                  </div>

                  <div>

                    <h1 className="text-3xl font-black tracking-[3px] uppercase">

                      Security

                    </h1>

                    <p className="text-gray-400 mt-2">

                      Protect your account securely

                    </p>

                  </div>

                </div>

                <div className="space-y-5">

                  <div className="flex items-center justify-between flex-wrap gap-4 border border-white/10 bg-black/30 rounded-2xl p-5">

                    <div>

                      <h1 className="font-bold text-lg">

                        Two Factor Authentication

                      </h1>

                      <p className="text-gray-400 text-sm mt-1">

                        Add extra security layer

                      </p>

                    </div>

                    <button className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-black font-bold">

                      Enable

                    </button>

                  </div>

                  <div className="flex items-center justify-between flex-wrap gap-4 border border-white/10 bg-black/30 rounded-2xl p-5">

                    <div>

                      <h1 className="font-bold text-lg">

                        Login Alerts

                      </h1>

                      <p className="text-gray-400 text-sm mt-1">

                        Get suspicious login alerts

                      </p>

                    </div>

                    <button className="px-6 py-3 rounded-2xl border border-white/10 hover:border-emerald-400 transition">

                      Active

                    </button>

                  </div>

                </div>

              </div>

            </div>

            {/* ================= RIGHT ================= */}

            <div className="space-y-6">

              {/* USER CARD */}

              <div className="rounded-[35px] border border-white/10 bg-white/[0.03] backdrop-blur-2xl p-6 text-center">

                <div className="w-28 h-28 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 flex items-center justify-center mx-auto text-black text-6xl">

                  <FaUserCircle />

                </div>

                <h1 className="text-3xl font-black mt-5">

                  {profile.name}

                </h1>

               <p className="text-gray-400 tracking-[3px] uppercase mt-2 text-sm">
  {profile.email || "No Email Found"}
</p>

              </div>

              {/* APPEARANCE */}

              <div className="rounded-[35px] border border-white/10 bg-white/[0.03] backdrop-blur-2xl p-6">

                <div className="flex items-center gap-4 mb-6">

                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center text-black text-2xl">

                    <FaPalette />

                  </div>

                  <div>

                    <h1 className="text-2xl font-black uppercase tracking-[3px]">

                      Appearance

                    </h1>

                    <p className="text-gray-400 text-sm mt-1">

                      Customize UI Theme

                    </p>

                  </div>

                </div>

                <div className="flex items-center justify-between border border-white/10 bg-black/30 rounded-2xl p-5">

                  <div className="flex items-center gap-3">

                    {darkMode ? (
                      <FaMoon className="text-cyan-400 text-xl" />
                    ) : (
                      <FaSun className="text-yellow-400 text-xl" />
                    )}

                    <div>

                      <h1 className="font-bold">

                        Dark Mode

                      </h1>

                      <p className="text-gray-400 text-sm">

                        Toggle dark/light theme

                      </p>

                    </div>

                  </div>

                  <button
                    onClick={() =>
                      setDarkMode(
                        !darkMode
                      )
                    }
                    className={`w-16 h-9 rounded-full transition duration-300 flex items-center px-1 ${
                      darkMode
                        ? "bg-emerald-400 justify-end"
                        : "bg-gray-600 justify-start"
                    }`}
                  >

                    <div className="w-7 h-7 rounded-full bg-white"></div>

                  </button>

                </div>

              </div>

              {/* NOTIFICATIONS */}

              <div className="rounded-[35px] border border-white/10 bg-white/[0.03] backdrop-blur-2xl p-6">

                <div className="flex items-center gap-4 mb-6">

                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-orange-400 to-pink-500 flex items-center justify-center text-black text-2xl">

                    <FaBell />

                  </div>

                  <div>

                    <h1 className="text-2xl font-black uppercase tracking-[3px]">

                      Notifications

                    </h1>

                    <p className="text-gray-400 text-sm mt-1">

                      Manage app alerts

                    </p>

                  </div>

                </div>

                <div className="flex items-center justify-between border border-white/10 bg-black/30 rounded-2xl p-5">

                  <div>

                    <h1 className="font-bold">

                      Push Notifications

                    </h1>

                    <p className="text-gray-400 text-sm mt-1">

                      Receive instant updates

                    </p>

                  </div>

                  <button
                    onClick={() =>
                      setNotifications(
                        !notifications
                      )
                    }
                    className={`w-16 h-9 rounded-full transition duration-300 flex items-center px-1 ${
                      notifications
                        ? "bg-emerald-400 justify-end"
                        : "bg-gray-600 justify-start"
                    }`}
                  >

                    <div className="w-7 h-7 rounded-full bg-white"></div>

                  </button>

                </div>

              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}

export default Settings;