import React from "react";
import { useNavigate } from "react-router-dom";
import useGetUser from "../../hooks/useGetUser";
import MostrarPerfiles from "../components/mostrarPerfiles";
import EditarPerfiles from "../components/editarPerfiles/editarPerfiles";


const Perfil = () => {
  const navigate = useNavigate();
  const user = useGetUser();

  return (
    <div style={styles.pageContainer}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.sectionTitle}>Mi Perfil</h1>
        <button style={styles.backButton} onClick={() => navigate("/principal")}>
          Volver a Principal
        </button>
      </div>

      {/* Información del Perfil */}
      {user ? (
        <div style={styles.profileContainer}>
          <div style={styles.profileHeader}>
            <img
              src={user.fotoPerfil || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"}
              alt="Foto de perfil"
              style={styles.profileImage}
            />
            <div>
              <h2 style={styles.profileName}>
                {user.nombres} {user.apellidos}
              </h2>
              <p style={styles.profileEmail}>{user.cedula}</p>
            </div>
          </div>

          <div style={styles.profileDetails}>
            <p>
              <strong>Dirección:</strong> {user.direccion || "No especificada"}
            </p>
            <p>
              <strong>Monedas:</strong> {user.monedas?.toFixed(2)}
            </p>
            <p>
              <strong>Descripción:</strong> {user.descripcion || "No especificada"}
            </p>
          </div>

          <MostrarPerfiles perfiles={user.perfiles} />

          <EditarPerfiles
            externalId={user.external_id}
            perfilesActuales={user.perfiles}
          />
        </div>
      ) : (
        <p style={styles.loadingText}>Cargando información del perfil...</p>
      )}
    </div>
  );
};

const styles = {
  pageContainer: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    padding: "2rem",
    backgroundColor: "#f3f4f6",
    color: "#1f2937",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
  },
  sectionTitle: {
    fontSize: "1.5rem",
    fontWeight: "600",
  },
  backButton: {
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "0.375rem",
    backgroundColor: "#2563eb",
    color: "white",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  profileContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1.5rem",
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "0.375rem",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
  },
  profileHeader: {
    display: "flex",
    alignItems: "center",
    gap: "1.5rem",
  },
  profileImage: {
    borderRadius: "50%",
    width: "100px",
    height: "100px",
    objectFit: "cover",
  },
  profileName: {
    fontSize: "1.25rem",
    fontWeight: "600",
  },
  profileEmail: {
    fontSize: "1rem",
    color: "#6b7280",
  },
  profileDetails: {
    fontSize: "1rem",
    color: "#6b7280",
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: "1.5rem",
  },
  primaryButton: {
    padding: "0.75rem 1.5rem",
    border: "none",
    borderRadius: "0.375rem",
    backgroundColor: "#2563eb",
    color: "white",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  loadingText: {
    textAlign: "center",
    fontSize: "1rem",
    color: "#6b7280",
  },
};

export default Perfil;
