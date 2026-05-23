import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../api/authApi";
import {
  FaTasks,
  FaCheckCircle,
  FaClock,
  FaTrash,
  FaSync,
  FaSearch,
  FaChartLine,
  FaUserCircle,
  FaRocket,
} from "react-icons/fa";


function Dashboard() {
  const navigate = useNavigate();

  const [todos, setTodos] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState(new Date());



  const [editingTodo, setEditingTodo] =
  useState(null);

const [editText, setEditText] =
  useState("");



  const token = localStorage.getItem("token");

  const [user, setUser] = useState({
  name: "",
  email: "",
});

  /* ================= AUTH ================= */

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [navigate, token]);

  /* ================= CLOCK ================= */

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  /* ================= FETCH TODOS ================= */

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    setLoading(true);

    try {
      const res = await axios.get(
        "https://todo-hqdd.onrender.com/api/todos",
        {
          headers: {
            Authorization: token,
          },
        }
      );

      const updated = res.data.map((todo, index) => ({
        ...todo,

        category:
          index % 3 === 0
            ? "Work"
            : index % 3 === 1
            ? "Study"
            : "Personal",

        priority:
          index % 3 === 0
            ? "High"
            : index % 3 === 1
            ? "Medium"
            : "Low",
      }));

      setTodos(updated);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
  fetchUser();
}, []);

const fetchUser = async () => {
  try {
    const res = await getCurrentUser(token);

    setUser({
      name: res.data.user?.name || "",
      email: res.data.user?.email || "",
    });
  } catch (error) {
    console.log("USER FETCH ERROR:", error);
  }
};

  /* ================= LOGOUT ================= */

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  /* ================= TOGGLE COMPLETE ================= */

const toggleComplete = async (
  id,
  completed
) => {
  try {
    const res = await axios.put(
      `http://localhost:5000/api/todos/${id}`,
      {
        completed: !completed,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setTodos((prev) =>
      prev.map((todo) =>
        todo._id === id
          ? res.data
          : todo
      )
    );
  } catch (error) {
    console.log(error);
  }
};



const editTodo = (todo) => {
  const newText = prompt(
    "Edit Task",
    todo.text
  );

  if (!newText || !newText.trim()) return;

  const updated = todos.map((item) =>
    item._id === todo._id
      ? {
          ...item,
          text: newText,
        }
      : item
  );

  setTodos(updated);
};

  /* ================= DELETE TODO ================= */

const deleteTodo = async (id) => {
  const confirmDelete =
    window.confirm(
      "Delete this task?"
    );

  if (!confirmDelete) return;

  try {
    await axios.delete(
      `https://todo-hqdd.onrender.com/api/todos/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setTodos((prev) =>
      prev.filter(
        (todo) => todo._id !== id
      )
    );
  } catch (error) {
    console.log(error);
  }
};

  /* ================= STATS ================= */

  const completed = todos.filter(
    (t) => t.completed
  ).length;

  const pending = todos.length - completed;

  const progress = todos.length
    ? (completed / todos.length) * 100
    : 0;

  /* ================= FILTER TODOS ================= */

  const filteredTodos = todos
    .filter((todo) => {
      if (filter === "completed")
        return todo.completed;

      if (filter === "pending")
        return !todo.completed;

      return true;
    })

    .filter((todo) =>
      todo.text
        .toLowerCase()
        .includes(search.toLowerCase())
    )

    .filter((todo) => {
      if (category === "All") return true;

      return todo.category === category;
    });

  /* ================= STATS CARDS ================= */

  const stats = useMemo(() => {
    return [
      {
        title: "Total Tasks",
        value: todos.length,
        icon: <FaTasks />,
        gradient:
          "from-cyan-500/20 to-blue-500/20",
      },

      {
        title: "Completed",
        value: completed,
        icon: <FaCheckCircle />,
        gradient:
          "from-emerald-500/20 to-green-500/20",
      },

      {
        title: "Pending",
        value: pending,
        icon: <FaClock />,
        gradient:
          "from-orange-500/20 to-red-500/20",
      },

      {
        title: "Progress",
        value: `${Math.round(progress)}%`,
        icon: <FaChartLine />,
        gradient:
          "from-pink-500/20 to-purple-500/20",
      },
    ];
  }, [todos, completed, pending, progress]);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">

      {/* ================= BACKGROUND ================= */}

      <div className="fixed inset-0 -z-10 overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-950 to-black"></div>

        <div className="absolute top-[-200px] left-[-100px] w-[450px] h-[450px] bg-emerald-500/10 rounded-full blur-3xl"></div>

        <div className="absolute bottom-[-200px] right-[-100px] w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-3xl"></div>

      </div>

      {/* ================= CONTAINER ================= */}

      <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-6">

        {/* ================= TOPBAR ================= */}

        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

          {/* LEFT */}

          <div>

            <h1 className="text-3xl md:text-5xl xl:text-6xl font-thin uppercase tracking-[6px] leading-tight">

              SMART{" "}

              <span className="font-black">

                DASHBOARD

              </span>

            </h1>

            <p className="text-gray-400 uppercase tracking-[3px] mt-4 text-xs md:text-sm">

              Premium futuristic productivity system
            </p>

          </div>

          {/* RIGHT */}

          <div className="flex flex-wrap items-center gap-4">

            <div className="h-[58px] px-5 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl flex items-center font-semibold">

              🕒 {time.toLocaleTimeString()}
            </div>

            <div className="h-[58px] px-6 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-black font-bold flex items-center gap-3">

              <FaUserCircle />

             {user.name || "Guest"}
            </div>
            

            <button
              onClick={logout}
              className="h-[58px] px-6 rounded-2xl bg-gradient-to-r from-red-500 to-pink-500 font-bold hover:scale-105 transition duration-300"
            >

              Logout

            </button>

          </div>

        </div>

        {/* ================= HERO ================= */}

       {/* ================= HERO ================= */}

<div className="relative overflow-hidden mt-8 rounded-[35px] border border-white/10 bg-[#080808] p-6 md:p-10">

  {/* BACKGROUND */}

  <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/40 via-black to-cyan-950/20"></div>

  <div className="absolute -left-20 top-0 w-[350px] h-[350px] bg-emerald-500/10 rounded-full blur-3xl"></div>

  <div className="absolute right-0 top-0 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-3xl"></div>

  {/* CONTENT */}

  <div className="relative z-10">

    {/* TOP BADGE */}

    <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 text-emerald-300 uppercase tracking-[3px] text-xs">

      <FaRocket />

      {completed > 0
        ? `${completed} Tasks Completed`
        : "Start Your Productivity Journey"}

    </div>

    {/* TITLE */}

    <h1 className="mt-8 text-4xl md:text-6xl xl:text-7xl font-thin uppercase tracking-[8px] leading-tight">

      WELCOME{" "}

      <span className="font-black text-emerald-400 break-words">

        {user?.name || "USER"}

      </span>

    </h1>

    {/* SUBTITLE */}

    <p className="mt-6 max-w-3xl text-gray-300 leading-relaxed uppercase tracking-[2px] text-sm md:text-base">

      {todos.length === 0
        ? "You currently have no active tasks. Start building your productivity system now."
        : `You currently have ${todos.length} tasks with ${completed} completed and ${pending} pending. Keep pushing your workflow to the next level.`}

    </p>

    {/* PROGRESS */}

    <div className="mt-8">

      <div className="flex items-center justify-between mb-3">

        <span className="text-xs uppercase tracking-[3px] text-gray-400">

          Productivity Progress

        </span>

        <span className="text-sm font-bold text-emerald-400">

          {Math.round(progress)}%

        </span>

      </div>

      <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden">

        <div
          className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full transition-all duration-700"
          style={{
            width: `${progress}%`,
          }}
        ></div>

      </div>

    </div>

    {/* STATS */}

    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">

      <div className="border border-white/10 bg-white/[0.03] rounded-2xl p-5">

        <p className="text-xs uppercase tracking-[3px] text-gray-400">

          Total

        </p>

        <h1 className="text-3xl font-black mt-2">

          {todos.length}

        </h1>

      </div>

      <div className="border border-white/10 bg-white/[0.03] rounded-2xl p-5">

        <p className="text-xs uppercase tracking-[3px] text-gray-400">

          Completed

        </p>

        <h1 className="text-3xl font-black mt-2 text-emerald-400">

          {completed}

        </h1>

      </div>

      <div className="border border-white/10 bg-white/[0.03] rounded-2xl p-5">

        <p className="text-xs uppercase tracking-[3px] text-gray-400">

          Pending

        </p>

        <h1 className="text-3xl font-black mt-2 text-orange-400">

          {pending}

        </h1>

      </div>

      <div className="border border-white/10 bg-white/[0.03] rounded-2xl p-5">

        <p className="text-xs uppercase tracking-[3px] text-gray-400">

          Efficiency

        </p>

        <h1 className="text-3xl font-black mt-2 text-cyan-400">

          {Math.round(progress)}%

        </h1>

      </div>

    </div>

    {/* ACTION BUTTONS */}

    <div className="flex flex-wrap gap-4 mt-10">

      <button
        onClick={() => navigate("/todo")}
        className="px-8 py-4 rounded-2xl border border-emerald-400 text-emerald-300 hover:bg-emerald-400 hover:text-black transition duration-300 font-semibold uppercase tracking-[3px]"
      >

        Manage Tasks

      </button>

      <button
        onClick={fetchTodos}
        className="px-8 py-4 rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] transition duration-300 uppercase tracking-[3px]"
      >

        Refresh Data

      </button>

    </div>

  </div>

</div>

        {/* ================= STATS ================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">

          {stats.map((item, index) => (

            <div
              key={index}
              className={`relative overflow-hidden rounded-[30px] border border-white/10 bg-gradient-to-br ${item.gradient} backdrop-blur-2xl p-6 hover:-translate-y-2 transition duration-500`}
            >

              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>

              <div className="relative z-10 flex items-center justify-between">

                <div>

                  <p className="uppercase tracking-[3px] text-gray-300 text-xs">

                    {item.title}

                  </p>

                  <h1 className="text-5xl font-black mt-4">

                    {item.value}

                  </h1>

                </div>

                <div className="text-5xl text-white/80">

                  {item.icon}

                </div>

              </div>

            </div>

          ))}

        </div>

        {/* ================= SEARCH BAR ================= */}

        <div className="mt-8 border border-white/10 bg-white/[0.03] backdrop-blur-2xl rounded-[30px] p-5">

          <div className="flex flex-col lg:flex-row gap-4">

            {/* SEARCH */}

            <div className="flex-1 flex items-center gap-3 bg-black/40 border border-white/10 rounded-2xl px-5">

              <FaSearch className="text-gray-400" />

              <input
                type="text"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="w-full bg-transparent py-4 outline-none text-white placeholder:text-gray-500"
              />

            </div>

            {/* FILTER */}

            <select
              value={filter}
              onChange={(e) =>
                setFilter(e.target.value)
              }
              className="bg-black/40 border border-white/10 px-5 py-4 rounded-2xl outline-none min-w-[180px]"
            >

              <option value="all">
                All Tasks
              </option>

              <option value="completed">
                Completed
              </option>

              <option value="pending">
                Pending
              </option>

            </select>

            {/* CATEGORY */}

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              className="bg-black/40 border border-white/10 px-5 py-4 rounded-2xl outline-none min-w-[180px]"
            >

              <option>All</option>
              <option>Work</option>
              <option>Study</option>
              <option>Personal</option>

            </select>

          </div>

        </div>

        {/* ================= MAIN CONTENT ================= */}

      {/* ================= MAIN CONTENT ================= */}

<div className="grid grid-cols-1 2xl:grid-cols-3 gap-6 mt-8">

  {/* ================= TASK SECTION ================= */}

  <div className="2xl:col-span-2 border border-white/10 bg-white/[0.03] backdrop-blur-2xl rounded-[35px] p-6">

    {/* HEADER */}

    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

      <div>

        <h1 className="text-3xl font-black uppercase tracking-[4px]">

          Task Management

        </h1>

        <p className="text-gray-400 uppercase tracking-[2px] text-xs mt-2">

          Manage all your workflow tasks efficiently

        </p>

      </div>

      <div className="flex flex-wrap gap-3">

        <button
          onClick={fetchTodos}
          className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-black font-bold hover:scale-105 transition duration-300"
        >

          <FaSync />

          Refresh

        </button>

        <button
          onClick={() =>
            navigate("/todo")
          }
          className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] transition duration-300 font-bold"
        >

          <FaTasks />

          Open Todo Page

        </button>

      </div>

    </div>

    {/* LOADING */}

    {loading ? (

      <div className="flex flex-col items-center justify-center py-24">

        <div className="w-16 h-16 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>

        <p className="mt-6 uppercase tracking-[3px] text-gray-400 text-sm">

          Loading Tasks...

        </p>

      </div>

    ) : filteredTodos.length === 0 ? (

      /* EMPTY */

      <div className="border border-dashed border-white/10 rounded-[30px] p-16 text-center bg-black/20">

        <div className="w-24 h-24 rounded-full bg-white/[0.03] flex items-center justify-center mx-auto text-5xl">

          📭

        </div>

        <h1 className="text-3xl font-black text-gray-300 mt-8">

          No Tasks Found

        </h1>

        <p className="text-gray-500 mt-4 max-w-xl mx-auto">

          No tasks matched your current search or filter settings.

        </p>

        <button
          onClick={() => {
            setSearch("");
            setFilter("all");
            setCategory("All");
          }}
          className="mt-8 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-black font-bold hover:scale-105 transition duration-300"
        >

          Reset Filters

        </button>

      </div>

    ) : (

      /* TASK LIST */

      <div className="space-y-5">

        {filteredTodos.map((todo, index) => (

          <div
            key={todo._id}
            className={`group relative overflow-hidden border rounded-[28px] p-6 transition duration-500 hover:-translate-y-1 ${
              todo.completed
                ? "border-emerald-400/20 bg-emerald-500/5"
                : "border-white/10 bg-black/30 hover:bg-white/[0.04]"
            }`}
          >

            {/* GLOW */}

            <div className="absolute top-0 right-0 w-40 h-40 bg-white/[0.02] rounded-full blur-3xl"></div>

            <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

              {/* LEFT */}

              <div className="flex-1 min-w-0">

                {/* TASK NUMBER */}

                <div className="flex items-center gap-3 mb-4">

                  <span className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-sm font-bold">

                    #{index + 1}

                  </span>

                  <span
                    className={`px-4 py-2 rounded-full text-xs uppercase tracking-[2px] ${
                      todo.completed
                        ? "bg-emerald-500/10 text-emerald-300 border border-emerald-400/20"
                        : "bg-orange-500/10 text-orange-300 border border-orange-400/20"
                    }`}
                  >

                    {todo.completed
                      ? "Completed"
                      : "Pending"}

                  </span>

                </div>

                {/* TITLE */}

                <h1
                  className={`text-2xl font-black break-words leading-relaxed ${
                    todo.completed
                      ? "line-through text-emerald-400"
                      : "text-white"
                  }`}
                >

                  {todo.text}

                </h1>

                {/* BADGES */}

                <div className="flex flex-wrap gap-3 mt-6">

                  <span className="px-4 py-2 rounded-full text-xs uppercase tracking-[2px] border border-cyan-400/20 bg-cyan-500/10 text-cyan-300">

                    📁 {todo.category}

                  </span>

                  <span
                    className={`px-4 py-2 rounded-full text-xs uppercase tracking-[2px] ${
                      todo.priority === "High"
                        ? "border border-red-400/20 bg-red-500/10 text-red-300"
                        : todo.priority === "Medium"
                        ? "border border-yellow-400/20 bg-yellow-500/10 text-yellow-300"
                        : "border border-green-400/20 bg-green-500/10 text-green-300"
                    }`}
                  >

                    ⚡ {todo.priority}

                  </span>

                </div>

              </div>

              {/* ACTIONS */}

              <div className="flex items-center gap-4">

                <button
                  onClick={() =>
                    toggleComplete(todo._id)
                  }
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold transition duration-300 hover:scale-110 ${
                    todo.completed
                      ? "bg-yellow-500 text-black"
                      : "bg-emerald-500 text-black"
                  }`}
                >

                  {todo.completed
                    ? "↺"
                    : "✔"}

                </button>

                <button
                  onClick={() =>
                    deleteTodo(todo._id)
                  }
                  className="w-16 h-16 rounded-2xl bg-gradient-to-r from-red-500 to-pink-500 hover:scale-110 transition duration-300 flex items-center justify-center text-2xl text-white"
                >

                  <FaTrash />

                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    )}

  </div>

  {/* ================= SIDEBAR ================= */}

  <div className="space-y-6">

    {/* USER PROFILE */}

    <div className="border border-white/10 bg-white/[0.03] backdrop-blur-2xl rounded-[35px] p-6 text-center overflow-hidden relative">

      <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10"></div>

      <div className="relative z-10">

        <div className="w-32 h-32 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 flex items-center justify-center mx-auto text-black text-6xl shadow-2xl shadow-emerald-500/20">

          <FaUserCircle />

        </div>

        <h1 className="text-3xl font-black mt-6 break-words">

          {user?.name || "Guest User"}

        </h1>

        <p className="text-gray-400 tracking-[2px] mt-3 text-sm break-all">

          {user?.email || "No Email Found"}

        </p>

        <div className="mt-8 flex items-center justify-center gap-3">

          <div className="px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-400/20 text-emerald-300 text-xs uppercase tracking-[2px]">

            Active User

          </div>

        </div>

      </div>

    </div>

    {/* ACTIVITY */}

    <div className="border border-white/10 bg-white/[0.03] backdrop-blur-2xl rounded-[35px] p-6">

      <div className="flex items-center justify-between mb-8">

        <h1 className="text-2xl font-black uppercase tracking-[4px]">

          Recent Activity

        </h1>

        <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></div>

      </div>

      <div className="space-y-4">

        {[
          `✅ ${completed} tasks completed`,
          `📌 ${pending} pending tasks`,
          `📂 ${todos.length} total workflow items`,
          `🚀 Productivity at ${Math.round(progress)}%`,
        ].map((item, index) => (

          <div
            key={index}
            className="bg-black/30 border border-white/10 p-5 rounded-2xl hover:bg-white/[0.04] transition duration-300"
          >

            {item}

          </div>

        ))}

      </div>

    </div>

    {/* STORAGE */}

    <div className="border border-white/10 bg-white/[0.03] backdrop-blur-2xl rounded-[35px] p-6">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-gray-400 uppercase tracking-[3px] text-xs">

            Productivity Score

          </p>

          <h1 className="text-5xl font-black mt-3">

            {Math.round(progress)}%

          </h1>

        </div>

        <div className="text-5xl">

          💾

        </div>

      </div>

      <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden mt-8">

        <div
          className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full transition-all duration-700"
          style={{
            width: `${progress}%`,
          }}
        ></div>

      </div>

    </div>

  </div>

</div>

      </div>

    </div>
  );
}

export default Dashboard;