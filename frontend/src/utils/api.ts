export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  let token = localStorage.getItem("accessToken");

  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  let response = await fetch(url, options);

  if (response.status === 401 || response.status === 403) {
    // Try to refresh token
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) throw new Error("No refresh token");

    const refreshResponse = await fetch("/refresh-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!refreshResponse.ok) {
      throw new Error("Refresh token expired or invalid");
    }

    const { accessToken: newAccessToken } = await refreshResponse.json();
    localStorage.setItem("accessToken", newAccessToken);

    // Retry original request with new token
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${newAccessToken}`,
    };

    response = await fetch(url, options);
  }

  return response;
}
