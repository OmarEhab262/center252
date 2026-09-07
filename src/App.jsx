import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { Toaster } from "react-hot-toast";

import Home from "./pages/Home";
import Show from "./pages/Show";
import Add from "./pages/Add";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Control from "./pages/Control";

import { getUsers } from "./utils/authCrypto";

export default function App() {
  const users = getUsers();

  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            fontFamily: "Cairo, sans-serif",
            fontWeight: "bold",
            fontSize: "16px",
            direction: "rtl",
            textAlign: "right",
          },
        }}
      />

      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />

        <Route
          path="/signup"
          element={
            users.length === 0 ? <Signup /> : <Navigate to="/login" replace />
          }
        />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />

          <Route path="/show" element={<Show />} />

          <Route path="/add" element={<Add />} />

          <Route path="/control" element={<Control />} />
        </Route>

        {/* Unknown URLs */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
