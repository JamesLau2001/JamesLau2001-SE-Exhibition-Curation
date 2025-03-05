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
