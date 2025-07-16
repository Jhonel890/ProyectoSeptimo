export function isSessionActive() {
  return localStorage.getItem("token") !== null;
}

export function setSession(token) {
  localStorage.setItem("token", token);
}

export function closeSession() {
  localStorage.removeItem("token");
}

export function getToken() {
  return localStorage.getItem("token");
}

export function setUser(user) {
  localStorage.setItem("user", user);
}

export function getUser() {
  return localStorage.getItem("user");
}

export function closeUser() {
  localStorage.removeItem("user");
}

export function setRole(role) {
  localStorage.setItem("role", role);
}

export function getRole() {
  return localStorage.getItem("role");
}

export function closeRole() {
  localStorage.removeItem("role");
}

export function setExternalID(external_id) {
  localStorage.setItem("external_id", external_id);
}

export function getExternalID() {
  return localStorage.getItem("external_id");
}

export function closeExternalID() {
  localStorage.removeItem("external_id");
}


export function setAll(token, user, role, external_id) {
  setSession(token);
  setUser(user);
  setRole(role);
  setExternalID(external_id);
}

