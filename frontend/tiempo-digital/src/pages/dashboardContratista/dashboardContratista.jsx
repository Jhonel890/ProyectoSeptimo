import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CrearTrabajoPage from "../crearTrabajo/crearTrabajo";
import { GET } from "../../utils/methods";
import useGetUser from "../../hooks/useGetUser";
import "./styles.css";

const PreguntasPage = () => {
  const [showCrearTrabajo, setShowCrearTrabajo] = useState(false);
  const [trabajos, setTrabajos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const user = useGetUser();

  // Obtener trabajos del contratista
  useEffect(() => {
    const fetchTrabajos = async () => {
      try {
        if (!user?.external_id) return;

        setLoading(true);
        setError(null);

        const response = await GET(`/trabajo/${user.external_id}`);

        if (response.code === 200) {
          setTrabajos(response.data.trabajos || []);
        } else {
          throw new Error(response.message || "Error al obtener trabajos");
        }
      } catch (err) {
        console.error("Error obteniendo trabajos:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrabajos();
  }, [user, showCrearTrabajo]);

  const handleCreateQuestion = () => {
    setShowCrearTrabajo(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("rol");
    localStorage.removeItem("external_id");
    navigate("/");
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Postulado': return '#f59e0b';
      case 'Contratado': return '#3b82f6';
      case 'Finalizado': return '#10b981';
      case 'Cancelado': return '#ef4444';
      default: return '#6b7280';
    }
  };

  if (!user) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando información del usuario...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">🔨</span>
            <span>OficiosDigital</span>
          </div>
        </div>
        <nav className="nav">
          <ul className="nav-list">
            <li className="nav-item" onClick={handleCreateQuestion}>
              <span className="nav-icon">➕</span>
              <span>Crear Trabajo</span>
            </li>
            <li className="nav-item" onClick={handleLogout}>
              <span className="nav-icon">🚪</span>
              <span>Cerrar Sesión</span>
            </li>
          </ul>
        </nav>
      </aside>

      <div className="main-content">
        <div className="header">
          <div className="profile-container">
            <div className="profile-info">
              <div className="profile-name">{user.nombres} {user.apellidos}</div>
              <div className="profile-role">Contratista</div>
            </div>
            <div className="profile-avatar">
              <img
                src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
                alt="Avatar"
                className="avatar-image"
              />
            </div>
          </div>
        </div>

        <div className="section-header">
          <h1 className="section-title">💼 Trabajos que has publicado</h1>
          <p className="section-subtitle">
            {trabajos.length > 0
              ? `Tienes ${trabajos.length} trabajos publicados`
              : "No tienes trabajos publicados aún"}
          </p>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Cargando tus trabajos...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button
              className="btn-primary"
              onClick={() => window.location.reload()}
            >
              Reintentar
            </button>
          </div>
        ) : trabajos.length === 0 ? (
          <div className="empty-state">
            <p>No has publicado ningún trabajo todavía</p>
            <button
              className="btn-primary"
              onClick={handleCreateQuestion}
            >
              Crear mi primer trabajo
            </button>
          </div>
        ) : (
          <div className="grid-container">
            {trabajos.map((trabajo) => (
              <div key={trabajo.id} className="card">
                <div className="card-header">
                  <div className="card-icon-container">
                    <span className="card-icon">🛠️</span>
                  </div>
                  <div
                    className="estado-badge"
                    style={{ backgroundColor: getEstadoColor(trabajo.estado) }}
                  >
                    {trabajo.estado}
                  </div>
                </div>

                <div className="card-content">
                  <h3 className="card-title">{trabajo.titulo}</h3>
                  <p className="card-description">{trabajo.descripcion}</p>

                  <div className="card-meta">
                    <div className="meta-item">
                      <span className="meta-label">Fechas:</span>
                      <span className="meta-value">
                        {new Date(trabajo.fechas.inicio).toLocaleDateString()} - {trabajo.fechas.fin ? new Date(trabajo.fechas.fin).toLocaleDateString() : 'Sin fecha final'}
                      </span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Oficios:</span>
                      <span className="meta-value">
                        {trabajo.oficios.map(o => o.nombre).join(', ')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="card-footer">
                  <button
                    className="primary-button"
                    onClick={() => navigate(`/trabajo/postulaciones/${trabajo.id}`)}
                  >
                    {trabajo.estado === 'Postulado' ? 'Ver Postulaciones' : 'Administrar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showCrearTrabajo && (
        <div className="crear-trabajo-panel">
          <div className="crear-trabajo-panel-header">
            <button onClick={() => setShowCrearTrabajo(false)} className="cerrar-panel">✖</button>
          </div>
          <CrearTrabajoPage
            onClose={() => setShowCrearTrabajo(false)}
            onSuccess={() => {
              setShowCrearTrabajo(false); // Cierra el panel
              // Actualiza la lista de trabajos
              setTrabajos([]);
              setLoading(true);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default PreguntasPage;