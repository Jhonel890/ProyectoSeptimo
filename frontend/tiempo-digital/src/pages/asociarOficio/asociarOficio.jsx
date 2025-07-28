import React from "react";
import { useNavigate } from "react-router-dom";
import { Alerta } from "../../utils/mensajes";
import useGetOficios from "../../hooks/useGetOficios";
import useGetUser from "../../hooks/useGetUser";
import { useAsociarOficio } from "../../hooks/useAsociarOficio"; // ← asegúrate de exportarlo correctamente
import "./styles.css";

const AsociarOficioPage = ({ onClose }) => {
  const navigate = useNavigate();
  const user = useGetUser();
  const { oficios: oficiosDisponibles, loading: loadingOficios, error: oficiosError } = useGetOficios();
  const { asociarOficios, isLoading: isAsociando, error: asociarError } = useAsociarOficio();
  const [selectedOficios, setSelectedOficios] = React.useState([]);

  if (!user) {
    return (
      <div className="crear-trabajo-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando información del usuario...</p>
        </div>
      </div>
    );
  }

  const handleAsociarOficios = async () => {
    if (selectedOficios.length === 0) {
      Alerta({
        title: "Error",
        text: "Debes seleccionar al menos un oficio",
        icon: "error"
      });
      return;
    }

    try {
      const data = {
        external_id_persona: user.external_id,
        external_id_oficios: selectedOficios
      };

      const result = await asociarOficios(data);

      if (result) {
        Alerta({
          title: "¡Éxito!",
          text: "Oficios asociados correctamente",
          icon: "success",
          willClose: () => {
            if (onClose) onClose();
            else navigate('/perfil');
          }
        });
      }
    } catch (error) {
      console.error("Error al asociar oficios:", error);
    }
  };

  const handleOficioToggle = (oficioId) => {
    setSelectedOficios(prev => 
      prev.includes(oficioId) 
        ? prev.filter(id => id !== oficioId) 
        : [...prev, oficioId]
    );
  };

  const handleVolver = () => {
    if (onClose) onClose();
    else navigate(-1);
  };

  if (loadingOficios) {
    return (
      <div className="crear-trabajo-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando oficios disponibles...</p>
        </div>
      </div>
    );
  }

  if (oficiosError) {
    return (
      <div className="crear-trabajo-container">
        <div className="error-container">
          <h2>Error al cargar oficios</h2>
          <p className="error-message">{oficiosError}</p>
          <button 
            className="btn-primary"
            onClick={() => window.location.reload()}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="crear-trabajo-container">
      <div className="crear-trabajo-header">
        <h1 className="page-title">
          <span className="title-icon">💼</span>
          Añadir oficio a mi perfil
        </h1>
        <p className="page-subtitle">
          Selecciona los oficios que deseas asociar a tu perfil
        </p>
      </div>

      {asociarError && (
        <div className="server-error">
          <p>{asociarError}</p>
        </div>
      )}

      <div className="form-section">
        <h2 className="section-title">
          <span className="section-icon">🔨</span>
          Oficios Disponibles
        </h2>
        
        <div className="oficios-grid">
          {oficiosDisponibles.map(oficio => (
            <div
              key={oficio.external_id}
              className={`oficio-card ${selectedOficios.includes(oficio.external_id) ? 'selected' : ''}`}
              onClick={() => !isAsociando && handleOficioToggle(oficio.external_id)}
            >
              <span className="oficio-icon">{oficio.icon || '🛠️'}</span>
              <span className="oficio-nombre">{oficio.nombre}</span>
              {selectedOficios.includes(oficio.external_id) && (
                <span className="selected-check">✓</span>
              )}
            </div>
          ))}
        </div>
        
        {selectedOficios.length === 0 && (
          <span className="error-message">Debes seleccionar al menos un oficio</span>
        )}
      </div>

      <div className="form-actions">
        <button
          type="button"
          onClick={handleVolver}
          className="btn-secondary"
          disabled={isAsociando}
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={handleAsociarOficios}
          className={`btn-primary ${isAsociando ? 'submitting' : ''}`}
          disabled={isAsociando || selectedOficios.length === 0}
        >
          {isAsociando ? (
            <>
              <span className="spinner"></span>
              Asociando...
            </>
          ) : 'Guardar cambios'}
        </button>
      </div>
    </div>
  );
};

export default AsociarOficioPage;
