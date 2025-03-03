export async function fetchChicagoArtifacts({
  title = "asc",
  currentlyOnView = "false",
  page = 1,
}) {
  let fields = `fields=id,title,image_id,date_display,artist_title,gallery_title,description`;
  let url = `https://api.artic.edu/api/v1/artworks/search?page=${page}&limit=20&${fields}&query[term][is_on_view]=${currentlyOnView}`;

  const response = await fetch(url);
  const data = await response.json();
  return data.data || [];
}

export async function fetchChicagoArtifactById(id) {
  const url = `https://api.artic.edu/api/v1/artworks/${id}`;
  const response = await fetch(url);
  const data = await response.json();

  return data.data;
}
