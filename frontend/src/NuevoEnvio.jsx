import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    prioridadEnvio: "Normal",
    fechaEstimadaEntrega: "",
    notasAdicionales: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder for future API call
    console.log("Datos del nuevo envío:", {
      ...formData,
      creadoPor: user?.username || "asdsad",
      estadoEnvio: "En Tránsito"
    });
    alert("¡Envío registrado con éxito! (Simulado)");
    navigate("/dashboard");
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
                required 
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Destino *</label>
              <input 
                name="destino"
                placeholder="Ej: Córdoba, Argentina" 
                required 
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
                required 
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Teléfono *</label>
              <input 
                name="destinatarioTelefono"
                placeholder="Ej: +54 9 11 2345-6789" 
                required 
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
                placeholder="Ej: 5.5" 
                required 
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Dimensiones (cm) *</label>
              <input 
                name="dimensiones"
                placeholder="Ej: 40x30x20" 
                required 
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Prioridad *</label>
              <select name="prioridadEnvio" onChange={handleChange}>
                <option value="Normal">Normal</option>
                <option value="Alta">Alta</option>
                <option value="Urgente">Urgente</option>
              </select>
            </div>
            <div className="form-group">
              <label>Fecha estimada de entrega *</label>
              <input 
                name="fechaEstimadaEntrega"
                type="datetime-local" 
                required 
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-group full-width">
            <label>Notas adicionales (opcional)</label>
            <textarea 
              name="notasAdicionales"
              placeholder="Ej: Frágil - Manejar con cuidado..." 
              onChange={handleChange}
            />
          </div>
        </section>

        <div className="info-alert">
          <strong>Información:</strong> Una vez creado el envío, se generará automáticamente un número de seguimiento único (tracking ID). El estado inicial será "En Tránsito" y será creado por el usuario: <strong>{user?.username || "asdsad"}</strong>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={() => navigate("/dashboard")}>
            Cancelar
          </button>
          <button type="submit" className="btn-submit">
            Crear Envío
          </button>
        </div>
      </form>
    </div>
  );
}