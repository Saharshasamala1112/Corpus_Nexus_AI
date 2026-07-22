export function getToken(): string | null {
  return localStorage.getItem("token");
}

export function removeToken(): void {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("phone");
}
