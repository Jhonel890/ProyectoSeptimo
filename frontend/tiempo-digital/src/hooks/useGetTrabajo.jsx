import { useEffect, useState } from "react";
import { GET } from "../utils/methods";
import { getExternalID } from "../utils/auth";

export default function useGetTrabajo() {
    const [trabajo, setTrabajo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTrabajo = async () => {
            try {
                setLoading(true);
                const external_id = getExternalID();
                
                if (!external_id) {
                    throw new Error("No se pudo obtener el ID del usuario");
                }

                const response = await GET(`/oficio/${external_id}`);
                console.log("useGetTrabajo", response.data);
                
                setTrabajo(response.data);
                setError(null);
            } catch (error) {
                console.error("Error obteniendo trabajo:", error);
                setError(error.message);
                setTrabajo(null);
            } finally {
                setLoading(false);
            }
        };

        fetchTrabajo();
    }, []);

    return { trabajo, loading, error };
}