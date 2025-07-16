import { useEffect, useState } from "react";
import { GET } from "../utils/methods";
import { getExternalID } from "../utils/auth";

export default function useGetUser() {
    const [user, setUser] = useState(null); // Cambia el estado inicial a null

    useEffect(() => {
        const fetchuser = async () => {
            try {
                const external_id = getExternalID();
                const response = await GET(`/persona/${external_id}`);
                console.log("useGetUser", response.data);
                setUser(response.data); // Actualiza el estado con los datos obtenidos
            } catch (error) {
                console.error("Error obteniendo user:", error);
                setUser(null); // Asegúrate de manejar errores
            }
        };

        fetchuser();
    }, []);

    return user;
}
    