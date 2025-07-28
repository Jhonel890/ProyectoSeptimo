import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GET } from "../../utils/methods";
import "./styles.css"; // estilo separado para mejor organización

const PostulacionesPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [postulaciones, setPostulaciones] = useState([]);
  const [trabajo, setTrabajo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState(null);

  useEffect(() => {
    const fetchPostulaciones = async () => {
      try {
        setLoading(true);
        const response = await GET(`/trabajo/listarOfertas/${id}`);
        if (response.success) {
          setPostulaciones(response.data.ofertas || []);
          setTrabajo(response.data.trabajo);
        } else {
          throw new Error(response.message || "Error al obtener postulaciones");
        }
      } catch (err) {
        setServerError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPostulaciones();
  }, [id]);

  const handleVolver = () => {
    navigate(-1);
  };

  if (loading) return (
    <div className="loading-wrapper">
      <div className="spinner"></div>
      <p>Cargando postulaciones...</p>
    </div>
  );

  if (serverError) return (
    <div className="error-wrapper">
      <h2>Error al obtener postulaciones</h2>
      <p>{serverError}</p>
      <button onClick={handleVolver} className="btn btn-secondary">Volver</button>
    </div>
  );

  return (
    <div className="postulaciones-container">
      <header className="postulaciones-header">
        <h1>📋 Postulaciones para: <span className="highlight">{trabajo?.titulo}</span></h1>
        <p>
          {postulaciones.length > 0
            ? `Se han recibido ${postulaciones.length} postulacione${postulaciones.length > 1 ? 's' : ''}`
            : "Este trabajo aún no tiene postulaciones"}
        </p>
      </header>

      {postulaciones.length === 0 ? (
        <div className="empty-state">
          <p>No hay postulaciones por el momento.</p>
          <button onClick={handleVolver} className="btn btn-secondary">Volver</button>
        </div>
      ) : (
        <section className="postulaciones-list">
          {postulaciones.map(({ id, trabajador, estado, precondiciones, hora_visita, fecha_visita, createdAt }) => (
            <article key={id} className="postulacion-card">
              <div className="postulacion-header">
                <h3>{trabajador?.nombres} {trabajador?.apellidos}</h3>
                <span className={`estado-badge estado-${estado.toLowerCase()}`}>
                  {estado}
                </span>
              </div>
              <div className="postulacion-body">
                <p><strong>Precondiciones:</strong> {precondiciones || "Ninguna"}</p>
                <p><strong>Hora de visita:</strong> {new Date(hora_visita).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                <p><strong>Fecha de visita:</strong> {new Date(fecha_visita).toLocaleDateString()}</p>
                <p><strong>Postulado el:</strong> {new Date(createdAt).toLocaleString()}</p>
              </div>
            </article>
          ))}
        </section>
      )}

      <footer className="postulaciones-footer">
        <button onClick={handleVolver} className="btn btn-secondary">← Volver</button>
      </footer>
    </div>
  );
};

export default PostulacionesPage;
