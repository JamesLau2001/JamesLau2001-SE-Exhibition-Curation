export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "Missing artifact ID" });
  }

  const url = `https://openaccess-api.clevelandart.org/api/artworks/${id}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Failed to fetch artifact" });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching artifact:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
