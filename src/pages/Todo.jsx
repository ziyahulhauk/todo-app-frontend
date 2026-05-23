import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  FaTasks,
  FaSync,
  FaTrash,
  FaCheckCircle,
  FaEdit,
} from "react-icons/fa";
function Todo() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] =
    useState("all");

  const [loading, setLoading] =
    useState(false);

    const [editingId, setEditingId] =
  useState(null);

const [editText, setEditText] =
  useState("");
  const token =
    localStorage.getItem("token");

  const API =
    "http://localhost:5000/api/todos";

  /* ================= FETCH TODOS ================= */

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    setLoading(true);

    try {
      const res = await axios.get(API, {
        headers: {
          Authorization: token,
        },
      });

      setTodos(res.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= ADD TODO ================= */

  const addTodo = async () => {
    if (!text.trim()) return;

    try {
      const res = await axios.post(
        API,
        { text },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      setTodos((prev) => [
        res.data,
        ...prev,
      ]);

      setText("");
    } catch (error) {
      console.log(error);
    }
  };




  /* ================= EDIT TODO ================= */

const editTodo = (todo) => {
  setEditingId(todo._id);

  setEditText(todo.text);
};
  /* ================= SAVE EDIT ================= */

const saveEdit = async (id) => {
  if (!editText.trim()) return;

  try {
    const res = await axios.put(
      `${API}/${id}`,
      {
        text: editText,
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

    setEditingId(null);

    setEditText("");
  } catch (error) {
    console.log(error);
  }
};

  /* ================= COMPLETE TODO ================= */

  const toggleComplete = async (
    id,
    completed
  ) => {
    try {
      await axios.put(
        `${API}/${id}`,
        {
          completed: !completed,
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
            ? {
                ...todo,
                completed:
                  !todo.completed,
              }
            : todo
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  /* ================= DELETE TODO ================= */

  const deleteTodo = async (id) => {
    try {
      await axios.delete(
        `${API}/${id}`,
        {
          headers: {
            Authorization: token,
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

  /* ================= FILTER ================= */

  const filteredTodos = useMemo(() => {
    return todos
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
          .includes(
            search.toLowerCase()
          )
      );
  }, [todos, search, filter]);

  /* ================= STATS ================= */

  const completed =
    todos.filter((t) => t.completed)
      .length;

  const pending =
    todos.length - completed;

  const progress = todos.length
    ? Math.round(
        (completed / todos.length) *
          100
      )
    : 0;

  return (
    <div className="min-h-screen bg-[#030303] text-white relative overflow-hidden">

      {/* ================= BACKGROUND ================= */}

      <div className="fixed inset-0 -z-10 overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-br from-[#06120d] via-black to-[#08111d]" />

        <div className="absolute top-[-200px] left-[-150px] w-[500px] h-[500px] rounded-full bg-emerald-500/20 blur-3xl" />

        <div className="absolute bottom-[-200px] right-[-150px] w-[500px] h-[500px] rounded-full bg-cyan-500/20 blur-3xl" />

      </div>

      {/* ================= MAIN ================= */}

      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* ================= HEADER ================= */}

        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

          <div className="min-w-0">

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-thin tracking-[4px] sm:tracking-[8px] uppercase leading-tight break-words">

              Todo{" "}

              <span className="font-black">

                Manager

              </span>

            </h1>

            <p className="text-gray-400 tracking-[2px] sm:tracking-[4px] uppercase mt-4 text-xs sm:text-sm">

              Smart Task Management
              System

            </p>

          </div>

          <button
            onClick={fetchTodos}
            className="h-[56px] px-8 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-black font-black tracking-[2px] uppercase hover:scale-[1.03] transition duration-300 shadow-lg shadow-emerald-500/20"
          >

            Refresh

          </button>

        </div>

        {/* ================= STATS ================= */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">

          <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-6">

            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl" />

            <p className="text-gray-400 uppercase tracking-[3px] text-sm">

              Total Tasks

            </p>

            <h1 className="text-5xl font-black mt-5">

              {todos.length}

            </h1>

          </div>

          <div className="relative overflow-hidden rounded-[32px] border border-emerald-400/20 bg-emerald-500/10 backdrop-blur-2xl p-6">

            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl" />

            <p className="text-emerald-300 uppercase tracking-[3px] text-sm">

              Completed

            </p>

            <h1 className="text-5xl font-black mt-5 text-emerald-400">

              {completed}

            </h1>

          </div>

          <div className="relative overflow-hidden rounded-[32px] border border-orange-400/20 bg-orange-500/10 backdrop-blur-2xl p-6">

            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl" />

            <p className="text-orange-300 uppercase tracking-[3px] text-sm">

              Pending

            </p>

            <h1 className="text-5xl font-black mt-5 text-orange-400">

              {pending}

            </h1>

          </div>

          <div className="relative overflow-hidden rounded-[32px] border border-cyan-400/20 bg-cyan-500/10 backdrop-blur-2xl p-6">

            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl" />

            <p className="text-cyan-300 uppercase tracking-[3px] text-sm">

              Progress

            </p>

            <h1 className="text-5xl font-black mt-5 text-cyan-400">

              {progress}%

            </h1>

          </div>

        </div>

        {/* ================= ADD TODO ================= */}

        <div className="mt-8 rounded-[35px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-5 sm:p-7">

          <div className="flex flex-col lg:flex-row gap-4">

            <input
              type="text"
              placeholder="Enter your task..."
              value={text}
              onChange={(e) =>
                setText(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addTodo();
                }
              }}
              className="flex-1 h-[60px] px-6 rounded-2xl bg-black/40 border border-white/10 outline-none focus:border-emerald-400 transition text-white placeholder:text-gray-500"
            />

            <button
              onClick={addTodo}
              className="h-[60px] px-10 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-black font-black tracking-[2px] uppercase hover:scale-[1.02] transition duration-300"
            >

              Add Task

            </button>

          </div>

        </div>

        {/* ================= FILTER ================= */}

        <div className="mt-8 rounded-[35px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-5 sm:p-7">

          <div className="flex flex-col lg:flex-row gap-4">

            <input
              type="text"
              placeholder="Search task..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="flex-1 h-[60px] px-6 rounded-2xl bg-black/40 border border-white/10 outline-none focus:border-cyan-400 transition text-white placeholder:text-gray-500"
            />

            <select
              value={filter}
              onChange={(e) =>
                setFilter(
                  e.target.value
                )
              }
              className="h-[60px] min-w-[220px] px-5 rounded-2xl bg-black/40 border border-white/10 outline-none text-white"
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

          </div>

        </div>

        {/* ================= TASK LIST ================= */}

       {/* ================= TASK LIST ================= */}

<div className="mt-8 rounded-[35px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-5 sm:p-7">

  {/* TOP */}

  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

    <div>

      <h1 className="text-2xl sm:text-3xl font-black tracking-[3px] uppercase">

        Task List

      </h1>

      <p className="text-gray-400 mt-2 text-sm tracking-[2px] uppercase">

        Manage your daily workflow

      </p>

    </div>

    <div className="flex flex-wrap items-center gap-3">

      <div className="px-5 py-3 rounded-2xl border border-white/10 bg-black/30 text-sm tracking-[2px] uppercase text-gray-300">

        Total : {filteredTodos.length}

      </div>

      <button
        onClick={fetchTodos}
        className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-black font-bold hover:scale-105 transition duration-300"
      >

        <FaSync />

        Refresh

      </button>

    </div>

  </div>

  {/* LOADING */}

  {loading ? (

    <div className="py-24 flex flex-col items-center justify-center">

      <div className="w-16 h-16 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>

      <p className="mt-6 uppercase tracking-[4px] text-gray-400 text-sm">

        Loading Tasks...

      </p>

    </div>

  ) : filteredTodos.length === 0 ? (

    /* EMPTY */

    <div className="border border-dashed border-white/10 rounded-[35px] py-24 text-center bg-black/20">

      <div className="w-24 h-24 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 flex items-center justify-center text-black text-5xl mx-auto">

        <FaTasks />

      </div>

      <h1 className="text-4xl font-black mt-8">

        No Tasks Found

      </h1>

      <p className="text-gray-400 mt-4 tracking-[3px] uppercase text-sm">

        Add your first productivity task

      </p>

    </div>

  ) : (

    /* TASKS */

    <div className="space-y-5">

      {filteredTodos.map((todo) => (

        <div
          key={todo._id}
          className={`group relative overflow-hidden rounded-[32px] border p-5 sm:p-6 transition duration-300 ${
            todo.completed
              ? "border-emerald-400/20 bg-emerald-500/10"
              : "border-white/10 bg-black/30 hover:bg-white/[0.05]"
          }`}
        >

          {/* BG EFFECT */}

          <div className="absolute top-0 right-0 w-40 h-40 bg-white/[0.03] rounded-full blur-3xl"></div>

          {/* CONTENT */}

          <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

            {/* LEFT */}

            <div className="flex-1 min-w-0">

              {/* TITLE */}

              <div className="flex flex-wrap items-center gap-3">

            
{editingId === todo._id ? (

  <div className="flex flex-col sm:flex-row gap-3 mt-2">

    <input
      type="text"
      value={editText}
      onChange={(e) =>
        setEditText(e.target.value)
      }
      className="flex-1 bg-black/40 border border-cyan-400 px-5 py-3 rounded-2xl outline-none text-white"
    />

    <button
      onClick={() =>
        saveEdit(todo._id)
      }
      className="px-6 py-3 rounded-2xl bg-cyan-500 text-black font-bold"
    >

      Save

    </button>

  </div>

) : (

  <h1
    className={`text-xl sm:text-2xl font-black leading-relaxed break-words ${
      todo.completed
        ? "line-through text-emerald-400"
        : "text-white"
    }`}
  >

    {todo.text}

  </h1>

)}
             

               {todo.completed ? (

  <span className="px-3 py-1 rounded-full text-[10px] uppercase tracking-[3px] bg-emerald-500 text-black font-bold">

    Completed

  </span>

) : (

  <span className="px-3 py-1 rounded-full text-[10px] uppercase tracking-[3px] bg-orange-500 text-black font-bold">

    Pending

  </span>

)}

              </div>

              {/* DESCRIPTION */}

              <p className="mt-4 text-gray-400 text-sm leading-relaxed">

                Stay focused and complete this task to improve your workflow productivity.

              </p>

              {/* TAGS */}

              <div className="flex flex-wrap gap-3 mt-5">

                <span className="px-4 py-2 rounded-full text-xs uppercase tracking-[2px] border border-cyan-400/20 bg-cyan-500/10 text-cyan-300">

                  📁 {todo.category || "General"}

                </span>

                <span className={`px-4 py-2 rounded-full text-xs uppercase tracking-[2px] ${
                  todo.priority === "High"
                    ? "border border-red-400/20 bg-red-500/10 text-red-300"
                    : todo.priority === "Medium"
                    ? "border border-yellow-400/20 bg-yellow-500/10 text-yellow-300"
                    : "border border-emerald-400/20 bg-emerald-500/10 text-emerald-300"
                }`}>

                  ⚡ {todo.priority || "Low"}

                </span>

              </div>

            </div>

            {/* ACTIONS */}

            <div className="relative z-10 flex items-center gap-3">

              {/* COMPLETE */}

              <button
                onClick={() =>
                  toggleComplete(
                    todo._id,
                    todo.completed
                  )
                }
                className={`w-14 h-14 rounded-2xl text-xl flex items-center justify-center transition duration-300 hover:scale-110 ${
                  todo.completed
                    ? "bg-yellow-500 text-black"
                    : "bg-emerald-500 text-black"
                }`}
              >

                {todo.completed ? (
                  <FaSync />
                ) : (
                  <FaCheckCircle />
                )}

              </button>

              {/* EDIT */}

              <button
                onClick={() => editTodo(todo)}
                className="w-14 h-14 rounded-2xl bg-cyan-500 text-black text-xl flex items-center justify-center hover:scale-110 transition duration-300"
              >

                <FaEdit />

              </button>

              {/* DELETE */}

              <button
                onClick={() =>
                  deleteTodo(todo._id)
                }
                className="w-14 h-14 rounded-2xl bg-red-500 text-white text-xl flex items-center justify-center hover:scale-110 transition duration-300"
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

        {/* ================= FOOTER ================= */}

        <div className="py-10 text-center">

          <p className="text-gray-500 tracking-[3px] uppercase text-xs sm:text-sm">

            Smart Todo Dashboard •
            Futuristic UI Design

          </p>

        </div>

      </div>

    </div>
  );
}

export default Todo;