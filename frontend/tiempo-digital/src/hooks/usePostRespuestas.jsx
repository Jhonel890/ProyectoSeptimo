import { getExternalID, getToken } from "../utils/auth";
import { POST } from "../utils/methods";

export async function postRespuestas(data) {
    const token = getToken();
    const external_id = getExternalID();
    const subdata = { ...data, persona:external_id };
    return POST("/respuesta", subdata, token);
}