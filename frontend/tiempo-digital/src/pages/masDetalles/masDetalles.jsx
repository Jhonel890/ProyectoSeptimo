import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const MasDetalles = () => {
  const [descripcion, setDescripcion] = useState("");
  const navigate = useNavigate();

const pregunta = {
  titulo: "¿Alguien puede ayudarme a reparar mi teléfono?",
  descripcion:"Mi teléfono ha estado fallando últimamente y no estoy seguro de cuál es el problema. He intentado reiniciarlo varias veces, pero el problema persiste. Agradecería cualquier consejo o ayuda para solucionar este inconveniente."
};

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes manejar el envío de la descripción, por ejemplo, enviándola a un servidor
    console.log("Descripción enviada:", descripcion);
    navigate('/principal'); // Redirige al dashboard principal después de enviar la descripción
  };

  return (
    <div style={styles.pageContainer}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.sectionTitle}>Más Detalles</h1>
        <button style={styles.backButton} onClick={() => navigate('/principal')}>
          Volver a Principal
        </button>
      </div>

      {/* Pregunta */}
      <div style={styles.questionContainer}>
        <h2 style={styles.questionTitle}>{pregunta.titulo}</h2>
        <p style={styles.questionDescription}>{pregunta.descripcion}</p>
      </div>

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
    ':hover': {
      backgroundColor: "#1e40af",
    },
  },
  questionContainer: {
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "0.375rem",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
    marginBottom: "2rem",
  },
  questionTitle: {
    fontSize: "1.25rem",
    fontWeight: "600",
  },
  questionDescription: {
    fontSize: "1rem",
    color: "#6b7280",
    marginTop: "1rem",
  },
  formContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontSize: "1rem",
    fontWeight: "500",
    marginBottom: "0.5rem",
  },
  textarea: {
    padding: "0.75rem",
    border: "1px solid #d1d5db",
    borderRadius: "0.375rem",
    fontSize: "1rem",
    minHeight: "150px",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end",
  },
  primaryButton: {
    padding: "0.75rem 1.5rem",
    border: "none",
    borderRadius: "0.375rem",
    backgroundColor: "#2563eb",
    color: "white",
    cursor: "pointer",
    transition: "background-color 0.3s",
    ':hover': {
      backgroundColor: "#1e40af",
    },
  },
};

export default MasDetalles;
