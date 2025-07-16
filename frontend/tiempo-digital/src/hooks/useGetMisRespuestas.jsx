import { useEffect, useState } from "react";
import { GET } from "../utils/methods";
import { getExternalID } from "../utils/auth";

export default function useGetMisRespuestas() {

    const [respuestas, setrespuestas] = useState([]);
    
    useEffect(() => {
        const fetchrespuestas = async () => {
            try {
                const external_id = getExternalID();
                const response = await GET(`/respuesta/misRespuestas/${external_id}`);
                setrespuestas(response.data);
            } catch (error) {
                console.error("Error obteniendo respuestas:", error);
            }
        };
        fetchrespuestas();
    }, []);
    return respuestas;
}
