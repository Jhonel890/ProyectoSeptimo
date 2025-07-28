import { useState } from "react";
import { POST } from "../utils/methods";
import { Alerta } from "../utils/mensajes";

export const useAsociarOficio = () => {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [respuesta, setRespuesta] = useState(null);

  const asociarOficios = async ({ external_id_persona, external_id_oficios }) => {
    setCargando(true);
    setError(null);
    setRespuesta(null);

    try {
      const data = {
        external_id_persona,
        external_id_oficios
      };

      const response = await POST('/persona/asociar-oficio', data);

      if (response.code === 400) {
        setError(response.message);
        setRespuesta(null);
        Alerta({
          title: "Ya asociados",
          text: response.message || 'La persona ya tiene estos oficios asociados.',
          icon: "warning"
        });
        return null;
      }

      if (response.code !== 200) {
        throw new Error(response.message || 'Error al asociar oficios');
      }

      setRespuesta(response);
      Alerta({
        title: "¡Éxito!",
        text: "Oficios asociados correctamente",
        icon: "success"
      });

      return response;

    } catch (err) {
      setError(err.message);
      Alerta({
        title: "Error",
        text: err.message || 'Ocurrió un error al asociar los oficios',
        icon: "error"
      });
      return null;
    } finally {
      setCargando(false);
    }
  };

  return {
    asociarOficios,
    cargando,
    error,
    respuesta
  };
};
