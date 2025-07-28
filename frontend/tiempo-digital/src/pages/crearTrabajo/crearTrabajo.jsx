import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { Alerta } from "../../utils/mensajes";
import { POST } from "../../utils/methods";
import useGetOficios from "../../hooks/useGetOficios";
import useGetUser from "../../hooks/useGetUser";
import "./crearTrabajo.css";

const CrearTrabajoPage = ({ onClose }) => {
  const navigate = useNavigate();
  const user = useGetUser();

  console.log("Usuario actual:", user);
  const { oficios: oficiosDisponibles, loading: loadingOficios, error: oficiosError } = useGetOficios();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [serverError, setServerError] = React.useState(null);

  const schema = yup.object().shape({
    titulo_trabajo: yup.string()
      .required("El título es obligatorio")
      .max(100, "Máximo 100 caracteres"),
    descripcion: yup.string()
      .required("La descripción es obligatoria")
      .max(500, "Máximo 500 caracteres"),
    fecha_inicio: yup.date()
      .required("La fecha de inicio es obligatoria")
      .min(new Date(), "La fecha no puede ser en el pasado"),
    fecha_fin: yup.date()
      .required("La fecha de fin es obligatoria")
      .when('fecha_inicio', (fecha_inicio, schema) => {
        return fecha_inicio && schema.min(fecha_inicio, "La fecha de fin debe ser posterior a la de inicio");
      }),
    oficios: yup.array()
      .min(1, "Selecciona al menos un oficio")
      .required("Debes seleccionar al menos un oficio")
  });

  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    setValue,
    watch,
    reset
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      estado: 'Postulado',
      oficios: []
    }
  });

  const selectedOficios = watch("oficios");

  const onSubmit = async (formData) => {
    setIsSubmitting(true);
    setServerError(null);
    
    try {
      if (!user?.id) {
        throw new Error("No se pudo identificar al usuario");
      }

      const trabajoData = {
        id_persona: user.id,
        ...formData
      };

      const response = await POST('/trabajo', trabajoData);

      if (response.message) {
        Alerta({
          title: "¡Trabajo creado!",
          text: response.message,
          icon: "success",
          willClose: () => {
            reset();
            if (onClose) onClose();
            else navigate('/trabajos');
          }
        });
      } else {
        throw new Error(response.error || "Error al crear el trabajo");
      }
    } catch (error) {
      console.error("Error al crear trabajo:", error);
      setServerError(error.message);
      Alerta({
        title: "Error",
        text: error.message,
        icon: "error"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOficioToggle = (oficioId) => {
    const newOficios = selectedOficios.includes(oficioId)
      ? selectedOficios.filter(id => id !== oficioId)
      : [...selectedOficios, oficioId];
    setValue("oficios", newOficios);
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
          Crear Nuevo Trabajo
        </h1>
        <p className="page-subtitle">
          Completa los detalles del trabajo que necesitas realizar
        </p>
      </div>

      {serverError && (
        <div className="server-error">
          <p>{serverError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="crear-trabajo-form">
        {/* Información básica */}
        <div className="form-section">
          <h2 className="section-title">
            <span className="section-icon">📝</span>
            Información del Trabajo
          </h2>
          
          <div className="form-group">
            <label htmlFor="titulo_trabajo">Título del Trabajo *</label>
            <input
              id="titulo_trabajo"
              {...register("titulo_trabajo")}
              className={`form-input ${errors.titulo_trabajo ? 'error' : ''}`}
              placeholder="Ej: Reparación de tuberías en cocina"
              disabled={isSubmitting}
            />
            {errors.titulo_trabajo && (
              <span className="error-message">{errors.titulo_trabajo.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="descripcion">Descripción *</label>
            <textarea
              id="descripcion"
              {...register("descripcion")}
              className={`form-textarea ${errors.descripcion ? 'error' : ''}`}
              placeholder="Describe en detalle el trabajo a realizar..."
              rows={5}
              disabled={isSubmitting}
            />
            {errors.descripcion && (
              <span className="error-message">{errors.descripcion.message}</span>
            )}
          </div>
        </div>

        {/* Fechas */}
        <div className="form-section">
          <h2 className="section-title">
            <span className="section-icon">📅</span>
            Fechas Estimadas
          </h2>
          
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="fecha_inicio">Fecha de Inicio *</label>
              <input
                type="date"
                id="fecha_inicio"
                {...register("fecha_inicio")}
                className={`form-input ${errors.fecha_inicio ? 'error' : ''}`}
                disabled={isSubmitting}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.fecha_inicio && (
                <span className="error-message">{errors.fecha_inicio.message}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="fecha_fin">Fecha de Fin *</label>
              <input
                type="date"
                id="fecha_fin"
                {...register("fecha_fin")}
                className={`form-input ${errors.fecha_fin ? 'error' : ''}`}
                disabled={isSubmitting}
                min={watch("fecha_inicio") || new Date().toISOString().split('T')[0]}
              />
              {errors.fecha_fin && (
                <span className="error-message">{errors.fecha_fin.message}</span>
              )}
            </div>
          </div>
        </div>

        {/* Oficios */}
        <div className="form-section">
          <h2 className="section-title">
            <span className="section-icon">🔨</span>
            Oficios Requeridos *
          </h2>
          
          <div className="oficios-grid">
            {oficiosDisponibles.map(oficio => (
              <div
                key={oficio.id}
                className={`oficio-card ${selectedOficios.includes(oficio.id) ? 'selected' : ''}`}
                onClick={() => !isSubmitting && handleOficioToggle(oficio.id)}
              >
                <span className="oficio-icon">{oficio.icon || '🛠️'}</span>
                <span className="oficio-nombre">{oficio.nombre}</span>
                {selectedOficios.includes(oficio.id) && (
                  <span className="selected-check">✓</span>
                )}
              </div>
            ))}
          </div>
          
          {errors.oficios && (
            <span className="error-message">{errors.oficios.message}</span>
          )}
        </div>

        {/* Estado (oculto) */}
        <input type="hidden" {...register("estado")} />

        {/* Botones */}
        <div className="form-actions">
          <button
            type="button"
            onClick={handleVolver}
            className="btn-secondary"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className={`btn-primary ${isSubmitting ? 'submitting' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                Creando...
              </>
            ) : 'Crear Trabajo'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearTrabajoPage;