import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CrearTrabajoPage from "../crearTrabajo/crearTrabajo";
import "./styles.css";

const PreguntasPage = () => {
  const [showCrearTrabajo, setShowCrearTrabajo] = useState(false);
  const navigate = useNavigate();

  const handleCreateQuestion = () => {
    setShowCrearTrabajo(true);
  };

  const handleLogout = () => {
    // Aquí puedes agregar la lógica para cerrar sesión
    // Por ejemplo, limpiar el token de autenticación y redirigir al login
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("rol");
    localStorage.removeItem("external_id");
    navigate("/");
  };

  const oficios = [
    {
      id: 1,
      titulo: "Reparación de Electrodomésticos este es de contratista ",
      descripcion: "Necesito reparar mi lavadora que no está centrifugando bien",
      oficio: "Técnico en Electrodomésticos",
      precio: "45-60",
      urgencia: "Alta",
      icon: "💡",
      rating: 4.8,
      trabajadores: 12
    },
    {
      id: 2,
      titulo: "Instalación de Pisos Laminados",
      descripcion: "Instalación completa de piso laminado en sala y dormitorios",
      oficio: "Carpintero",
      precio: "120-180",
      urgencia: "Media",
      icon: "🔨",
      rating: 4.9,
      trabajadores: 8
    },
    {
      id: 3,
      titulo: "Pintura Interior de Casa",
      descripcion: "Pintura completa de paredes interiores, 3 habitaciones",
      oficio: "Pintor",
      precio: "200-300",
      urgencia: "Baja",
      icon: "🎨",
      rating: 4.7,
      trabajadores: 15
    },
    {
      id: 4,
      titulo: "Reparación de Motor",
      descripcion: "Mi auto presenta fallas en el motor, necesito diagnóstico",
      oficio: "Mecánico Automotriz",
      precio: "80-150",
      urgencia: "Alta",
      icon: "🚗",
      rating: 4.6,
      trabajadores: 6
    },
    {
      id: 5,
      titulo: "Instalación de Plomería",
      descripcion: "Instalación de nueva tubería en baño principal",
      oficio: "Plomero",
      precio: "90-140",
      urgencia: "Media",
      icon: "🔧",
      rating: 4.8,
      trabajadores: 10
    },
    {
      id: 6,
      titulo: "Construcción de Terraza",
      descripcion: "Construcción de terraza de madera en patio trasero",
      oficio: "Constructor",
      precio: "400-600",
      urgencia: "Baja",
      icon: "🏠",
      rating: 4.9,
      trabajadores: 4
    }
  ];

  const getUrgenciaColor = (urgencia) => {
    switch (urgencia) {
      case 'Alta': return '#ef4444';
      case 'Media': return '#f59e0b';
      case 'Baja': return '#10b981';
      default: return '#6b7280';
    }
  };

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
          <div className="search-container">
          </div>
          <div className="profile-container">
            <div className="profile-info">
              <div className="profile-name">Juan Pérez</div>
              <div className="profile-role">Carpintero Profesional</div>
            </div>
            <div className="profile-avatar">
              <img
                src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
                alt="Avatar"
                className="avatar-image"
              />
              <div className="status-indicator"></div>
            </div>
          </div>
        </div>


        <div className="section-header" style={{ paddingRight: "100px" }}>
          <h1 className="section-title">💼 Trabajos que has publicado</h1>
          <p className="section-subtitle">
            Todos tus trabajos que has publicado están aquí. Puedes ver los detalles, aplicar a ellos o crear nuevos trabajos.
          </p>
        </div>

        <div className="grid-container">
          {oficios.map((oficio) => (
            <div key={oficio.id} className="card">
              <div className="card-header">
                <div className="card-icon-container">
                  <span className="card-icon">{oficio.icon}</span>
                </div>
                <div 
                  className="urgencia-badge" 
                  style={{ backgroundColor: getUrgenciaColor(oficio.urgencia) }}
                >
                  {oficio.urgencia}
                </div>
              </div>

              <div className="card-content">
                <h3 className="card-title">{oficio.titulo}</h3>
                <p className="card-description">{oficio.descripcion}</p>

                <div className="card-meta">
                  <div className="meta-item">
                    <span className="meta-label">Oficio:</span>
                    <span className="meta-value">{oficio.oficio}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Precio:</span>
                    <span className="meta-price">${oficio.precio}</span>
                  </div>
                </div>

                <div className="card-stats">
                  <div className="rating">
                    <span className="star-icon">⭐</span>
                    <span>{oficio.rating}</span>
                  </div>
                  <div className="workers">
                    <span>{oficio.trabajadores} profesionales disponibles</span>
                  </div>
                </div>
              </div>

              <div className="card-footer">
                <button className="outline-button">Ver Detalles</button>
                <button className="primary-button">Aplicar Ahora ➤</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showCrearTrabajo && (
        <div className="crear-trabajo-panel">
          <div className="crear-trabajo-panel-header">
            <button onClick={() => setShowCrearTrabajo(false)} className="cerrar-panel">✖</button>
          </div>
          <CrearTrabajoPage onClose={() => setShowCrearTrabajo(false)} />
        </div>
      )}
    </div>
  );
};

export default PreguntasPage;
