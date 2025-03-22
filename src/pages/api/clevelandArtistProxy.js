export default async function handler(req, res) {
  const { artist, page = 1, limit = 20 } = req.query;

  if (!artist) {
    return res.status(400).json({ error: "Missing artist query" });
  }

  const skip = (page - 1) * limit;
  const url = `https://openaccess-api.clevelandart.org/api/artworks?limit=${limit}&skip=${skip}&has_image=1&q=${encodeURIComponent(
    artist
  )}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Failed to fetch artist artifacts" });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
