import { useEffect, useState } from "react";
import axios from "axios";

function TodoDrag() {
  const [todos, setTodos] = useState([]);
  const [draggingId, setDraggingId] =
    useState(null);

  const token =
    localStorage.getItem("token");

  const API =
    "http://localhost:5000/api/todos";

  /* ================= FETCH TODOS ================= */

  useEffect(() => {
    fetchTodos();
  }, []);

const fetchTodos = async () => {
  try {
    const res = await axios.get(API, {
      headers: {
        Authorization: token,
      },
    });

    setTodos(res.data || []);
  } catch (error) {
    console.log(error);
  }
};

  /* ================= DRAG START ================= */

  const handleDragStart = (
    e,
    id
  ) => {
    setDraggingId(id);

    e.dataTransfer.setData(
      "todoId",
      id
    );
  };

  /* ================= DROP ================= */

const handleDrop = async (
  e,
  status
) => {
  e.preventDefault();

  const id =
    e.dataTransfer.getData(
      "todoId"
    );

  try {
    const completed =
      status === "done";

    const res = await axios.put(
      `${API}/${id}`,
      {
        status,
        completed,
      },
      {
        headers: {
          Authorization: token,
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

    setDraggingId(null);
  } catch (error) {
    console.log(error);
  }
};

  /* ================= ALLOW DROP ================= */

  const allowDrop = (e) => {
    e.preventDefault();
  };

  /* ================= FILTER ================= */

  const todoTasks = todos.filter(
    (t) => t.status === "todo"
  );

  const progressTasks =
    todos.filter(
      (t) => t.status === "progress"
    );

  const doneTasks = todos.filter(
    (t) => t.status === "done"
  );

  /* ================= COLUMN COMPONENT ================= */

  const Column = ({
    title,
    icon,
    tasks,
    status,
    color,
    badge,
  }) => (
    <div
      onDrop={(e) =>
        handleDrop(e, status)
      }
      onDragOver={allowDrop}
      className={`relative overflow-hidden rounded-[35px] border min-h-[650px] p-5 backdrop-blur-2xl transition duration-300 ${color}`}
    >

      {/* GLOW */}

      <div className="absolute top-[-60px] right-[-60px] w-[180px] h-[180px] bg-white/[0.04] rounded-full blur-3xl" />

      {/* HEADER */}

      <div className="relative z-10 flex items-center justify-between mb-8">

        <div>

          <h1 className="text-2xl font-black tracking-[4px] uppercase">

            {title}

          </h1>

          <p className="text-xs uppercase tracking-[3px] text-gray-400 mt-2">

            {tasks.length} Tasks

          </p>

        </div>

        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${badge}`}
        >

          {icon}

        </div>

      </div>

      {/* TASKS */}

      <div className="relative z-10 space-y-5">

        {tasks.length === 0 ? (
          <div className="h-[220px] border border-dashed border-white/10 rounded-[30px] flex items-center justify-center text-center text-gray-500 tracking-[3px] uppercase text-sm">

            Drop Tasks Here

          </div>
        ) : (
          tasks.map((todo) => (

            <div
              key={todo._id}
              draggable
              onDragStart={(e) =>
                handleDragStart(
                  e,
                  todo._id
                )
              }
              className={`group cursor-grab active:cursor-grabbing rounded-[28px] border p-5 transition duration-300 hover:-translate-y-1 ${
                draggingId ===
                todo._id
                  ? "opacity-50 scale-95"
                  : ""
              } ${
                status === "todo"
                  ? "border-red-400/20 bg-red-500/5 hover:bg-red-500/10"
                  : status ===
                    "progress"
                  ? "border-cyan-400/20 bg-cyan-500/5 hover:bg-cyan-500/10"
                  : "border-emerald-400/20 bg-emerald-500/5 hover:bg-emerald-500/10"
              }`}
            >

              <div className="flex items-start justify-between gap-4">

                <h1
                  className={`text-lg md:text-xl font-bold break-words leading-relaxed ${
                    status === "done"
                      ? "line-through text-emerald-300"
                      : "text-white"
                  }`}
                >

                  {todo.text}

                </h1>

                <div className="text-2xl opacity-60 group-hover:opacity-100 transition">

                  ☰

                </div>

              </div>

              <div className="mt-6 flex items-center justify-between gap-4 flex-wrap">

                <span
                  className={`px-4 py-2 rounded-full border text-xs uppercase tracking-[2px] ${
                    status === "todo"
                      ? "bg-red-500/10 border-red-400/30 text-red-300"
                      : status ===
                        "progress"
                      ? "bg-cyan-500/10 border-cyan-400/30 text-cyan-300"
                      : "bg-emerald-500/10 border-emerald-400/30 text-emerald-300"
                  }`}
                >

                  {status === "todo"
                    ? "Pending"
                    : status ===
                      "progress"
                    ? "In Progress"
                    : "Completed"}

                </span>

                <span className="text-xs uppercase tracking-[3px] text-gray-500">

                  Drag Task

                </span>

              </div>

            </div>

          ))
        )}

      </div>

    </div>
  );

  return (
    <div className="min-h-screen bg-[#030303] text-white relative overflow-hidden">

      {/* ================= BACKGROUND ================= */}

      <div className="fixed inset-0 -z-10 overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-br from-[#07120d] via-black to-[#08111d]" />

        <div className="absolute top-[-200px] left-[-150px] w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-3xl" />

        <div className="absolute bottom-[-200px] right-[-150px] w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-3xl" />

      </div>

      {/* ================= MAIN ================= */}

      <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* ================= HEADER ================= */}

        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

          <div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-thin tracking-[4px] sm:tracking-[8px] uppercase leading-tight">

              Drag{" "}

              <span className="font-black">

                Board

              </span>

            </h1>

            <p className="text-gray-400 tracking-[3px] uppercase mt-4 text-xs sm:text-sm">

              Smart Drag & Drop Task
              Workflow System

            </p>

          </div>

          <button
            onClick={fetchTodos}
            className="h-[58px] px-8 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-black font-black tracking-[2px] uppercase hover:scale-[1.03] transition duration-300 shadow-lg shadow-emerald-500/20"
          >

            Refresh Board

          </button>

        </div>

        {/* ================= STATS ================= */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

          <div className="rounded-[32px] border border-red-400/20 bg-red-500/10 backdrop-blur-2xl p-6">

            <p className="text-red-300 uppercase tracking-[3px] text-sm">

              Todo

            </p>

            <h1 className="text-5xl font-black mt-5">

              {todoTasks.length}

            </h1>

          </div>

          <div className="rounded-[32px] border border-cyan-400/20 bg-cyan-500/10 backdrop-blur-2xl p-6">

            <p className="text-cyan-300 uppercase tracking-[3px] text-sm">

              Progress

            </p>

            <h1 className="text-5xl font-black mt-5 text-cyan-400">

              {progressTasks.length}

            </h1>

          </div>

          <div className="rounded-[32px] border border-emerald-400/20 bg-emerald-500/10 backdrop-blur-2xl p-6">

            <p className="text-emerald-300 uppercase tracking-[3px] text-sm">

              Done

            </p>

            <h1 className="text-5xl font-black mt-5 text-emerald-400">

              {doneTasks.length}

            </h1>

          </div>

        </div>

        {/* ================= BOARD ================= */}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">

          <Column
            title="Todo"
            icon="📌"
            tasks={todoTasks}
            status="todo"
            color="border-red-400/10 bg-white/[0.03]"
            badge="bg-red-500/20"
          />

          <Column
            title="Progress"
            icon="⚡"
            tasks={progressTasks}
            status="progress"
            color="border-cyan-400/10 bg-white/[0.03]"
            badge="bg-cyan-500/20"
          />

          <Column
            title="Done"
            icon="✅"
            tasks={doneTasks}
            status="done"
            color="border-emerald-400/10 bg-white/[0.03]"
            badge="bg-emerald-500/20"
          />

        </div>

        {/* ================= FOOTER ================= */}

        <div className="py-10 text-center">

          <p className="text-gray-500 tracking-[3px] uppercase text-xs sm:text-sm">

            Smart Drag Dashboard •
            Futuristic UI Design

          </p>

        </div>

      </div>

    </div>
  );
}

export default TodoDrag;