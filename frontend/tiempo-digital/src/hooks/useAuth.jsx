import { POST } from "../utils/methods";
export async function authApi(data) {
    return POST("/cuenta/auth", data);
}

export async function registerApi(data) {
    return POST("/persona", data);
}