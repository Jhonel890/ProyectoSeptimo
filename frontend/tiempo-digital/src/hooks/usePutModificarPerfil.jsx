import { getExternalID, getToken } from "../utils/auth";
import { PUT } from "../utils/methods";

export async function putModificarPerfiles(data) {
    const token = getToken();
    const external_id = getExternalID();
    return PUT(`/persona/modificarPerfiles/${external_id}`,data, token);
}