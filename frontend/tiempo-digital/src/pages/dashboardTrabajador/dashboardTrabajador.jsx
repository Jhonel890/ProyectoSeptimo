import React, { useState } from "react";

const PreguntasPage = () => {
  const [refetchTrigger, setRefetchTrigger] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Datos de ejemplo para oficios
  const oficios = [
    {
      id: 1,
      titulo: "Reparación de Electrodomésticos",
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
      descripción: "Instalación de nueva tubería en baño principal",
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

  const CompleteProfileModal = ({ onClose, onSubmit }) => (
    <div style={styles.modalOverlay}>
      <div style={styles.modal}>
        <h2 style={styles.modalTitle}>🎯 Completa tu Perfil Profesional</h2>
        <p style={styles.modalText}>
          Para acceder a los mejores trabajos, necesitamos conocer tus habilidades y oficios.
        </p>
        <div style={styles.modalButtons}>
          <button style={styles.modalButtonSecondary} onClick={onClose}>
            Más tarde
          </button>
          <button style={styles.modalButtonPrimary} onClick={onSubmit}>
            Completar ahora
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={styles.pageContainer}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>🔨</span>
            <span>OficiosDigital</span>
          </div>
        </div>
        <nav style={styles.nav}>
          <ul style={styles.navList}>
            <li style={styles.navItem}>
              <span style={styles.navIcon}>🏆</span>
              <span>Tareas Pendientes</span>
              <div style={styles.notificationBadge}>3</div>
            </li>
            <li style={styles.navItem}>
              <span style={styles.navIcon}>⭐</span>
              <span>Mis Soluciones</span>
            </li>
            <li style={styles.navItem}>
              <span style={styles.navIcon}>💰</span>
              <span>Mis Coins</span>
              <div style={styles.coinsBadge}>247</div>
            </li>
            <li style={styles.navItem}>
              <span style={styles.navIcon}>➕</span>
              <span>Crear Pregunta</span>
            </li>
            <li style={styles.navItem}>
              <span style={styles.navIcon}>👤</span>
              <span>Mi Perfil</span>
            </li>
          </ul>
        </nav>

        {/* Sidebar Stats */}
        <div style={styles.sidebarStats}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>📊</div>
            <div>
              <div style={styles.statNumber}>847</div>
              <div style={styles.statLabel}>Trabajos Completados</div>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>⭐</div>
            <div>
              <div style={styles.statNumber}>4.9</div>
              <div style={styles.statLabel}>Rating Promedio</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.searchContainer}>
            <span style={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Buscar por oficio, ubicación o tipo de trabajo..."
              style={styles.searchInput}
            />
          </div>
          <div style={styles.profileContainer}>
            <div style={styles.profileInfo}>
              <div style={styles.profileName}>Juan Pérez</div>
              <div style={styles.profileRole}>Carpintero Profesional</div>
            </div>
            <div style={styles.profileAvatar}>
              <img
                src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
                alt="Avatar"
                style={styles.avatarImage}
              />
              <div style={styles.statusIndicator}></div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={styles.statsContainer}>
          <div style={styles.statsCard}>
            <div style={{ ...styles.statsIcon, backgroundColor: '#dbeafe' }}>
              <span style={{ fontSize: '1.5rem' }}>🏆</span>
            </div>
            <div>
              <div style={styles.statsNumber}>12</div>
              <div style={styles.statsLabel}>Trabajos Activos</div>
            </div>
          </div>
          <div style={styles.statsCard}>
            <div style={{ ...styles.statsIcon, backgroundColor: '#dcfce7' }}>
              <span style={{ fontSize: '1.5rem' }}>⭐</span>
            </div>
            <div>
              <div style={styles.statsNumber}>4.8</div>
              <div style={styles.statsLabel}>Rating Promedio</div>
            </div>
          </div>
          <div style={styles.statsCard}>
            <div style={{ ...styles.statsIcon, backgroundColor: '#fef3c7' }}>
              <span style={{ fontSize: '1.5rem' }}>💰</span>
            </div>
            <div>
              <div style={styles.statsNumber}>247</div>
              <div style={styles.statsLabel}>Coins Disponibles</div>
            </div>
          </div>
        </div>

        <div style={{ ...styles.sectionHeader, paddingRight: "100px" }}>
          <h1 style={styles.sectionTitle}>💼 Trabajos Disponibles en tu Área</h1>
          <p style={styles.sectionSubtitle}>
            Encuentra oportunidades que coincidan con tus habilidades y oficios
          </p>
        </div>

        {/* Oficios Grid */}
        <div style={styles.gridContainer}>
          {oficios.map((oficio) => (
            <div key={oficio.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <div style={styles.cardIconContainer}>
                  <span style={styles.cardIcon}>{oficio.icon}</span>
                </div>
                <div style={{ ...styles.urgenciaBadge, backgroundColor: getUrgenciaColor(oficio.urgencia) }}>
                  {oficio.urgencia}
                </div>
              </div>

              <div style={styles.cardContent}>
                <h3 style={styles.cardTitle}>{oficio.titulo}</h3>
                <p style={styles.cardDescription}>{oficio.descripcion}</p>

                <div style={styles.cardMeta}>
                  <div style={styles.metaItem}>
                    <span style={styles.metaLabel}>Oficio:</span>
                    <span style={styles.metaValue}>{oficio.oficio}</span>
                  </div>
                  <div style={styles.metaItem}>
                    <span style={styles.metaLabel}>Precio:</span>
                    <span style={styles.metaPrice}>${oficio.precio}</span>
                  </div>
                </div>

                <div style={styles.cardStats}>
                  <div style={styles.rating}>
                    <span style={styles.starIcon}>⭐</span>
                    <span>{oficio.rating}</span>
                  </div>
                  <div style={styles.workers}>
                    <span>{oficio.trabajadores} profesionales disponibles</span>
                  </div>
                </div>
              </div>

              <div style={styles.cardFooter}>
                <button style={styles.outlineButton}>
                  Ver Detalles
                </button>
                <button style={styles.primaryButton}>
                  Aplicar Ahora ➤
                </button>
              </div>
            </div>
          ))}
        </div>

        {showModal && (
          <CompleteProfileModal
            onClose={() => setShowModal(false)}
            onSubmit={() => setShowModal(false)}
          />
        )}
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    display: "flex",
    flexDirection: "row",
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    color: "#1e293b",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    "@media (max-width: 768px)": {
      flexDirection: "column",
    },
  },
  sidebar: {
    width: "20rem",
    background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
    color: "white",
    padding: "1.5rem",
    position: "fixed",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    boxShadow: "4px 0 20px rgba(0, 0, 0, 0.1)",
    zIndex: 1000,
    "@media (max-width: 1200px)": {
      width: "17rem",
      padding: "1rem",
    },
    "@media (max-width: 768px)": {
      width: "100%",
      position: "relative",
      minHeight: "auto",
      padding: "1rem",
    },
  },
  sidebarHeader: {
    marginBottom: "2rem",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "white",
  },
  logoIcon: {
    fontSize: "1.5rem",
  },
  nav: {
    flex: 1,
  },
  navList: {
    listStyleType: "none",
    padding: 0,
    margin: 0,
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.875rem 1rem",
    cursor: "pointer",
    borderRadius: "0.75rem",
    marginBottom: "0.5rem",
    transition: "all 0.3s ease",
    position: "relative",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  },
  navIcon: {
    fontSize: "1.25rem",
    width: "1.5rem",
    textAlign: "center",
  },
  notificationBadge: {
    marginLeft: "auto",
    backgroundColor: "#ef4444",
    color: "white",
    borderRadius: "9999px",
    padding: "0.25rem 0.5rem",
    fontSize: "0.75rem",
    fontWeight: "600",
    minWidth: "1.5rem",
    textAlign: "center",
  },
  coinsBadge: {
    marginLeft: "auto",
    backgroundColor: "#f59e0b",
    color: "white",
    borderRadius: "9999px",
    padding: "0.25rem 0.5rem",
    fontSize: "0.75rem",
    fontWeight: "600",
  },
  sidebarStats: {
    marginTop: "2rem",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    "@media (max-width: 768px)": {
      flexDirection: "row",
      gap: "0.5rem",
    },
    "@media (max-width: 480px)": {
      flexDirection: "column",
    },
  },
  statCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    borderRadius: "0.75rem",
    padding: "1rem",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  statIcon: {
    fontSize: "1.5rem",
  },
  statNumber: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "white",
  },
  statLabel: {
    fontSize: "0.875rem",
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: "0.25rem",
  },
  mainContent: {
    marginLeft: "22rem",
    padding: "2rem",
    flex: 1,
    "@media (max-width: 1200px)": {
      marginLeft: "19rem",
      padding: "1.5rem",
    },
    "@media (max-width: 768px)": {
      marginLeft: "0",
      padding: "1rem",
    },
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2.5rem",
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "1rem",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    border: "1px solid #e2e8f0",
    "@media (max-width: 768px)": {
      flexDirection: "column",
      gap: "1rem",
      padding: "1.5rem",
      marginBottom: "2rem",
    },
  },
  searchContainer: {
    position: "relative",
    flex: 1,
    maxWidth: "28rem",
    "@media (max-width: 768px)": {
      maxWidth: "100%",
      width: "100%",
    },
  },
  searchIcon: {
    position: "absolute",
    left: "1rem",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "1.25rem",
    color: "#64748b",
  },
  searchInput: {
    width: "100%",
    padding: "0.875rem 0.875rem 0.875rem 3rem",
    border: "2px solid #e2e8f0",
    borderRadius: "0.75rem",
    fontSize: "0.95rem",
    backgroundColor: "#f8fafc",
    transition: "all 0.3s ease",
    outline: "none",
  },
  profileContainer: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  profileInfo: {
    textAlign: "right",
  },
  profileName: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "#1e293b",
  },
  profileRole: {
    fontSize: "0.875rem",
    color: "#64748b",
  },
  profileAvatar: {
    position: "relative",
    width: "3rem",
    height: "3rem",
    borderRadius: "50%",
    overflow: "hidden",
    border: "3px solid #3b82f6",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  statusIndicator: {
    position: "absolute",
    bottom: "0.25rem",
    right: "0.25rem",
    width: "0.75rem",
    height: "0.75rem",
    backgroundColor: "#10b981",
    borderRadius: "50%",
    border: "2px solid white",
  },
  statsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1.5rem",
    marginBottom: "2.5rem",
    "@media (max-width: 768px)": {
      gridTemplateColumns: "1fr",
      gap: "1rem",
      marginBottom: "2rem",
    },
    "@media (max-width: 480px)": {
      gridTemplateColumns: "1fr",
    },
  },
  statsCard: {
    backgroundColor: "white",
    padding: "1.5rem",
    borderRadius: "1rem",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    border: "1px solid #e2e8f0",
    transition: "transform 0.3s ease",
    cursor: "pointer",
  },
  statsIcon: {
    width: "3rem",
    height: "3rem",
    borderRadius: "0.75rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  statsNumber: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#1e293b",
  },
  statsLabel: {
    fontSize: "0.875rem",
    color: "#64748b",
    marginTop: "0.25rem",
  },
  sectionHeader: {
    marginBottom: "2rem",
  },
  sectionTitle: {
    fontSize: "2rem",
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: "0.5rem",
  },
  sectionSubtitle: {
    fontSize: "1.125rem",
    color: "#64748b",
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
    gap: "2.5rem",
    "@media (max-width: 1400px)": {
      gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
      gap: "2rem",
    },
    "@media (max-width: 768px)": {
      gridTemplateColumns: "1fr",
      gap: "1.5rem",
    },
  },
  card: {
    backgroundColor: "white",
    borderRadius: "1rem",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    border: "1px solid #e2e8f0",
    overflow: "hidden",
    transition: "all 0.3s ease",
    cursor: "pointer",
    marginBottom: "1rem",
    "@media (hover: hover)": {
      ":hover": {
        transform: "translateY(-4px)",
        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
      },
    },
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1.5rem 1.5rem 0",
  },
  cardIconContainer: {
    width: "3rem",
    height: "3rem",
    backgroundColor: "#dbeafe",
    borderRadius: "0.75rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cardIcon: {
    fontSize: "1.5rem",
  },
  urgenciaBadge: {
    padding: "0.375rem 0.75rem",
    borderRadius: "9999px",
    fontSize: "0.75rem",
    fontWeight: "600",
    color: "white",
    textTransform: "uppercase",
  },
  cardContent: {
    padding: "1.5rem",
  },
  cardTitle: {
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: "0.75rem",
  },
  cardDescription: {
    fontSize: "0.95rem",
    color: "#64748b",
    lineHeight: "1.5",
    marginBottom: "1.5rem",
  },
  cardMeta: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    marginBottom: "1rem",
  },
  metaItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  metaLabel: {
    fontSize: "0.875rem",
    color: "#64748b",
    fontWeight: "500",
  },
  metaValue: {
    fontSize: "0.875rem",
    color: "#1e293b",
    fontWeight: "600",
  },
  metaPrice: {
    fontSize: "0.875rem",
    color: "#059669",
    fontWeight: "700",
  },
  cardStats: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: "1rem",
    borderTop: "1px solid #e2e8f0",
  },
  rating: {
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
    fontSize: "0.875rem",
    fontWeight: "600",
    color: "#1e293b",
  },
  starIcon: {
    fontSize: "1rem",
  },
  workers: {
    fontSize: "0.75rem",
    color: "#64748b",
  },
  cardFooter: {
    display: "flex",
    gap: "0.75rem",
    padding: "0 1.5rem 1.5rem",
    "@media (max-width: 480px)": {
      flexDirection: "column",
      gap: "0.5rem",
    },
  },
  outlineButton: {
    flex: 1,
    padding: "0.75rem 1rem",
    border: "2px solid #e2e8f0",
    borderRadius: "0.75rem",
    backgroundColor: "white",
    color: "#64748b",
    cursor: "pointer",
    fontSize: "0.875rem",
    fontWeight: "600",
    transition: "all 0.3s ease",
    outline: "none",
  },
  primaryButton: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    padding: "0.75rem 1rem",
    border: "none",
    borderRadius: "0.75rem",
    backgroundColor: "#3b82f6",
    color: "white",
    cursor: "pointer",
    fontSize: "0.875rem",
    fontWeight: "600",
    transition: "all 0.3s ease",
    outline: "none",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "white",
    borderRadius: "1rem",
    padding: "2rem",
    maxWidth: "28rem",
    width: "90%",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
  },
  modalTitle: {
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: "1rem",
  },
  modalText: {
    fontSize: "1rem",
    color: "#64748b",
    lineHeight: "1.6",
    marginBottom: "2rem",
  },
  modalButtons: {
    display: "flex",
    gap: "1rem",
  },
  modalButtonSecondary: {
    flex: 1,
    padding: "0.75rem",
    border: "2px solid #e2e8f0",
    borderRadius: "0.75rem",
    backgroundColor: "white",
    color: "#64748b",
    cursor: "pointer",
    fontWeight: "600",
    outline: "none",
  },
  modalButtonPrimary: {
    flex: 1,
    padding: "0.75rem",
    border: "none",
    borderRadius: "0.75rem",
    backgroundColor: "#3b82f6",
    color: "white",
    cursor: "pointer",
    fontWeight: "600",
    outline: "none",
  },
};

export default PreguntasPage;