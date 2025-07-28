import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GET } from "../../utils/methods";
import useGetUser from "../../hooks/useGetUser";
import "./styles.css";

const OficiosAplicadosPage = () => {
  const navigate = useNavigate();
  const user = useGetUser();

  const [postulaciones, setPostulaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !user.external_id) {
      setError("Usuario no autenticado");
      setLoading(false);
      return;
    }

    const fetchPostulaciones = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await GET(`/oferta/persona/${user.external_id}`);
        
        if (response.code !== 200) {
          throw new Error(response.message || "Error al obtener postulaciones");
        }
        
        setPostulaciones(response.data || []);
      } catch (err) {
        setError(err.message || "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchPostulaciones();
  }, [user]);

  const handleVolver = () => {
    navigate(-1);
  };

  const getEstadoColor = (estado) => {
    switch (estado?.toLowerCase()) {
      case "postulado": return "var(--color-warning)";
      case "aceptado": return "var(--color-success)";
      case "rechazado": return "var(--color-error)";
      default: return "var(--color-gray)";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No especificado";
    const date = new Date(dateString);
    return isNaN(date) ? "Fecha inválida" : date.toLocaleDateString();
  };

  const formatTime = (timeString) => {
    if (!timeString) return "No especificado";
    const time = new Date(timeString);
    return isNaN(time) ? "Hora inválida" : time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="table-container">
      <div className="table-header">
        <h1 className="table-title">📋 Mis Postulaciones</h1>
        <button 
          className="btn-back"
          onClick={handleVolver}
        >
          ← Volver
        </button>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Cargando postulaciones...</p>
        </div>
      ) : error ? (
        <div className="error-state">
          <p className="error-message">Error: {error}</p>
          <button 
            className="btn-retry"
            onClick={() => window.location.reload()}
          >
            Reintentar
          </button>
        </div>
      ) : postulaciones.length === 0 ? (
        <div className="empty-state">
          <p>No tienes postulaciones aún.</p>
          <button 
            className="btn-primary"
            onClick={() => navigate("/trabajos")}
          >
            Ver trabajos disponibles
          </button>
        </div>
      ) : (
        <div className="responsive-table">
          <table className="postulaciones-table">
            <thead>
              <tr>
                <th>Trabajo</th>
                <th>Estado</th>
                <th>Fecha Visita</th>
                <th>Hora Visita</th>
                <th>Precondiciones</th>
                <th>Fecha Postulación</th>
              </tr>
            </thead>
            <tbody>
              {postulaciones.map((postulacion) => (
                <tr key={postulacion.external_id}>
                  <td data-label="Trabajo">
                    {postulacion.trabajo?.titulo_trabajo || "Sin título"}
                  </td>
                  <td data-label="Estado">
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getEstadoColor(postulacion.estado) }}
                    >
                      {postulacion.estado}
                    </span>
                  </td>
                  <td data-label="Fecha Visita">{formatDate(postulacion.fecha_visita)}</td>
                  <td data-label="Hora Visita">{formatTime(postulacion.hora_visita)}</td>
                  <td data-label="Precondiciones">
                    {postulacion.precondiciones || "Ninguna"}
                  </td>
                  <td data-label="Postulación">
                    {formatDate(postulacion.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OficiosAplicadosPage;