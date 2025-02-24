export async function fetchClevelandArtifacts() {
  const response = await fetch(
    "https://openaccess-api.clevelandart.org/api/artworks?limit=10&has_image=1",
    { mode: "cors" }
  );
  const data = await response.json();
  console.log("Full API Response:", data); 
  return data.data || [];
}
