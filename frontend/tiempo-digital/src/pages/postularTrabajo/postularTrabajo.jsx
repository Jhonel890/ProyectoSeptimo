import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { Alerta } from "../../utils/mensajes";
import { POST } from "../../utils/methods";
import useGetUser from "../../hooks/useGetUser";
import "./styles.css";

const PostularTrabajoPage = ({ onClose, trabajoExternalId, onSuccess }) => {
  console.log("Trabajo External ID:", trabajoExternalId);
  const navigate = useNavigate();
  const user = useGetUser();

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [serverError, setServerError] = React.useState(null);

  const schema = yup.object().shape({
    hora_visita: yup.string()
      .required("La hora de visita es obligatoria")
      .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato de hora inválido (HH:MM)"),
    fecha_visita: yup.date()
      .required("La fecha de visita es obligatoria")
      .min(new Date(), "La fecha no puede ser en el pasado"),
    precondiciones: yup.string()
      .max(500, "Máximo 500 caracteres")
  });

  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    setValue,
    watch
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fecha_visita: new Date().toISOString().split('T')[0],
      hora_visita: "09:00"
    }
  });

  React.useEffect(() => {
    if (!trabajoExternalId) {
      setServerError("No se encontró el trabajo al que postular");
      Alerta({
        title: "Error",
        text: "No se pudo identificar el trabajo seleccionado",
        icon: "error"
      });
    }
  }, [trabajoExternalId]);

  const onSubmit = async (formData) => {
    setIsSubmitting(true);
    setServerError(null);
    
    try {
      if (!user?.external_id) {
        throw new Error("No se pudo identificar al trabajador");
      }

      if (!trabajoExternalId) {
        throw new Error("No se encontró el trabajo al que postular");
      }

      // Formatear los datos para que coincidan con lo que espera el backend
      const ofertaData = {
        external_id_trabajo: trabajoExternalId,
        external_id_trabajador: user.external_id,
        precondiciones: formData.precondiciones,
        hora_visita: `${formData.hora_visita}:00`, // Agregar segundos
        fecha_visita: new Date(formData.fecha_visita).toISOString().split('T')[0] // Formato YYYY-MM-DD
      };

      console.log("Datos de postulación enviados:", ofertaData);

      const response = await POST('/oferta', ofertaData);
       
      if (response.code === 201) {
        Alerta({
          title: "¡Postulación exitosa!",
          text: response.message,
          icon: "success",
          willClose: () => {
            if (onSuccess) {
              onSuccess();
            } else if (onClose) {
              onClose();
            } else {
              navigate('/mis-postulaciones');
            }
          }
        });
      } else {
        throw new Error(response.message || "Error al postular al trabajo");
      }
    } catch (error) {
      console.error("Error al postular:", error);
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

  const handleVolver = () => {
    if (onClose) onClose();
    else navigate(-1);
  };

  return (
    <div className="postular-trabajo-container">
      <div className="postular-trabajo-card">
        <div className="postular-trabajo-header">
          <h1 className="postular-trabajo-title">
            <span className="title-icon">✍️</span>
            Postular a Trabajo
          </h1>
          <p className="postular-trabajo-subtitle">
            Completa los detalles de tu postulación
          </p>
        </div>

        {serverError && (
          <div className="postular-trabajo-error">
            <p>{serverError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="postular-trabajo-form">
          {/* Sección Disponibilidad */}
          <div className="form-section compact">
            <h2 className="section-title">
              <span className="section-icon">📅</span>
              Disponibilidad
            </h2>
            
            <div className="form-row">
              <div className="form-group compact">
                <label htmlFor="fecha_visita">Fecha de Visita *</label>
                <input
                  type="date"
                  id="fecha_visita"
                  {...register("fecha_visita")}
                  className={`form-input ${errors.fecha_visita ? 'error' : ''}`}
                  disabled={isSubmitting}
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.fecha_visita && (
                  <span className="error-message">{errors.fecha_visita.message}</span>
                )}
              </div>

              <div className="form-group compact">
                <label htmlFor="hora_visita">Hora de Visita *</label>
                <input
                  type="time"
                  id="hora_visita"
                  {...register("hora_visita")}
                  className={`form-input ${errors.hora_visita ? 'error' : ''}`}
                  disabled={isSubmitting}
                />
                {errors.hora_visita && (
                  <span className="error-message">{errors.hora_visita.message}</span>
                )}
              </div>
            </div>
          </div>

          {/* Sección Precondiciones */}
          <div className="form-section compact">
            <h2 className="section-title">
              <span className="section-icon">📝</span>
              Requisitos Especiales
            </h2>
            
            <div className="form-group compact">
              <label htmlFor="precondiciones">Precondiciones (Opcional)</label>
              <textarea
                id="precondiciones"
                {...register("precondiciones")}
                className={`form-textarea ${errors.precondiciones ? 'error' : ''}`}
                placeholder="Indica cualquier requisito especial..."
                rows={3}
                disabled={isSubmitting}
              />
              {errors.precondiciones && (
                <span className="error-message">{errors.precondiciones.message}</span>
              )}
            </div>
          </div>

          {/* Botones - ahora más visibles */}
          <div className="form-actions compact">
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
              disabled={isSubmitting || !trabajoExternalId}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Enviando...
                </>
              ) : 'Enviar Postulación'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostularTrabajoPage;