import { useEffect, useState } from "react";
import { GET } from "../utils/methods";
import { getExternalID } from "../utils/auth";

export default function useGetPreguntas(refetchTrigger) {
    const [preguntas, setPreguntas] = useState([]);

    useEffect(() => {
        const fetchPreguntas = async () => {
            try {
                const external_id = getExternalID();
                const response = await GET(`/inquietud/persona/${external_id}`);
                setPreguntas(response.data);
            } catch (error) {
                console.error("Error obteniendo preguntas:", error);
            }
        };
        fetchPreguntas();
    }, [refetchTrigger]);

    return preguntas;
}


export function useGetPregunta(external_id) {
    const [pregunta, setPregunta] = useState(null); // Cambié el nombre a pregunta ya que es una sola
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        const fetchPregunta = async () => {
            setIsLoading(true);
            try {
                const response = await GET(`/inquietud/${external_id}`);
                setPregunta(response.data);
            } catch (error) {
                console.error("Error obteniendo pregunta:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (external_id) {
            fetchPregunta();
        }
    }, [external_id]); // Agregamos el array de dependencias

    return { pregunta, isLoading };
}