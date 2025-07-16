import React from "react";
import "./styles.css";
import imgLogin from "../../images/imgLogin.svg";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { authApi } from "../../hooks/useAuth";
import { Alerta } from "../../utils/mensajes";
import { setAll } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
export default function Login() {
  const Router = useNavigate();

  const schema = yup.object().shape({
    email: yup.string().email("El correo no es valido").required("El correo es requerido"),
    password: yup.string().required("La clave es requerida").min(8, "La clave debe tener al menos 8 caracteres"),
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    data = {
      correo: data.email,
      clave: data.password,
    };
    const response = await authApi(data);
    if (response.code === 200) {
      Alerta({
        title: "success",
        text: "Login exitoso",
        icon: "success",
        confirmButtonText: "Aceptar",
      });
      setAll(response.data.token, response.data.usuario, response.data.rol, response.data.external_id);
      Router("/principal");
    } else {
      Alerta({
        title: "Error",
        text: response.tag,
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };

  const handleRegister = () => {
    Router("/register");
  };

  return (
    <div className="login">
      <div className="login-container">
        <div className="login-form">
          <h1>Tiempo Digital</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="email">Correo:</label>
            <input {...register("email")} type="email" id="email" placeholder="Ingresa tu email" />
            <p className="error">{errors.email?.message}</p>

            <label htmlFor="password">Clave:</label>
            <input {...register("password")} type="password" id="password" placeholder="Ingresa tu contraseña" />
            <p className="error">{errors.password?.message}</p>

            <button type="submit" className="btn btn-login">Ingresar</button>
            <p>
              ¿No tienes una cuenta?{" "}
              <span onClick={handleRegister} className="link">
                Register
              </span>
            </p>
          </form>
        </div>
        <div className="login-image">
          <img src={imgLogin} alt="Imagen de Login" />
        </div>
      </div>
    </div>
  );
}