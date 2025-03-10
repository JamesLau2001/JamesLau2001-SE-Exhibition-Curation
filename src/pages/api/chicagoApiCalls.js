export async function fetchChicagoArtifacts({
  title = "asc",
  currentlyOnView = "false",
  page = 1,
}) {
  let fields = `fields=id,title,image_id,date_display,artist_title,gallery_title,description`;
  let url = `https://api.artic.edu/api/v1/artworks/search?page=${page}&limit=20&${fields}&query[term][is_on_view]=${currentlyOnView}`;

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

export async function fetchChicagoArtifactById(id) {
  const url = `https://api.artic.edu/api/v1/artworks/${id}`;

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


export async function fetchChicagoArtifactsByArtist(artist, page = 1, limit = 20) {
  if (!artist.trim()) return [];

  let fields = `fields=id,title,image_id,date_display,artist_title,gallery_title,description`;
  const url = `https://api.artic.edu/api/v1/artworks/search?page=${page}&limit=${limit}&${fields}&q=${encodeURIComponent(artist)}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch artist artifacts");
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Artist Search Fetch Error:", error);
    return { error: true, message: error.message };
  }
}


