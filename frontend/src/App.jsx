import { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./Login";
import OperarioDashboard from "./OperarioDashboard";
import EnvioDetail from "./EnvioDetail"; // Make sure this is imported!
import NuevoEnvio from "./NuevoEnvio";
import Navbar from "./Navbar";

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleLogin = (userData) => {
    setUser(userData);
    navigate("/dashboard");
  };

  return (
    <>
    {user && <Navbar user={user} onLogout={setUser} />}

    <Routes>
      {/* 1. LOGIN ROUTE: If already logged in, skip login screen */}
      <Route 
        path="/login" 
        element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />} 
      />

      {/* 2. PROTECTED ROUTES: Only show if user exists */}
      <Route 
        path="/dashboard" 
        element={user ? <OperarioDashboard user={user} /> : <Navigate to="/login" />} 
      />

      <Route 
        path="/shipment/:id" 
        element={user ? <EnvioDetail user={user} /> : <Navigate to="/login" />} 
      />

      <Route 
      path="/nuevo-envio" 
      element={user ? <NuevoEnvio user={user} /> : <Navigate to="/login" />} 
      />

      {/* 3. FALLBACK: Send everything else to login */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
    </>
  );
}

export default App;