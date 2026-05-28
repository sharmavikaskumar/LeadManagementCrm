import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import LeadsPage from "./pages/LeadsPage";
import LandingPage from "./pages/LandingPage";

function App() {
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

      </Route>

    </Routes>
  );
}

export default App;
