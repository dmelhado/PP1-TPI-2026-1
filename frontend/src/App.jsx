import { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./Login";
import OperarioDashboard from "./OperarioDashboard";
// import SupervisorDashboard from "./SupervisorDashboard";

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleLogin = (userData) => {
    setUser(userData);
    navigate("/dashboard"); // Move the user to the dashboard route after login
  };

  return (
    <Routes>
      {/* Public Route */}
      <Route 
        path="/login" 
        element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />} 
      />

      {/* Protected Route */}
      <Route 
        path="/dashboard" 
        element={
          user ? (
            user.role === "operario" ? (
              <OperarioDashboard user={user} />
            ) : (
              <div>Supervisor Dashboard Coming Soon</div>
            )
          ) : (
            <Navigate to="/login" /> // Redirect to login if trying to access dashboard while logged out
          )
        } 
      />

      {/* Default Route: Redirect anything else to login */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;