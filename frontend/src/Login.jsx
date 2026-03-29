// TEMPORAL HASTA TENER LOGIN EN BACKEND
import { useState } from "react";
import "./login.css";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("operario");

  const handleSubmit = (e) => {
    e.preventDefault();

    // fake login → send data to App.jsx
    onLogin({
      username,
      role,
    });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo">📦</div>

        <h1>
          <span className="red">Logi</span>
          <span className="black">Track</span>
        </h1>

        <p className="subtitle">Sistema de Gestión de Envíos</p>

        <form onSubmit={handleSubmit}>
          <label>Usuario</label>
          <input
            type="text"
            placeholder="Ingresa tu nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label>Selecciona tu rol</label>

          <div className="roles">
            <div
              className={`role ${role === "operario" ? "active" : ""}`}
              onClick={() => setRole("operario")}
            >
              👤
              <span>Operario</span>
            </div>

            <div
              className={`role ${role === "supervisor" ? "active" : ""}`}
              onClick={() => setRole("supervisor")}
            >
              🛡️
              <span>Supervisor</span>
            </div>
          </div>

          <button type="submit">Iniciar Sesión</button>
        </form>

        <div className="footer">
          Prototipo navegable - LogiTrack ERP © 2026
        </div>
      </div>
    </div>
  );
}

// LOGICA REAL, DEPENDE DE BACKEND
/*import { useState } from "react";
import "./login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("operario");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      username,
      role,
    };

    try {
      const res = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("Login response:", data);
    } catch (err) {
      console.error("Error:", err);
    }
  };
  

  return (
    <div className="container">
      <div className="card">
        <div className="logo">📦</div>

        <h1>
          <span className="red">Logi</span>Track
        </h1>
        <p className="subtitle">Sistema de Gestión de Envíos</p>

        <form onSubmit={handleSubmit}>
          <label>Usuario</label>
          <input
            type="text"
            placeholder="Ingresa tu nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label>Selecciona tu rol</label>

          <div className="roles">
            <div
              className={`role ${role === "operario" ? "active" : ""}`}
              onClick={() => setRole("operario")}
            >
              👤
              <span>Operario</span>
            </div>

            <div
              className={`role ${role === "supervisor" ? "active" : ""}`}
              onClick={() => setRole("supervisor")}
            >
              🛡️
              <span>Supervisor</span>
            </div>
          </div>

          <button type="submit">Iniciar Sesión</button>
        </form>

        <div className="footer">
          Prototipo navegable - LogiTrack ERP © 2026
        </div>
      </div>
    </div>
  );
}*/