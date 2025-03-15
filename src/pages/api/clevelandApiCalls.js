export async function fetchClevelandArtifacts({
  title = "asc",
  currentlyOnView = "",
  page = 1,
  limit = 20,
} = {}) {
  const skip = (page - 1) * limit;
  let url = `https://openaccess-api.clevelandart.org/api/artworks?limit=${limit}&skip=${skip}&has_image=1`;

  if (title === "asc") {
    url += `&+title`;
  } else if (title === "desc") {
    url += `&-title`;
  }

  if (currentlyOnView === "true") {
    url += `&currently_on_view`;
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} - Failed to fetch artifacts`);
    }

    const data = await response.json();

    return data.data || [];
  } catch (error) {
    console.error("Fetch Error:", error.message);

    return {
      error: true,
      statusCode: error.message.includes("HTTP")
        ? parseInt(error.message.split(" ")[1], 10)
        : 500,
      message: error.message || "An unexpected error occurred",
    };
  }
}

export async function fetchClevelandArtifactById(id) {
  const baseUrl =
    typeof window === "undefined"
      ? process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
      : "";

  const url = `${baseUrl}/api/clevelandProxy?id=${id}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} - Failed to fetch artifact`);
    }

    const data = await response.json();
    return data.data || {};
  } catch (error) {
    console.error("Error fetching artifact:", error.message);

    return {
      error: true,
      statusCode: error.message.includes("HTTP")
        ? parseInt(error.message.split(" ")[1], 10)
        : 500,
      message: error.message || "An unexpected error occurred",
    };
  }
}

export async function fetchClevelandArtifactsByArtist(
  artist,
  page = 1,
  limit = 20
) {
  if (!artist.trim()) return [];

  const baseUrl =
    typeof window === "undefined"
      ? process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
      : "";

  const url = `${baseUrl}/api/clevelandArtistProxy?artist=${encodeURIComponent(
    artist
  )}&page=${page}&limit=${limit}`;

  try {
    console.log("Making API request to:", url);
    const response = await fetch(url, {
      method: "GET",
    });

    if (!response.ok) {
      console.error("HTTP error! Status:", response.status);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Fetched data:", data);

    if (data.data && data.data.length > 0) {
      console.log("Data contains artifacts:", data.data);
      return data.data;
    } else {
      console.log("No artifacts found for artist:", artist);
      return [];
    }
  } catch (error) {
    console.error("Fetch Error:", error.message);
    return { error: true, message: error.message };
  }
}
