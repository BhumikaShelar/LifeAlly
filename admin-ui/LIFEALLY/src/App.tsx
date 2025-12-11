import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Queries from "./pages/Queries";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import UserView from "./pages/UserView";
import "./index.css";

function PrivateRoute({ children }: { children: React.ReactElement }) {
  const isLoggedIn = !!sessionStorage.getItem("adminUserId");
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        {/* Sidebar includes the brand text (LifeAlly Admin). Do not duplicate it here. */}
        <Sidebar />
      </aside>

      <div style={{ flex: 1 }}>
        <Topbar />
        <main className="main-content">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<PrivateRoute><Navigate to="/dashboard" replace /></PrivateRoute>} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/users" element={<PrivateRoute><Users /></PrivateRoute>} />
            <Route path="/users/:id" element={<PrivateRoute><UserView /></PrivateRoute>} />
            <Route path="/queries" element={<PrivateRoute><Queries /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="*" element={<div>404 — Not Found</div>} />
          </Routes>
        </main>
      </div>
    </div>
  );
}