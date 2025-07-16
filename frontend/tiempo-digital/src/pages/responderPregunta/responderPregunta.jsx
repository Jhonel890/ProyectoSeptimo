import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { postRespuestas } from "../../hooks/usePostRespuestas";
import { useGetPregunta } from "../../hooks/useGetPreguntas";
import { Alerta } from "../../utils/mensajes";

const Responder = () => {
  const [respuesta, setRespuesta] = useState("");
  const navigate = useNavigate();
  const { external_id: inquietud } = useParams();

  // Obtener la pregunta relacionada con estado de carga
  const { pregunta, isLoading } = useGetPregunta(inquietud);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Agregado para prevenir el comportamiento por defecto del formulario

    try {
      const response = await postRespuestas({ descripcion: respuesta, inquietud });

      if (response.code === 201) {
        Alerta({
          title: "Comentario agregado",
          text: "Todo correcto",
          confirmButtonText: "Aceptar",
          icon: "success",
        });
        navigate("/principal");
      } else {
        throw new Error("Error en la respuesta del servidor");
      }
    } catch (error) {
      console.error("Error en handleSubmit:", error);
      Alerta({
        title: "Error",
        text: "Ups! algo salió mal",
        confirmButtonText: "Aceptar",
        icon: "error",
      });
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.header}>
        <h1 style={styles.sectionTitle}>Responder Pregunta</h1>
        <button
          style={styles.backButton}
          onClick={() => navigate("/principal")}
        >
          Volver a Principal
        </button>
      </div>

      <div style={styles.questionContainer}>
        {isLoading ? (
          <p style={styles.loadingText}>Cargando pregunta...</p>
        ) : (
          <>
            <h2 style={styles.questionTitle}>{pregunta?.titulo}</h2>
            <p style={styles.questionDescription}>
              {pregunta?.descripcion}
            </p>
          </>
        )}
      </div>

      <form onSubmit={handleSubmit} style={styles.formContainer}>
        <div style={styles.inputGroup}>
          <label htmlFor="respuesta" style={styles.label}>
            Tu Respuesta
          </label>
          <textarea
            id="respuesta"
            name="respuesta"
            value={respuesta}
            onChange={(e) => setRespuesta(e.target.value)}
            style={styles.textarea}
            required
          />
        </div>

        <div style={styles.buttonContainer}>
          <button 
            type="submit" 
            style={styles.primaryButton}
            disabled={isLoading} // Deshabilitar el botón mientras carga
          >
            Enviar Respuesta
          </button>
        </div>
      </form>
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
  },
};

export default Responder;
