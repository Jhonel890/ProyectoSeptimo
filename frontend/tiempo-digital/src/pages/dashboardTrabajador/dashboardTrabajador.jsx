import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GET } from "../../utils/methods";
import useGetUser from "../../hooks/useGetUser";
import AsociarOficioPage from "../asociarOficio/asociarOficio";
import PostularTrabajoPage from "../postularTrabajo/postularTrabajo";
import "./styles.css";

const PreguntasPage = () => {
  const navigate = useNavigate();
  const [showAsociarOficio, setShowAsociarOficio] = useState(false);
  const [showPostularTrabajo, setShowPostularTrabajo] = useState(false);
  const [selectedTrabajoExternalId, setSelectedTrabajoExternalId] = useState(null);
  const [trabajos, setTrabajos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedOficio, setSelectedOficio] = useState(null);
  const [selectedOficioInfo, setSelectedOficioInfo] = useState(null);
  const user = useGetUser();

  // Cargar trabajos cuando se selecciona un oficio
  useEffect(() => {
    const fetchTrabajos = async () => {
      if (!selectedOficio) return;

      const token = localStorage.getItem("token");
      console.log("Token de autenticación:", token);

      try {
        setLoading(true);
        setError(null);
        setTrabajos([]);
        setSelectedOficioInfo(null);

        const response = await GET(`/oficio/${selectedOficio}`);

        if (!response || !response.data) {
          throw new Error("No se recibieron datos del servicio");
        }

        setSelectedOficioInfo(response.data);

        const trabajosData = Array.isArray(response.data.trabajos)
          ? response.data.trabajos
          : response.data.trabajos
            ? [response.data.trabajos]
            : [];

        setTrabajos(trabajosData);

      } catch (err) {
        console.error("Error obteniendo trabajos:", err);
        setError(err.message || "Error al cargar trabajos");
      } finally {
        setLoading(false);
      }
    };

    fetchTrabajos();
  }, [selectedOficio]);

  // Seleccionar el primer oficio al cargar el usuario
  useEffect(() => {
    if (user?.oficios?.length > 0 && !selectedOficio) {
      setSelectedOficio(user.oficios[0].external_id);
    }
  }, [user, selectedOficio]);

  const handleCreateQuestion = () => {
    setShowAsociarOficio(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("rol");
    localStorage.removeItem("external_id");
    navigate("/");
  };

  const handleOficioChange = (oficioId) => {
    setSelectedOficio(oficioId);
  };

  const handlePostularClick = (trabajoExternalId) => {
    if (!trabajoExternalId) {
      console.error("No se proporcionó un external_id válido para el trabajo");
      setError("No se pudo identificar el trabajo seleccionado");
      return;
    }
    console.log("Postulando a trabajo con external_id:", trabajoExternalId);
    setSelectedTrabajoExternalId(trabajoExternalId);
    setShowPostularTrabajo(true);
  };

  const getEstadoColor = (estado) => {
    if (!estado) return '#6b7280';

    switch (estado.toLowerCase()) {
      case 'activo': return '#10b981';
      case 'postulado': return '#f59e0b';
      case 'completado': return '#3b82f6';
      case 'cancelado': return '#ef4444';
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

  const oficiosDisponibles = user.oficios || [];

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
              <span>Asociar Oficios</span>
            </li>
            <li className="nav-item" onClick={() => navigate("/ofertasPersona")}>
              <span className="nav-icon">📄</span> {/* Puedes poner un ícono */}
              <span>Oficios Aplicados</span>
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
              <div className="profile-role">
                {oficiosDisponibles.length} oficio(s) asociado(s)
              </div>
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
          <h1 className="section-title">💼 Trabajos Disponibles</h1>

          <div className="oficios-selector-container">
            <label>Selecciona un oficio:</label>
            <select
              value={selectedOficio || ''}
              onChange={(e) => handleOficioChange(e.target.value)}
              className="oficio-select"
              disabled={loading || oficiosDisponibles.length === 0}
            >
              {oficiosDisponibles.length === 0 ? (
                <option value="">No tienes oficios asociados</option>
              ) : (
                oficiosDisponibles.map(oficio => (
                  <option key={oficio.external_id} value={oficio.external_id}>
                    {oficio.nombre}
                  </option>
                ))
              )}
            </select>
          </div>

          {selectedOficioInfo && (
            <p className="section-subtitle">
              Mostrando trabajos para: {selectedOficioInfo.nombre} - {selectedOficioInfo.descripcion}
            </p>
          )}
        </div>

        {oficiosDisponibles.length === 0 ? (
          <div className="empty-state">
            <p>No tienes oficios asociados</p>
            <button
              className="btn-primary"
              onClick={handleCreateQuestion}
            >
              Asociar Oficio
            </button>
          </div>
        ) : loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Cargando trabajos...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button
              className="btn-primary"
              onClick={() => selectedOficio && handleOficioChange(selectedOficio)}
            >
              Reintentar
            </button>
          </div>
        ) : trabajos.length === 0 ? (
          <div className="empty-state">
            <p>No hay trabajos disponibles para {selectedOficioInfo?.nombre || 'este oficio'}</p>
          </div>
        ) : (
          <div className="grid-container">
            {trabajos.map((trabajo) => {
              if (!trabajo || !trabajo.external_id) {
                console.warn("Trabajo sin external_id:", trabajo);
                return null;
              }

              return (
                <div key={trabajo.external_id} className="card">
                  <div className="card-header">
                    <div className="card-icon-container">
                      <span className="card-icon">🛠️</span>
                    </div>
                    <div
                      className="estado-badge"
                      style={{ backgroundColor: getEstadoColor(trabajo.estado) }}
                    >
                      {trabajo.estado || 'Sin estado'}
                    </div>
                  </div>

                  <div className="card-content">
                    <h3 className="card-title">{trabajo.titulo_trabajo || 'Título no disponible'}</h3>
                    <p className="card-description">{trabajo.descripcion || 'Descripción no disponible'}</p>

                    <div className="card-meta">
                      <div className="meta-item">
                        <span className="meta-label">Fechas:</span>
                        <span className="meta-value">
                          {trabajo.fecha_inicio
                            ? new Date(trabajo.fecha_inicio).toLocaleDateString()
                            : 'No especificada'} -
                          {trabajo.fecha_fin
                            ? new Date(trabajo.fecha_fin).toLocaleDateString()
                            : 'No especificada'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="card-footer">
                    <button
                      className="primary-button"
                      onClick={() => handlePostularClick(trabajo.external_id)}
                      disabled={!trabajo.external_id}
                    >
                      Aplicar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showAsociarOficio && (
        <div className="modal-overlay">
          <div className="modal-content">
            <AsociarOficioPage
              onClose={() => setShowAsociarOficio(false)}
              onSuccess={() => {
                setShowAsociarOficio(false);
                // Recargar los oficios del usuario si es necesario
              }}
            />
          </div>
        </div>
      )}

      {showPostularTrabajo && (
        <div className="modal-overlay">
          <div className="modal-content">
            <PostularTrabajoPage
              onClose={() => setShowPostularTrabajo(false)}
              trabajoExternalId={selectedTrabajoExternalId}
              onSuccess={() => {
                setShowPostularTrabajo(false);
                // Recargar los trabajos después de postular
                if (selectedOficio) {
                  handleOficioChange(selectedOficio);
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PreguntasPage;