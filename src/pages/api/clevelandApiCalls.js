export async function fetchClevelandArtifacts({
  title = "asc",
  currentlyOnView = "",
} = {}) {
  let url = `https://openaccess-api.clevelandart.org/api/artworks?limit=20&has_image=1`;

  if (title === "asc") {
    url += `&+title`; 
  } else if (title === "desc") {
    url += `&-title`; 
  }

  if (currentlyOnView === "true") {
    url += `&currently_on_view`; 
  }

  const response = await fetch(url, { mode: "cors" });
  const data = await response.json();

  return data.data || [];
}
