import { HashRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Home from "./pages/Home";
import Show from "./pages/Show";
import Add from "./pages/Add";

export default function App() {
  return (
    <HashRouter>
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
        <Route path="/" element={<Home />} />
        <Route path="/show" element={<Show />} />
        <Route path="/add" element={<Add />} />
      </Routes>
    </HashRouter>
  );
}
