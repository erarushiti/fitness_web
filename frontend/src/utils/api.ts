export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  let token = localStorage.getItem("accessToken");

  // Clone headers or create new object
  const headers = new Headers(options.headers);

  headers.set("Authorization", `Bearer ${token}`);

  // Only set Content-Type to application/json if body is a plain object/string (not FormData)
  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  } else {
    // Let browser set Content-Type with boundary for FormData
    headers.delete("Content-Type");
  }

  options.headers = headers;

  let response = await fetch(url, options);

  if (response.status === 401 || response.status === 403) {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) throw new Error("No refresh token");

    const refreshResponse = await fetch("/refresh-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!refreshResponse.ok) {
      console.log("Refresh token expired or invalid");
    }

    const { accessToken: newAccessToken } = await refreshResponse.json();
    localStorage.setItem("accessToken", newAccessToken);

    headers.set("Authorization", `Bearer ${newAccessToken}`);
    options.headers = headers;

    response = await fetch(url, options);
  }

  return response;
}
