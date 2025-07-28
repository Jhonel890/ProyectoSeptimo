import { useEffect, useState } from "react";
import { GET } from "../utils/methods";

export default function useGetOficios() {
    const [oficios, setOficios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOficios = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await GET('/oficio');
                
                if (response.data && Array.isArray(response.data)) {
                    setOficios(response.data);
                } else {
                    throw new Error("Formato de datos inesperado");
                }
                
            } catch (error) {
                console.error("Error obteniendo oficios:", error);
                setError(error.message || "Error al cargar los oficios");
                setOficios([]); // Asegurar que oficios sea un array vacío en caso de error
            } finally {
                setLoading(false);
            }
        };

        fetchOficios();
    }, []);

    return { 
        oficios, 
        loading, 
        error 
    };
}