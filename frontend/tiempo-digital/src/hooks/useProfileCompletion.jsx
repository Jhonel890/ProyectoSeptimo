import { useState, useEffect } from "react";
import { GET, POST } from "../utils/methods";
import { getExternalID, getToken } from "../utils/auth";
import { Alerta } from "../utils/mensajes";

const useProfileCompletion = (onProfileComplete) => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const checkProfileCompletion = async () => {
      try {
        const idPersona = getExternalID();
        const response = await GET(`/persona/status/${idPersona}`, getToken());

        if (!response.status) {
          setShowModal(true);
        }
      } catch (error) {
        console.error("Error verificando el registro del perfil:", error);
      }
    };

    checkProfileCompletion();
  }, []);

  const handleProfileSubmit = async (profileData) => {
    try {
      const idPersona = getExternalID();
      const response = await POST(`/persona/status/change/${idPersona}`, profileData, getToken());
      if (response.code === 200) {
        setShowModal(false);
        Alerta({
          title: "Perfil completado",
          text: "Tu perfil ha sido completado exitosamente",
          icon: "success",
          confirmButtonText: "Aceptar",
        });
        if (onProfileComplete) onProfileComplete(); // Notifica el refetch
      } else {
        Alerta({
          title: "Error",
          text: response.tag,
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      }
    } catch (error) {
      console.error("Error enviando datos del perfil:", error);
      Alerta({
        title: "Error",
        text: "Ocurrió un error al enviar los datos del perfil",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };

  return { showModal, setShowModal, handleProfileSubmit };
};

export default useProfileCompletion;
