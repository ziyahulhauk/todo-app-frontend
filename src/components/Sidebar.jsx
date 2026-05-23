import { useState } from "react";

function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  logout,
}) {
  const [active, setActive] =
    useState("Dashboard");

  const menuItems = [
    {
      icon: "🏠",
      name: "Dashboard",
    },

    {
      icon: "📝",
      name: "Tasks",
    },

    {
      icon: "📊",
      name: "Analytics",
    },

    {
      icon: "👥",
      name: "Team",
    },

    {
      icon: "💬",
      name: "Messages",
    },

    {
      icon: "🚀",
      name: "Projects",
    },

    {
      icon: "🔔",
      name: "Notifications",
    },

    {
      icon: "⚙",
      name: "Settings",
    },
  ];

  return (
    <>
      {/* MOBILE OVERLAY */}

      {sidebarOpen && (
        <div
          onClick={() =>
            setSidebarOpen(false)
          }
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        ></div>
      )}

      {/* SIDEBAR */}

      <div
        className={`fixed top-0 left-0 z-50 h-screen w-[260px]
        transition-all duration-500 ease-in-out
        ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }
        lg:translate-x-0`}
      >

        {/* BACKGROUND */}

        <div className="absolute inset-0 bg-[#050505]/95 backdrop-blur-3xl border-r border-white/10"></div>

        {/* GLOW EFFECTS */}

        <div className="absolute top-[-120px] left-[-100px] w-[240px] h-[240px] bg-emerald-500/20 rounded-full blur-3xl"></div>

        <div className="absolute bottom-[-100px] right-[-100px] w-[220px] h-[220px] bg-cyan-500/20 rounded-full blur-3xl"></div>

        {/* CONTENT */}

        <div className="relative z-10 h-full flex flex-col overflow-y-auto p-5">

          {/* HEADER */}

          <div className="flex items-center justify-between">

            <div>

              <h1 className="text-3xl font-black tracking-[4px] text-white">

                SMART

              </h1>

              <p className="text-emerald-400 tracking-[3px] text-xs mt-2">

                CONTROL PANEL

              </p>

            </div>

            {/* CLOSE BUTTON */}

            <button
              onClick={() =>
                setSidebarOpen(false)
              }
              className="lg:hidden w-10 h-10 rounded-xl bg-white/10 border border-white/10 text-lg hover:bg-white/20 transition"
            >

              ✖

            </button>

          </div>

          {/* USER CARD */}

          <div className="mt-8 rounded-[28px] border border-white/10 bg-white/[0.04] p-5 relative overflow-hidden">

            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl"></div>

            <div className="relative z-10 text-center">

              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 flex items-center justify-center text-black text-4xl mx-auto">

                👤

              </div>

              <h1 className="text-2xl font-black mt-4">

                Demo User

              </h1>

              <p className="text-gray-400 text-sm tracking-[2px] uppercase mt-2">

                Full Stack Developer

              </p>

            </div>

          </div>

          {/* MENU */}

          <div className="mt-8 space-y-3">

            {menuItems.map(
              (item, index) => (

                <button
                  key={index}
                  onClick={() =>
                    setActive(item.name)
                  }
                  className={`group relative w-full overflow-hidden rounded-[20px]
                  px-4 py-4 flex items-center gap-4 transition-all duration-500
                  ${
                    active === item.name
                      ? "bg-gradient-to-r from-emerald-400 to-cyan-400 text-black font-bold"
                      : "bg-white/[0.03] border border-white/10 hover:border-emerald-400/40 hover:bg-white/[0.05]"
                  }`}
                >

                  {/* HOVER EFFECT */}

                  {active !== item.name && (
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 transition duration-500"></div>
                  )}

                  <span className="relative z-10 text-xl">

                    {item.icon}

                  </span>

                  <span className="relative z-10 text-sm uppercase tracking-[2px] font-semibold">

                    {item.name}

                  </span>

                </button>

              )
            )}

          </div>

          {/* STORAGE */}

          <div className="mt-8 rounded-[28px] border border-white/10 bg-white/[0.03] p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-400 uppercase tracking-[2px] text-xs">

                  Storage

                </p>

                <h1 className="text-4xl font-black mt-2">

                  78%

                </h1>

              </div>

              <div className="text-4xl">

                💾

              </div>

            </div>

            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden mt-6">

              <div className="w-[78%] h-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full"></div>

            </div>

            <div className="flex justify-between mt-3 text-xs text-gray-400">

              <p>780GB Used</p>

              <p>1TB</p>

            </div>

          </div>

          {/* LIVE STATUS */}

          <div className="mt-8 rounded-[28px] border border-white/10 bg-white/[0.03] p-5">

            <h1 className="text-xl font-black tracking-[3px] uppercase mb-5">

              Live Status

            </h1>

            <div className="space-y-3">

              {[
                "🟢 Server Running",
                "🟢 Database Connected",
                "🟡 API Optimizing",
                "🟢 Security Active",
              ].map((item, index) => (

                <div
                  key={index}
                  className="bg-black/30 border border-white/10 rounded-2xl p-3 text-sm"
                >

                  {item}

                </div>

              ))}

            </div>

          </div>

          {/* LOGOUT */}

          <div className="mt-auto pt-8">

            <button
              onClick={logout}
              className="w-full rounded-[20px] bg-gradient-to-r from-red-500 to-pink-500 p-[1px] group"
            >

              <div className="bg-black rounded-[20px] px-5 py-4 flex items-center justify-center gap-3 group-hover:bg-transparent transition-all duration-500">

                <span className="text-xl">

                  🚪

                </span>

                <span className="uppercase tracking-[2px] font-bold text-sm">

                  Logout

                </span>

              </div>

            </button>

          </div>

        </div>

      </div>
    </>
  );
}

export default Sidebar;