import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>404 - Página no encontrada</h1>
      <p>La página que estás buscando no existe.</p>
      <button 
        onClick={() => navigate("/")} 
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: "#0056d2",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Volver al inicio
      </button>
    </div>
  );
};

export default NotFound;
