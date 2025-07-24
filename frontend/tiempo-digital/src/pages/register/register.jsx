import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { Alerta } from "../../utils/mensajes";
import { registerApi } from "../../hooks/useAuth";
import useGetRol from "../../hooks/useGetRol";
import "./styles.css";

export default function Register() {
  const navigate = useNavigate();
  const { roles, loading, error: rolesError } = useGetRol();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [serverError, setServerError] = React.useState(null);

  const schema = yup.object().shape({
    names: yup.string()
      .required("Nombres son requeridos")
      .max(120, "Máximo 120 caracteres"),
    lastnames: yup.string()
      .required("Apellidos son requeridos")
      .max(120, "Máximo 120 caracteres"),
    ine: yup.string()
      .required("Cédula es requerida")
      .matches(/^[0-9]{10}$/, "Debe tener 10 dígitos"),
    address: yup.string()
      .required("Dirección es requerida")
      .max(200, "Máximo 200 caracteres"),
    phone: yup.string()
      .required("Teléfono es requerido")
      .matches(/^[0-9]{10}$/, "Debe tener 10 dígitos"),
    email: yup.string()
      .email("Correo no válido")
      .required("Correo es requerido")
      .max(80, "Máximo 80 caracteres"),
    password: yup.string()
      .required("Clave es requerida")
      .min(8, "Mínimo 8 caracteres")
      .max(20, "Máximo 20 caracteres"),
    rol: yup.string().required("Selecciona un rol"),
  });

  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    reset 
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (formData) => {
    setIsSubmitting(true);
    setServerError(null);
    
    try {
      const selectedRol = roles.find(rol => rol.external_id === formData.rol);
      
      if (!selectedRol) {
        throw new Error("Rol seleccionado no válido");
      }

      const response = await registerApi({
        nombres: formData.names,
        apellidos: formData.lastnames,
        cedula: formData.ine,
        direccion: formData.address,
        num_telefono: formData.phone,
        external_rol: formData.rol,
        cuenta: {
          correo: formData.email,
          clave: formData.password,
        }
      });

      if (response.message === 'Persona creada correctamente') {

        console.log("Registro exitoso:", response);
        Alerta({
          title: "¡Registro exitoso!",
          text: "Tu cuenta ha sido creada correctamente. Por favor, inicia sesión.",
          icon: "success",
        });
        navigate("/"); // Redirige a login después de cerrar

      } else {
        throw new Error(response.message || "Error al procesar el registro");
      }
    } catch (error) {
      console.error("Error en registro:", error);
      setServerError(error.message);
      Alerta({
        title: "Error en registro",
        text: error.message,
        icon: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="auth-container">
        <div className="auth-card loading">
          <div className="spinner"></div>
          <h2>Cargando formulario...</h2>
          <p>Obteniendo roles disponibles</p>
        </div>
      </div>
    );
  }

  if (rolesError) {
    return (
      <div className="auth-container">
        <div className="auth-card error">
          <h2>Error al cargar roles</h2>
          <p className="error-message">{rolesError}</p>
          <button 
            className="auth-button"
            onClick={() => window.location.reload()}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Registro de Usuario</h1>
          <p className="auth-subtitle">Crea tu cuenta para comenzar</p>
        </div>
        
        {serverError && (
          <div className="server-error">
            <p>{serverError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="names">Nombres*</label>
              <input
                {...register("names")}
                id="names"
                className={`form-input ${errors.names ? 'error' : ''}`}
                placeholder="Ingresa tus nombres"
                disabled={isSubmitting}
              />
              {errors.names && (
                <span className="error-message">{errors.names.message}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="lastnames">Apellidos*</label>
              <input
                {...register("lastnames")}
                id="lastnames"
                className={`form-input ${errors.lastnames ? 'error' : ''}`}
                placeholder="Ingresa tus apellidos"
                disabled={isSubmitting}
              />
              {errors.lastnames && (
                <span className="error-message">{errors.lastnames.message}</span>
              )}
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="ine">Cédula*</label>
              <input
                {...register("ine")}
                id="ine"
                className={`form-input ${errors.ine ? 'error' : ''}`}
                placeholder="Ingresa tu cédula"
                disabled={isSubmitting}
              />
              {errors.ine && (
                <span className="error-message">{errors.ine.message}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Teléfono*</label>
              <input
                {...register("phone")}
                id="phone"
                className={`form-input ${errors.phone ? 'error' : ''}`}
                placeholder="Ingresa tu teléfono"
                disabled={isSubmitting}
              />
              {errors.phone && (
                <span className="error-message">{errors.phone.message}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="address">Dirección*</label>
            <input
              {...register("address")}
              id="address"
              className={`form-input ${errors.address ? 'error' : ''}`}
              placeholder="Ingresa tu dirección"
              disabled={isSubmitting}
            />
            {errors.address && (
              <span className="error-message">{errors.address.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo electrónico*</label>
            <input
              type="email"
              {...register("email")}
              id="email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="Ingresa tu correo"
              disabled={isSubmitting}
            />
            {errors.email && (
              <span className="error-message">{errors.email.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña*</label>
            <input
              type="password"
              {...register("password")}
              id="password"
              className={`form-input ${errors.password ? 'error' : ''}`}
              placeholder="Crea una contraseña"
              disabled={isSubmitting}
            />
            {errors.password && (
              <span className="error-message">{errors.password.message}</span>
            )}
          </div>

          <div className="form-group">
            <label>Tipo de usuario*</label>
            <div className="role-selector">
              {roles.map((rol) => (
                <label key={rol.external_id} className="role-option">
                  <input
                    type="radio"
                    {...register("rol")}
                    value={rol.external_id}
                    className="role-radio"
                    disabled={isSubmitting}
                  />
                  <div className="role-card">
                    <span className="role-title">{rol.nombre}</span>
                    <span className="role-description">
                      {rol.descripcion || "Descripción no disponible"}
                    </span>
                  </div>
                </label>
              ))}
            </div>
            {errors.rol && (
              <span className="error-message">{errors.rol.message}</span>
            )}
          </div>

          <button 
            type="submit" 
            className={`auth-button ${isSubmitting ? 'submitting' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                Procesando...
              </>
            ) : "Registrarse"}
          </button>

          <div className="auth-footer">
            <p>
              ¿Ya tienes una cuenta?{" "}
              <span 
                className="link"
                onClick={() => navigate("/")}
              >
                Inicia sesión
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}