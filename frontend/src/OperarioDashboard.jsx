import { Link } from "react-router-dom";

import { useState, useEffect } from "react";
import axios from "axios";
import "./operarioDashboard.css";
import LogiTrackLogo from "./assets/LogiTrack_Logo_colored.png";

export default function OperarioDashboard({ user }) {
  // user viene de App.jsx con el nombre ingresado en login

  const [stats, setStats] = useState({
    total: 0,
    pendientes: 0,
    enTransito: 0,
    entregados: 0,
    cancelados: 0,
  });

  const [metricas, setMetricas] = useState(null);
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTrackingId, setSearchTrackingId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("todas");

  // Filtrar envíos según búsqueda y estado
  const filteredShipments = shipments.filter((s) => {
    const matchesSearch = s.id.toLowerCase().includes(searchTrackingId.toLowerCase());
    const matchesStatus = selectedStatus === "todas" || s.status.toLowerCase().replace(/[^a-z]/g, "") === selectedStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

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
        const pendientes = data.filter((e) =>
          ["PENDIENTE", "Pendiente"].includes(e.estadoEnvio)
        ).length;

        const enTransito = data.filter((e) =>
          ["EN_VIAJE", "EN_TRANSITO", "En Tránsito", "TRANSITO"].includes(e.estadoEnvio)
        ).length;

        const entregados = data.filter((e) =>
          ["ENTREGADO", "Entregado"].includes(e.estadoEnvio)
        ).length;

        const cancelados = data.filter((e) =>
          ["CANCELADO", "Cancelado"].includes(e.estadoEnvio)
        ).length;

        setStats({ total, pendientes, enTransito, entregados, cancelados });

        // Si es supervisor, obtener métricas
        if (user?.role === "supervisor") {
          try {
            const metricsResponse = await axios.get("http://localhost:8080/api/envios/metricas");
            setMetricas(metricsResponse.data);
          } catch (err) {
            console.warn("Advertencia: No se pudieron cargar las métricas", err);
          }
        }

      } catch (err) {
        console.error("Error completo:", err);
        setError(err.message || "Error al cargar los envíos");
      } finally {
        setLoading(false);
      }
    };

    fetchEnvios();
  }, [user?.role]);

  // Loading Screen
  if (loading) {
    return (
      <div className="dashboard">
        <div className="topbar">
          <div className="brand"><img src={LogiTrackLogo} alt="LogiTrack" className="topbar-logo" /> <span>LogiTrack</span></div>
          <div className="user-box">{user?.username}<span>Operario</span></div>
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
          <div className="brand"><img src={LogiTrackLogo} alt="LogiTrack" className="topbar-logo" /> <span>LogiTrack</span></div>
          <div className="user-box">{user?.username}<span>Operario</span></div>
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

      {/* HERO */}
      <div className="hero">
        <div>
          <h2>Bienvenido, {user?.username}</h2>
          <p>Panel de operaciones - {user?.role === "supervisor" ? "Gestión y análisis de envíos" : "Mis envíos"}</p>
        </div>
        <div className="date-box">
          <span>Fecha: </span>
          <strong>{new Date().toLocaleDateString("es-AR")}</strong>
        </div>
      </div>

      {/* MÉTRICAS PARA SUPERVISORES */}
      {user?.role === "supervisor" && metricas && (
        <div className="metrics-section">
          <h3>📊 Métricas de Operaciones</h3>
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-label">Envíos Pendientes</div>
              <div className="metric-value">{metricas.porcentajePendientes.toFixed(1)}%</div>
              <div className="metric-count">({stats.pendientes} envíos)</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">En Tránsito</div>
              <div className="metric-value">{metricas.porcentajeEnTransito.toFixed(1)}%</div>
              <div className="metric-count">({stats.enTransito} envíos)</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Entregados</div>
              <div className="metric-value">{metricas.porcentajeEntregados.toFixed(1)}%</div>
              <div className="metric-count">({stats.entregados} envíos)</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Cancelados</div>
              <div className="metric-value">{metricas.porcentajeCancelados.toFixed(1)}%</div>
              <div className="metric-count">({stats.cancelados} envíos)</div>
            </div>
            <div className="metric-card distance-card">
              <div className="metric-label">Distancia Total</div>
              <div className="metric-value">{metricas.distanciaTotal}</div>
              <div className="metric-unit">km</div>
            </div>
            <div className="metric-card volume-card">
              <div className="metric-label">Volumen Total</div>
              <div className="metric-value">{metricas.volumenTotal.toFixed(0)}</div>
            </div>
          </div>
        </div>
      )}

      {/* STATS - SOLO SUPERVISORES */}
      {user?.role === "supervisor" && (
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
      )}

      {/* BUSQUEDA - PARA TODOS */}
      <div className="search-filter">
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Buscar por Tracking ID..."
            value={searchTrackingId}
            onChange={(e) => setSearchTrackingId(e.target.value)}
            className="search-input"
          />
        </div>
        {/* FILTRO POR ESTADO - SOLO SUPERVISORES */}
        {user?.role === "supervisor" && (
          <div className="filter-box">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="filter-select"
            >
              <option value="todas">Todos ({stats.total})</option>
              <option value="pendiente">Pendiente ({stats.pendientes})</option>
              <option value="entransito">En Tránsito ({stats.enTransito})</option>
              <option value="entregado">Entregados ({stats.entregados})</option>
              <option value="cancelado">Cancelados ({stats.cancelados})</option>
            </select>
          </div>
        )}
      </div>

      <div className="table">
        <div className="table-header">
          <h3>Envíos ({filteredShipments.length})</h3>
          <button>Ver todos →</button>
        </div>

        {filteredShipments.length > 0 ? (
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
              {filteredShipments.map((s) => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.name}</td>
                  <td>{s.route}</td>
                  <td>
                    <span className={`status ${s.status.toLowerCase().replace(/[^a-z]/g, "")}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="action">
                    {/* Wrap the text in a Link component */}
                    <Link to={`/shipment/${s.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      Ver detalle →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <h3>📦 No hay envíos disponibles</h3>
            <p>{searchTrackingId ? "No se encontraron envíos que coincidan con tu búsqueda" : "Comienza registrando un nuevo envío"}</p>
          </div>
        )}
      </div>
    </div>
  );
}