import { useEffect, useState } from "react";
import { GET } from "../utils/methods";
import { getExternalID } from "../utils/auth";

export default function useGetMisCoins() {

    const [coins, setCoins] = useState([]);
    
    useEffect(() => {
        const fetchcoins = async () => {
            try {
                const external_id = getExternalID();
                const response = await GET(`/persona/misCoins/${external_id}`);
                setCoins(response.monedas);
            } catch (error) {
                console.error("Error obteniendo coins:", error);
            }
        };
        fetchcoins();
    }, []);
    return coins;
}
