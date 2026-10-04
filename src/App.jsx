import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import { Toaster } from "react-hot-toast";

import Home from "./pages/Home";
import Show from "./pages/Show";
import Add from "./pages/Add";
// import Signup from "./pages/Signup";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

import ProtectedRoute from "./components/ProtectedRoute";
import Nav from "./components/Nav";
import Control from "./pages/Control";

import Tmam from "./pages/Tmam";
import { getUsers } from "./utils/authCrypto";

import PageOffs from "./TmamPages/PageOffs";
import PageOtherRanks from "./TmamPages/PageOtherRanks";
import PageVacations from "./TmamPages/PageVacations";
import PageSickLeaves from "./TmamPages/PageSickLeaves";
import PageHospitals from "./TmamPages/PageHospitals";
import PageMissions from "./TmamPages/PageMissions";
import PageBands from "./TmamPages/PageBands";
import PageOutCenter from "./TmamPages/PageOutCenter";
import PageOutCountry from "./TmamPages/PageOutCountry";
import PageAbsence from "./TmamPages/PageAbsence";
import PagePrison from "./TmamPages/PagePrison";
import PagePeople from "./pages/PagePeople";

function AppContent() {
  const location = useLocation();

  const users = getUsers();

  const navPaths = [
    "/",
    "/tmam",
    "/tmam/pageOffs",
    "/tmam/pageOtherRanks",
    "/tmam/pageVacations",
    "/tmam/pageSickLeaves",
    "/tmam/pageHospitals",
    "/tmam/pageMissions",
    "/tmam/pageBands",
    "/tmam/pageOutCenter",
    "/tmam/pageOutCountry",
    "/tmam/pageAbsence",
    "/tmam/pagePrison",
    "/add",
    "/control",
  ];

  const showNav = navPaths.includes(location.pathname);

  return (
    <div className="min-h-screen bg-linear-to-br from-cyan-900 via-slate-900 to-black text-white">
      {showNav && <Nav />}

      <main>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* <Route path="/signup" element={<Signup />} /> */}

          <Route path="/" element={<Home />} />

          <Route path="/show" element={<Show />} />

          <Route path="/tmam" element={<Tmam />} />

          <Route path="/tmam/pageOffs" element={<PageOffs />} />

          <Route path="/tmam/pageOtherRanks" element={<PageOtherRanks />} />

          <Route path="/tmam/pageVacations" element={<PageVacations />} />

          <Route path="/tmam/pageSickLeaves" element={<PageSickLeaves />} />

          <Route path="/tmam/pageHospitals" element={<PageHospitals />} />

          <Route path="/tmam/pageMissions" element={<PageMissions />} />

          <Route path="/tmam/pageBands" element={<PageBands />} />

          <Route path="/tmam/pageOutCenter" element={<PageOutCenter />} />

          <Route path="/tmam/pageOutCountry" element={<PageOutCountry />} />

          <Route path="/tmam/pageAbsence" element={<PageAbsence />} />

          <Route path="/tmam/pagePrison" element={<PagePrison />} />

          <Route path="/people" element={<PagePeople />} />

          <Route
            path="/add"
            element={
              <ProtectedRoute>
                <Add />
              </ProtectedRoute>
            }
          />

          <Route
            path="/control"
            element={
              <ProtectedRoute>
                <Control />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
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

      <AppContent />
    </BrowserRouter>
  );
}
