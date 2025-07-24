import { useEffect, useState } from "react";
import { GET } from "../utils/methods";

export default function useGetRol() {
    const [roles, setRoles] = useState([]); // Estado inicial para los roles
    const [loading, setLoading] = useState(true); // Estado para manejar la carga
    const [error, setError] = useState(null); // Estado para manejar errores

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await GET("/rol"); // Endpoint para obtener roles
                console.log("useGetRol", response.data);

                // Filtrar roles para excluir el rol de administrador
                const filteredRoles = response.data.filter(
                    (rol) => rol.nombre.toLowerCase() !== "administrador"
                );

                setRoles(filteredRoles); // Actualiza el estado con los roles filtrados
                setLoading(false); // Finaliza la carga
            } catch (err) {
                console.error("Error obteniendo roles:", err);
                setError(err.message || "Error al obtener roles");
                setLoading(false); // Finaliza la carga incluso si hay error
            }
        };

        fetchRoles();
    }, []);

    return { roles, loading, error }; // Devuelve los roles, el estado de carga y el error
}