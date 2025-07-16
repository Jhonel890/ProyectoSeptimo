import { useEffect, useState } from "react";
import { GET } from "../utils/methods";

export default function useGetPerfiles() {

    const [perfiles, setPerfiles] = useState([]);
    
    useEffect(() => {
        const fetchPerfiles = async () => {
            try {
                const response = await GET("/perfil");
                setPerfiles(response.data);
            } catch (error) {
                console.error("Error obteniendo perfiles:", error);
            }
        };
        fetchPerfiles();
    }, []);
    return perfiles;
}
