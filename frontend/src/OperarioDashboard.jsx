import "./operarioDashboard.css";

export default function OperarioDashboard() {
  const user = "user"; // mock for now

  const stats = [
    { label: "Total Envíos", value: 8 },
    { label: "En Tránsito", value: 5 },
    { label: "Entregados", value: 2 },
    { label: "Cancelados", value: 1 },
  ];

  const shipments = [
    {
      id: "LT-2026-001234",
      name: "Ana García Martínez",
      route: "Buenos Aires → Córdoba",
      status: "En Tránsito",
    },
    {
      id: "LT-2026-001235",
      name: "Carlos Rodríguez López",
      route: "Mendoza → Salta",
      status: "En Tránsito",
    },
    {
      id: "LT-2026-001236",
      name: "María Fernández Ruiz",
      route: "Mar del Plata → Buenos Aires",
      status: "Entregado",
    },
  ];

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
          <strong>28/3/2026</strong>
        </div>
      </div>

      {/* STATS */}
      <div className="stats">
        {stats.map((s, i) => (
          <div key={i} className="card">
            <p>{s.label}</p>
            <h3>{s.value}</h3>
          </div>
        ))}
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
            {shipments.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.name}</td>
                <td>{s.route}</td>
                <td>
                  <span className={`status ${s.status}`}>
                    {s.status}
                  </span>
                </td>
                <td className="action">Ver detalle →</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}