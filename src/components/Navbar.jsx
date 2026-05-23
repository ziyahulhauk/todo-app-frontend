import {
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  FaBars,
  FaTimes,
  FaBell,
  FaSearch,
  FaUserCircle,
  FaChartPie,
  FaTasks,
  FaRocket,
  FaCog,
  FaEnvelope,
  FaSignOutAlt,
} from "react-icons/fa";

import { getCurrentUser } from "../api/authApi";

function Navbar() {
  const navigate = useNavigate();

  const location = useLocation();

  const token =
    localStorage.getItem("token") || "";

  /* ================= STATES ================= */

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [profileOpen, setProfileOpen] =
    useState(false);

  const [
    notificationOpen,
    setNotificationOpen,
  ] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const [user, setUser] = useState({
    name:
      localStorage.getItem("userName") ||
      "",
    email:
      localStorage.getItem(
        "userEmail"
      ) || "",
  });

  const dropdownRef = useRef(null);

  const notificationRef =
    useRef(null);

  /* ================= FETCH USER ================= */

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;

      try {
        setLoading(true);

        const res =
          await getCurrentUser(token);

        const data =
          res.data.user || res.data;

        setUser({
          name: data?.name || "Guest",
          email:
            data?.email || "No Email",
        });

        localStorage.setItem(
          "userName",
          data?.name || ""
        );

        localStorage.setItem(
          "userEmail",
          data?.email || ""
        );
      } catch (error) {
        console.log(
          "Fetch User Error:",
          error
        );

        if (
          error?.response?.status ===
          401
        ) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  /* ================= NOTIFICATIONS ================= */

  const [notifications, setNotifications] =
    useState([
      {
        id: 1,
        text: "New project assigned",
        read: false,
      },

      {
        id: 2,
        text: "Task completed",
        read: false,
      },

      {
        id: 3,
        text: "Server deployed",
        read: true,
      },
    ]);

  const unreadCount =
    notifications.filter(
      (item) => !item.read
    ).length;

  /* ================= CLOSE DROPDOWN ================= */

  useEffect(() => {
    const handler = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          e.target
        )
      ) {
        setProfileOpen(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(
          e.target
        )
      ) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handler
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handler
      );
  }, []);

  /* ================= LOGOUT ================= */

  const logout = () => {
    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "userName"
    );

    localStorage.removeItem(
      "userEmail"
    );

    navigate("/");
  };

  /* ================= MARK ALL READ ================= */

  const markAllRead = () => {
    const updated =
      notifications.map((item) => ({
        ...item,
        read: true,
      }));

    setNotifications(updated);
  };

  /* ================= NAV ITEMS ================= */

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <FaChartPie />,
    },

    {
      name: "Todo",
      path: "/todo",
      icon: <FaTasks />,
    },

    {
      name: "Drag Board",
      path: "/drag",
      icon: <FaRocket />,
    },

    {
      name: "Settings",
      path: "/settings",
      icon: <FaCog />,
    },
  ];

  return (
    <>
      {/* ================= NAVBAR ================= */}

      <nav className="sticky top-0 z-[9999] border-b border-white/10 bg-[#050505]/80 backdrop-blur-3xl">

        <div className="h-[84px] max-w-[1600px] mx-auto px-4 md:px-6 flex items-center justify-between">

          {/* ================= LEFT ================= */}

          <div className="flex items-center gap-4">

            {/* MOBILE BUTTON */}

            <button
              onClick={() =>
                setMobileOpen(
                  !mobileOpen
                )
              }
              className="lg:hidden w-11 h-11 rounded-2xl border border-white/10 bg-white/[0.04] flex items-center justify-center"
            >
              {mobileOpen ? (
                <FaTimes />
              ) : (
                <FaBars />
              )}
            </button>

            {/* LOGO */}

            <Link to="/dashboard">

              <h1 className="text-3xl font-black tracking-[4px] bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">

                SMART

              </h1>

              <p className="text-[10px] tracking-[3px] uppercase text-gray-400">

                Productivity System

              </p>

            </Link>

          </div>

          {/* ================= CENTER ================= */}

          <div className="hidden xl:flex items-center gap-4">

            {navItems.map((item) => (

              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-2 px-5 h-[52px] rounded-2xl transition duration-300 ${
                  location.pathname ===
                  item.path
                    ? "bg-gradient-to-r from-emerald-400 to-cyan-400 text-black"
                    : "border border-white/10 bg-white/[0.03] text-white"
                }`}
              >

                {item.icon}

                <span>
                  {item.name}
                </span>

              </Link>

            ))}

          </div>

          {/* ================= RIGHT ================= */}

          <div className="flex items-center gap-3">

            {/* SEARCH */}

            <div className="hidden md:flex items-center gap-3 px-4 h-12 rounded-2xl border border-white/10 bg-white/[0.03]">

              <FaSearch />

              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent outline-none text-sm"
              />

            </div>

            {/* NOTIFICATIONS */}

            <div
              className="relative"
              ref={notificationRef}
            >

              <button
                onClick={() =>
                  setNotificationOpen(
                    !notificationOpen
                  )
                }
                className="relative w-12 h-12 rounded-2xl border border-white/10 bg-white/[0.03] flex items-center justify-center"
              >

                <FaBell />

                {unreadCount > 0 && (

                  <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">

                    {unreadCount}

                  </span>

                )}

              </button>

              {/* NOTIFICATION DROPDOWN */}

              {notificationOpen && (

                <div className="absolute top-[70px] right-0 w-[320px] rounded-[28px] border border-white/10 bg-[#090909] overflow-hidden">

                  <div className="flex items-center justify-between p-5 border-b border-white/10">

                    <h1 className="font-bold">

                      Notifications

                    </h1>

                    <button
                      onClick={
                        markAllRead
                      }
                      className="text-xs text-emerald-400"
                    >

                      Mark All

                    </button>

                  </div>

                  {notifications.map(
                    (item) => (

                      <div
                        key={item.id}
                        className="p-5 border-b border-white/5"
                      >

                        <p className="text-sm">

                          {item.text}

                        </p>

                      </div>

                    )
                  )}

                </div>

              )}

            </div>

            {/* PROFILE */}

            {token ? (

              <div
                className="relative"
                ref={dropdownRef}
              >

                <button
                  onClick={() =>
                    setProfileOpen(
                      !profileOpen
                    )
                  }
                  className="flex items-center gap-3 px-3 py-2 rounded-2xl border border-white/10 bg-white/[0.03]"
                >

                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 flex items-center justify-center text-black text-xl">

                    <FaUserCircle />

                  </div>

                  <div className="hidden md:block text-left">

                    <h1 className="text-sm font-bold">

                      {loading
                        ? "Loading..."
                        : user.name}

                    </h1>

                    <p className="text-xs text-gray-400">

                      {user.email}

                    </p>

                  </div>

                </button>

                {/* PROFILE DROPDOWN */}

                {profileOpen && (

                  <div className="absolute top-[70px] right-0 w-[280px] rounded-[28px] border border-white/10 bg-[#090909] overflow-hidden">

                    <div className="p-6 border-b border-white/10">

                      <div className="flex items-center gap-4">

                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 flex items-center justify-center text-black text-2xl">

                          <FaUserCircle />

                        </div>

                        <div>

                          <h1 className="font-bold text-lg">

                            {user.name}

                          </h1>

                          <p className="text-sm text-gray-400">

                            {user.email}

                          </p>

                        </div>

                      </div>

                    </div>

                    <div className="p-3">

                      <Link
                        to="/settings"
                        className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-white/[0.05]"
                      >

                        <FaCog />

                        Settings

                      </Link>

                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-red-500/10 text-red-400"
                      >

                        <FaSignOutAlt />

                        Logout

                      </button>

                    </div>

                  </div>

                )}

              </div>

            ) : (

              <div className="flex items-center gap-3">

                <Link
                  to="/"
                  className="px-5 py-3 rounded-2xl border border-white/10"
                >

                  Login

                </Link>

                <Link
                  to="/register"
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-black font-bold"
                >

                  Register

                </Link>

              </div>

            )}

          </div>

        </div>

      </nav>

      {/* ================= MOBILE MENU ================= */}

      {mobileOpen && (

        <div className="lg:hidden p-4">

          <div className="rounded-[30px] border border-white/10 bg-[#090909] p-5 space-y-4">

            {navItems.map((item) => (

              <Link
                key={item.name}
                to={item.path}
                onClick={() =>
                  setMobileOpen(false)
                }
                className="flex items-center gap-4 px-5 py-4 rounded-2xl border border-white/10"
              >

                {item.icon}

                {item.name}

              </Link>

            ))}

          </div>

        </div>

      )}

    </>
  );
}

export default Navbar;