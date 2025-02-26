export async function fetchClevelandArtifacts({
  title = "asc",
  currentlyOnView = "",
  page = 1,
  limit = 20,
} = {}) {
  const skip = (page - 1) * limit; // Calculate the number of items to skip

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
  console.log("skip", skip); // ✅ Debugging

  const response = await fetch(url);
  const data = await response.json();

  return data.data || [];
}
