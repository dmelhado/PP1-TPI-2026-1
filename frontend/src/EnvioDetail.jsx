import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./envioDetail.css";

export default function EnvioDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShipment = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8080/api/envios/${id}`);
        
        if (!response.ok) {
          throw new Error("No se pudo encontrar el envío.");
        }
        
        const data = await response.json();
        setShipment(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchShipment();
  }, [id]);

  if (loading) return <div className="loading">Cargando detalles del envío...</div>;
  if (error) return <div className="error-msg">Error: {error} <button onClick={() => navigate("/dashboard")}>Volver</button></div>;
  if (!shipment) return null;

  return (
    <div className="details-page">
      <div className="back-link" onClick={() => navigate("/dashboard")}>
        ← Volver al listado
      </div>

      <div className="details-header card">
        <div>
          <h1>{shipment.trackingId}</h1>
          <p className="subtitle">Detalles del envío</p>
        </div>
        <div className="header-badges">
          <span className={`badge status-${shipment.estadoEnvio.toLowerCase()}`}>
            {shipment.estadoEnvio}
          </span>
          <span className="badge priority-urgent">
            Prioridad: {shipment.prioridadEnvio}
          </span>
        </div>
      </div>

      <div className="details-grid">
        <div className="column-main">
          <section className="card info-section">
            <h3>📍 Información de Ruta</h3>
            <div className="route-step">
              <label>Origen</label>
              <p>{shipment.origen}</p>
            </div>
            <div className="route-line"></div>
            <div className="route-step">
              <label>Destino</label>
              <p>{shipment.destino}</p>
            </div>
          </section>

          <section className="card info-section">
            <h3>👤 Información del Destinatario</h3>
            <div className="flex-row">
              <div className="input-box">
                <label>Nombre completo</label>
                <p>{shipment.destinatarioNombre}</p>
              </div>
              <div className="input-box">
                <label>Teléfono</label>
                <p>{shipment.destinatarioTelefono}</p>
              </div>
            </div>
          </section>

          <section className="card info-section">
            <h3>📦 Información del Paquete</h3>
            <div className="flex-row">
              <div className="stat-box">
                <span className="icon">⚖️</span>
                <div>
                  <label>Peso</label>
                  <p>{shipment.peso} kg</p>
                </div>
              </div>
              <div className="stat-box">
                <span className="icon">📏</span>
                <div>
                  <label>Dimensiones</label>
                  <p>{shipment.dimensiones}</p>
                </div>
              </div>
            </div>
            {shipment.notasAdicionales && (
              <div className="notes-box">
                <span className="icon">⚠️</span>
                <div>
                  <label>Notas importantes</label>
                  <p>{shipment.notasAdicionales}</p>
                </div>
              </div>
            )}
          </section>
        </div>

        <div className="column-side">
          <section className="card info-section">
            <h3>⏰ Fechas</h3>
            <div className="date-item">
              <label>Fecha de creación</label>
              <p>{new Date(shipment.fechaCreacion).toLocaleString()}</p>
            </div>
            <div className="date-item">
              <label>Entrega estimada</label>
              <p>{new Date(shipment.fechaEstimadaEntrega).toLocaleString()}</p>
            </div>
          </section>

          <section className="card info-section">
            <h3>Información Adicional</h3>
            <div className="date-item">
              <label>Creado por</label>
              <p>{shipment.creadoPor}</p>
            </div>
            <div className="date-item">
              <label>Tipo de Envío</label>
              <p>{shipment.tipoEnvio}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}