import { Routes, Route } from "react-router-dom";
import { useState,useEffect } from "react";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import LeadsPage from "./pages/LeadsPage";
import LandingPage from "./pages/LandingPage";
import BoardPage from "./pages/BoardPage";
import Adminpage from "./pages/Adminpage";
import ProtectedRoute from "./components/ProtectedRoute";


function App() {
const [user, setUser] = useState(null);

useEffect(() => {
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        setUser(null);
        return;
      }

      const data = await res.json();
      setUser(data);
    } catch (err) {
      setUser(null);
    }
  };

  fetchUser();
}, []);
  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Auth */}
      <Route path="/login" element={<LoginPage />} />

      <Route path="/register" element={<RegisterPage />} />

      {/* Layout Routes */}
      <Route path="/dashboard" element={<Layout />}>

        <Route index element={<DashboardPage />} />

        <Route path="leads" element={<LeadsPage />} />

        <Route path="board" element={<BoardPage />} />
         
         <Route path="admin" element={
           <ProtectedRoute user={user} role="admin">
          <Adminpage />
          </ProtectedRoute>
          } />
         

      </Route>

    </Routes>
  );
}

export default App;
