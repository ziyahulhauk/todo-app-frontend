import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";

import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Todo from "./pages/Todo";
import TodoDrag from "./pages/TodoDrag";
import Settings from "./pages/Settings";
import ForgotPassword from "./pages/ForgotPassword";

/* ================= LAYOUT ================= */

function Layout() {
  const location = useLocation();

  // HIDE NAVBAR PAGES

  const hideNavbarPages = [
    "/",
    "/login",
    "/register",
    "/forgot-password",
  ];

  const hideNavbar =
    hideNavbarPages.includes(
      location.pathname
    );

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">

      {/* CONDITIONAL NAVBAR */}

      {!hideNavbar && <Navbar />}

      <Routes>

        {/* ================= AUTH ================= */}

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/forgot-password"
          element={
            <ForgotPassword />
          }
        />

        {/* ================= PROTECTED ================= */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/todo"
          element={
            <ProtectedRoute>
              <Todo />
            </ProtectedRoute>
          }
        />

        <Route
          path="/drag"
          element={
            <ProtectedRoute>
              <TodoDrag />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        {/* ================= FALLBACK ================= */}

        <Route
          path="*"
          element={<Login />}
        />

      </Routes>

    </div>
  );
}

/* ================= APP ================= */

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;