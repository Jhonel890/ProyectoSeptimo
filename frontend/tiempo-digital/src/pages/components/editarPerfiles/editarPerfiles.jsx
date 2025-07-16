import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import useGetPerfiles from "../../../hooks/useGetPerfiles";
import { putModificarPerfiles } from "../../../hooks/usePutModificarPerfil";

export default function EditarPerfiles({ externalId, perfilesActuales }) {
    const perfilesDisponibles = useGetPerfiles();
    const [perfilesSeleccionados, setPerfilesSeleccionados] = useState([]);

    useEffect(() => {
        setPerfilesSeleccionados(perfilesActuales.map((perfil) => perfil.external_id));
    }, [perfilesActuales]);

    const togglePerfil = (id) => {
        if (perfilesSeleccionados.includes(id)) {
            setPerfilesSeleccionados(perfilesSeleccionados.filter((pid) => pid !== id));
        } else {
            setPerfilesSeleccionados([...perfilesSeleccionados, id]);
        }
    };

    const guardarCambios = async () => {
        try {
            const data = { perfiles: perfilesSeleccionados };
            const response = await putModificarPerfiles(data);

            if (response.code === 200) {
                Swal.fire("Éxito", "Los perfiles fueron actualizados correctamente", "success");
            } else {
                Swal.fire("Error", response.message, "error");
            }
        } catch (error) {
            console.error(error);
            Swal.fire("Error", "No se pudo actualizar los perfiles", "error");
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Editar Perfiles</h2>
            <div style={styles.grid}>
                {perfilesDisponibles.map((perfil) => (
                    <label
                        key={perfil.external_id}
                        style={{
                            ...styles.card,
                            ...(perfilesSeleccionados.includes(perfil.external_id)
                                ? styles.cardSelected
                                : styles.cardUnselected),
                        }}
                    >
                        <input
                            type="checkbox"
                            checked={perfilesSeleccionados.includes(perfil.external_id)}
                            onChange={() => togglePerfil(perfil.external_id)}
                            style={styles.checkbox}
                        />
                        <span style={styles.cardText}>{perfil.nombre}</span>
                    </label>
                ))}
            </div>
            <div style={styles.buttonContainer}>
                <button onClick={guardarCambios} style={styles.button}>
                    Guardar Cambios
                </button>
            </div>
        </div>
    );
}

const styles = {
    container: {
        padding: "1.5rem",
        backgroundColor: "white",
        borderRadius: "0.5rem",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        maxWidth: "768px",
        margin: "0 auto",
    },
    title: {
        fontSize: "1.5rem",
        fontWeight: "600",
        color: "#333",
        marginBottom: "1.5rem",
        textAlign: "center",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "1rem",
    },
    card: {
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        padding: "1rem",
        borderRadius: "0.5rem",
        border: "1px solid #ccc",
        cursor: "pointer",
        transition: "background-color 0.3s, border-color 0.3s",
    },
    cardSelected: {
        backgroundColor: "#d4f5d6",
        borderColor: "#38a169",
    },
    cardUnselected: {
        backgroundColor: "#f5f5f5",
        borderColor: "#ccc",
        ":hover": {
            backgroundColor: "#e0e0e0",
        },
    },
    checkbox: {
        width: "1.25rem",
        height: "1.25rem",
    },
    cardText: {
        fontSize: "1rem",
        color: "#333",
        fontWeight: "500",
    },
    buttonContainer: {
        marginTop: "1.5rem",
        textAlign: "right",
    },
    button: {
        backgroundColor: "#2563eb",
        color: "white",
        padding: "0.75rem 1.5rem",
        borderRadius: "0.5rem",
        fontSize: "1rem",
        fontWeight: "500",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        cursor: "pointer",
        transition: "background-color 0.3s",
    },
    buttonHover: {
        backgroundColor: "#1d4ed8",
    },
};
