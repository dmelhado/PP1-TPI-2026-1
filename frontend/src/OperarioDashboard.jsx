import { useState, useEffect } from "react";
import axios from "axios";
import "./operarioDashboard.css";

export default function OperarioDashboard() {
  const user = "user"; // Replace with real user later

  const [stats, setStats] = useState({
    total: 0,
    enTransito: 0,
    entregados: 0,
    cancelados: 0,
  });

  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEnvios = async () => {
      try {
        setLoading(true);
        setError(null);

        // Axios GET request
        const response = await axios.get("http://localhost:8080/api/envios");

        const data = response.data;   // This is the array []

        console.log("Datos recibidos:", data); // ← Helpful for debugging

        if (!Array.isArray(data)) {
          throw new Error("La respuesta no es un array");
        }

        // Transform data for the UI
        const transformedShipments = data.map((envio) => ({
          id: envio.trackingId || `LT-${envio.id}`,
          name: envio.destinatarioNombre || "Sin nombre",
          route: `${envio.origen} → ${envio.destino}`,
          status: envio.estadoEnvio || "PENDIENTE",
        }));

        setShipments(transformedShipments);

        // Calculate stats
        const total = data.length;
        const enTransito = data.filter((e) =>
          ["EN_VIAJE", "EN_TRANSITO", "En Tránsito", "TRANSITO"].includes(e.estadoEnvio)
        ).length;

        const entregados = data.filter((e) =>
          ["ENTREGADO", "Entregado"].includes(e.estadoEnvio)
        ).length;

        const cancelados = data.filter((e) =>
          ["CANCELADO", "Cancelado"].includes(e.estadoEnvio)
        ).length;

        setStats({ total, enTransito, entregados, cancelados });

      } catch (err) {
        console.error("Error completo:", err);
        setError(err.message || "Error al cargar los envíos");
      } finally {
        setLoading(false);
      }
    };

    fetchEnvios();
  }, []);

  // Loading Screen
  if (loading) {
    return (
      <div className="dashboard">
        <div className="topbar">
          <div className="brand">📦 <span>LogiTrack</span></div>
          <div className="user-box">{user}<span>Operario</span></div>
        </div>
        <div style={{ textAlign: "center", padding: "80px" }}>
          <p>Cargando envíos...</p>
        </div>
      </div>
    );
  }

  // Error Screen
  if (error) {
    return (
      <div className="dashboard">
        <div className="topbar">
          <div className="brand">📦 <span>LogiTrack</span></div>
          <div className="user-box">{user}<span>Operario</span></div>
        </div>
        <div style={{ textAlign: "center", padding: "80px", color: "red" }}>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Reintentar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* HEADER */}
      <div className="topbar">
        <div className="brand">
          📦 <span>LogiTrack</span>
        </div>
        <div className="user-box">
          {user}
          <span>Operario</span>
        </div>
      </div>

      {/* HERO */}
      <div className="hero">
        <div>
          <h2>Bienvenido, {user}</h2>
          <p>Panel de operaciones - Gestiona tus envíos diarios</p>
        </div>
        <div className="date-box">
          <span>Fecha</span>
          <strong>{new Date().toLocaleDateString("es-AR")}</strong>
        </div>
      </div>

      {/* STATS */}
      <div className="stats">
        <div className="card">
          <p>Total Envíos</p>
          <h3>{stats.total}</h3>
        </div>
        <div className="card">
          <p>En Tránsito</p>
          <h3>{stats.enTransito}</h3>
        </div>
        <div className="card">
          <p>Entregados</p>
          <h3>{stats.entregados}</h3>
        </div>
        <div className="card">
          <p>Cancelados</p>
          <h3>{stats.cancelados}</h3>
        </div>
      </div>

      {/* TABLE */}
      <div className="table">
        <div className="table-header">
          <h3>Envíos Recientes</h3>
          <button>Ver todos →</button>
        </div>

        <table>
          <thead>
            <tr>
              <th>N° Seguimiento</th>
              <th>Destinatario</th>
              <th>Origen → Destino</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {shipments.length > 0 ? (
              shipments.map((s) => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.name}</td>
                  <td>{s.route}</td>
                  <td>
                    <span className={`status ${s.status.toLowerCase().replace(/[^a-z]/g, "")}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="action">Ver detalle →</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "30px" }}>
                  No hay envíos disponibles
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}