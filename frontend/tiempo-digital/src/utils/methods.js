export const URL_API = "http://localhost:3007";

export async function GET(url, token){
    return fetch(URL_API+url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    }).then((response) => response.json());
}

export async function POST(url, data, token = ''){
    return fetch(URL_API+url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data),
    }).then((response) => response.json());
}

export async function PUT(url, data, token){
    return fetch(URL_API+url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data),
    }).then((response) => response.json());
}

