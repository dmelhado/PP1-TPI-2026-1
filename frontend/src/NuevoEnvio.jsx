import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./services/api";
import "./nuevoEnvio.css";

export default function NuevoEnvio({ user }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    origen: "",
    destino: "",
    destinatarioNombre: "",
    destinatarioTelefono: "",
    peso: "",
    dimensiones: "",
    tipoEnvio: "NORMAL",
    fechaEstimadaEntrega: "",
    notasAdicionales: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validación de direcciones (mínimo 6 caracteres)
    if (!formData.origen || formData.origen.trim().length < 6) {
      setError("El origen debe tener al menos 6 caracteres");
      setLoading(false);
      return;
    }
    if (!formData.destino || formData.destino.trim().length < 6) {
      setError("El destino debe tener al menos 6 caracteres");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        peso: parseFloat(formData.peso),
        creadoPor: user?.username || "operario-web"
      };

      const response = await api.post("/envios", payload);
      setSuccess(`¡Envío creado exitosamente! Tracking ID: ${response.data.trackingId}`);
      
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      setError(err?.response?.data?.message || "Error al crear el envío. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="nuevo-envio-container">
      <header className="form-header">
        <div className="header-icon">📦</div>
        <div>
          <h1>Nuevo Envío</h1>
          <p>Completa el formulario para registrar un nuevo envío en el sistema</p>
        </div>
      </header>

      <form className="envio-form card" onSubmit={handleSubmit}>
        {/* Sección: Ruta */}
        <section className="form-section">
          <h3>📍 Información de Ruta</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Origen *</label>
              <input 
                name="origen"
                placeholder="Ej: Buenos Aires, Argentina" 
                value={formData.origen}
                required 
                disabled={loading}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Destino *</label>
              <input 
                name="destino"
                placeholder="Ej: Córdoba, Argentina" 
                value={formData.destino}
                required 
                disabled={loading}
                onChange={handleChange}
              />
            </div>
          </div>
        </section>

        {/* Sección: Destinatario */}
        <section className="form-section">
          <h3>👤 Información del Destinatario</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Nombre completo *</label>
              <input 
                name="destinatarioNombre"
                placeholder="Ej: Ana García Martínez" 
                value={formData.destinatarioNombre}
                required 
                disabled={loading}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Teléfono *</label>
              <input 
                name="destinatarioTelefono"
                placeholder="Ej: +54 9 11 2345-6789" 
                value={formData.destinatarioTelefono}
                required 
                disabled={loading}
                onChange={handleChange}
              />
            </div>
          </div>
        </section>

        {/* Sección: Paquete */}
        <section className="form-section">
          <h3>📦 Información del Paquete</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Peso (kg) *</label>
              <input 
                name="peso"
                type="number" 
                step="0.1"
                placeholder="Ej: 5.5" 
                value={formData.peso}
                required 
                disabled={loading}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Dimensiones (cm) *</label>
              <input 
                name="dimensiones"
                placeholder="Ej: 40x30x20" 
                value={formData.dimensiones}
                required 
                disabled={loading}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Tipo de Envío *</label>
              <select name="tipoEnvio" value={formData.tipoEnvio} disabled={loading} onChange={handleChange}>
                <option value="NORMAL">Normal</option>
                <option value="EXPRESS">Express</option>
              </select>
            </div>
            <div className="form-group">
              <label>Fecha estimada de entrega *</label>
              <input 
                name="fechaEstimadaEntrega"
                type="datetime-local" 
                value={formData.fechaEstimadaEntrega}
                required 
                disabled={loading}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-group full-width">
            <label>Notas adicionales (opcional)</label>
            <textarea 
              name="notasAdicionales"
              placeholder="Ej: Frágil - Manejar con cuidado..." 
              value={formData.notasAdicionales}
              disabled={loading}
              onChange={handleChange}
            />
          </div>
        </section>

        <div className="info-alert">
          <strong>Información:</strong> Una vez creado el envío, se generará automáticamente un número de seguimiento único (tracking ID). El estado inicial será "PENDIENTE" y será creado por el usuario: <strong>{user?.username || "operario-web"}</strong>
        </div>

        {error && <div className="error-alert">❌ {error}</div>}
        {success && <div className="success-alert">✅ {success}</div>}

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={() => navigate("/dashboard")} disabled={loading}>
            Cancelar
          </button>
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Creando..." : "Crear Envío"}
          </button>
        </div>
      </form>
    </div>
  );
}