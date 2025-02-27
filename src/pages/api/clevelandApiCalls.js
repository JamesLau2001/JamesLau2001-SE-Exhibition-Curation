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

  console.log("Fetching URL:", url);
  console.log("skip", skip); 

  const response = await fetch(url);
  const data = await response.json();

  return data.data || [];
}

export async function fetchClevelandArtifactById(id) {
  let url = `https://openaccess-api.clevelandart.org/api/artworks/${id}`;
  const response = await fetch(url);
  const data = await response.json();

  return data.data || {};
}
