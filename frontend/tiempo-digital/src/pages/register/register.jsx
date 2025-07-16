import React from "react";
import "./styles.css";
import imgRegister from "../../images/imgRegister.svg";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerApi } from "../../hooks/useAuth";
import { Alerta } from "../../utils/mensajes";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const Router = useNavigate();

  const schema = yup.object().shape({
    names: yup.string().required("Nombres son requeridos").max(120, "Nombres no pueden tener mas de 120 caracteres"),
    lastnames: yup.string().required("Apellidos son requeridos").max(120, "Apellidos no pueden tener mas de 120 caracteres"),
    ine: yup.string().required("Cedula es requerida").matches(/^[0-9]{10}$/, "Cedula no valida debe tener 10 digitos").max(10, "Cedula no valida debe tener 10 digitos"),
    address: yup.string().required("Direccion es requerida").max(200, "Direccion no puede tener mas de 200 caracteres"),
    email: yup.string().email("El correo no es valido").required("El correo es requerido").max(80, "Correo no puede tener mas de 80 caracteres"),
    password: yup.string().required("La clave es requerida").min(8, "La clave debe tener al menos 8 caracteres").max(20, "La clave no puede tener mas de 20 caracteres"),
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema, { abortEarly: false }),
  });

  const onSubmit = async (data) => {
    data = {
      nombres: data.names,
      apellidos: data.lastnames,
      cedula: data.ine,
      direccion: data.address,
      cuenta: {
        correo: data.email,
        clave: data.password,
      }
    };
    const response = await registerApi(data);
    if (response.code === 200) {
      Alerta({
        title: "Por favor ahora inicia sesion", 
        text: "registro exitoso",
        icon: "success",
        confirmButtonText: "Aceptar",
      });
      Router("/");
    } else {
      Alerta({
        title: "Error",
        text: response.tag,
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };

  const handleLoginRedirect = () => {
    Router("/");
  };

  return (
    <div className="login">
      <div className="login-container">
        <div className="login-form">
          <h1>Tiempo Digital</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-grid">
              <div>
                <label htmlFor="names">Nombres:</label>
                <input {...register("names")} type="text" id="names" placeholder="Ingresa tus nombres" />
                <p className="error">{errors.names?.message}</p>

                <label htmlFor="ine">Cedula:</label>
                <input {...register("ine")} type="text" id="ine" placeholder="Ingresa tu cedula" />
                <p className="error">{errors.ine?.message}</p>

                <label htmlFor="email">Correo:</label>
                <input {...register("email")} type="email" id="email" placeholder="Ingresa tu correo:" />
                <p className="error">{errors.email?.message}</p>
              </div>
              <div>
                <label htmlFor="lastnames">Apellidos:</label>
                <input {...register("lastnames")} type="text" id="lastnames" placeholder="Ingresa tus apellidos" />
                <p className="error">{errors.lastnames?.message}</p>

                <label htmlFor="address">Direccion:</label>
                <input {...register("address")} type="text" id="address" placeholder="Ingresa tu dirección" />
                <p className="error">{errors.address?.message}</p>

                <label htmlFor="password">Clave:</label>
                <input {...register("password")} type="password" id="password" placeholder="Ingresa tu contraseña" />
                <p className="error">{errors.password?.message}</p>
              </div>
            </div>
            <button type="submit" className="btn btn-register">Registrarse</button>
            <p>
              ¿Ya tienes una cuenta?{" "}
              <span onClick={handleLoginRedirect} className="link">
                Login
              </span>
            </p>
          </form>
        </div>
        <div className="login-image">
          <img src={imgRegister} alt="Imagen de Registro" />
        </div>
      </div>
    </div>
  );
}
