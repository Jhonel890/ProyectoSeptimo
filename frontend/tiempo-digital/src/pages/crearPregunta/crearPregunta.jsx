import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGetPerfiles from "../../hooks/useGetPerfiles";
import { postPreguntas } from "../../hooks/usePostPreguntas";
import { Alerta } from "../../utils/mensajes";

const CrearPregunta = () => {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [perfilesSeleccionados, setPerfilesSeleccionados] = useState([]);
  const navigate = useNavigate();
  const perfiles = useGetPerfiles();

  const handlePerfilChange = (perfilId) => {
    setPerfilesSeleccionados((prev) =>
      prev.includes(perfilId)
        ? prev.filter((external_id) => external_id !== perfilId)
        : [...prev, perfilId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await postPreguntas({
      titulo,
      descripcion,
      perfiles: perfilesSeleccionados,
    });

    //si la pregunta no tiene perfiles seleccionados
    if (perfilesSeleccionados.length === 0) {
      Alerta({
        title: "Error",
        text: "Debes seleccionar al menos un perfil",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      return;
    }else{

    console.log(response);

    if (response.code === 200) {
      Alerta({
        title: "Pregunta Creada",
        text: "Tu pregunta ha sido creada exitosamente",
        icon: "success",
        confirmButtonText: "Aceptar",
      });
      navigate("/principal");
    } else {
      Alerta({
        title: "Error",
        text: response.message || "Error al crear la pregunta",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  }
  };

  return (
    <div style={styles.pageContainer}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.sectionTitle}>Crear Pregunta</h1>
        <button style={styles.backButton} onClick={() => navigate("/principal")}>
          Volver a Principal
        </button>
      </div>

      {/* Formulario de Creación de Pregunta */}
      <form onSubmit={handleSubmit} style={styles.formContainer}>
        <div style={styles.inputGroup}>
          <label htmlFor="titulo" style={styles.label}>
            Título de la Pregunta
          </label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label htmlFor="descripcion" style={styles.label}>
            Descripción
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            style={styles.textarea}
            required
          />
        </div>

        <h2 style={styles.sectionTitle}>Selecciona Perfiles Relacionados</h2>
        <div style={styles.perfilesContainer}>
          {perfiles.length > 0 ? (
            perfiles.map((perfil) => (
              <div key={perfil.external_id} style={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  id={`perfil-${perfil.external_id}`}
                  value={perfil.external_id}
                  checked={perfilesSeleccionados.includes(perfil.external_id)}
                  onChange={() => handlePerfilChange(perfil.external_id)}
                  style={styles.checkbox}
                />
                <label htmlFor={`perfil-${perfil.external_id}`} style={styles.checkboxLabel}>
                  {perfil.nombre}
                </label>
              </div>
            ))
          ) : (
            <p>Cargando perfiles...</p>
          )}
        </div>

        <div style={styles.buttonContainer}>
          <button type="submit" style={styles.primaryButton}>
            Crear Pregunta
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
    ':hover': {
      backgroundColor: "#1e40af",
    },
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
  input: {
    padding: "0.75rem",
    border: "1px solid #d1d5db",
    borderRadius: "0.375rem",
    fontSize: "1rem",
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
  perfilesContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    marginBottom: "1rem",
  },
  checkboxGroup: {
    display: "flex",
    alignItems: "center",
  },
  checkbox: {
    marginRight: "0.5rem",
  },
  checkboxLabel: {
    fontSize: "1rem",
  },
};

export default CrearPregunta;
