import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { fetchClevelandArtifactById } from "@/pages/api/clevelandApiCalls";
import Image from "next/image";
export async function getServerSideProps({ params }) {
  const { id } = params;

  try {
    const artifact = await fetchClevelandArtifactById(id);

    if (!artifact) {
      return { notFound: true };
    }

    return {
      props: { artifact },
    };
  } catch (error) {
    return {
      props: { artifact: null, error: "Failed to fetch artifact." },
    };
  }
}

export default function ArtifactPage({ artifact: initialArtifact }) {
  const router = useRouter();
  const { id } = router.query;

  const [artifact, setArtifact] = useState(initialArtifact);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!artifact && id) {
      setLoading(true);
      fetchClevelandArtifactById(id)
        .then((data) => {
          setArtifact(data);
          setLoading(false);
        })
        .catch(() => {
          setError("Failed to load artifact.");
          setLoading(false);
        });
    }
  }, [id]);

  if (error) return <p>Error: {error}</p>;
  if (loading) return <p>Loading...</p>;
  if (!artifact) return <p>Artifact not found.</p>;

  return (
    <article>
      <h1 tabIndex="0">{artifact.title}</h1>

      {artifact?.images?.web?.url ? (
        <Image
          src={artifact.images.web.url}
          alt={
            artifact.title
              ? `Image of ${artifact.title} by ${
                  artifact.creators?.[0]?.description || "Unknown Creator"
                }`
              : "No Image Available"
          }
          width={500}
          height={500}
        />
      ) : (
        <p>No Image Available</p>
      )}

      <section>
        <h2>Description</h2>
        <p>{artifact.description || "No description available."}</p>
      </section>

      <section>
        <h2>Artifact Details</h2>
        <p>
          <strong>Created by:</strong>{" "}
          {artifact.creators?.[0]?.description || "Unknown"}
        </p>
        <p>
          <strong>Created in:</strong> {artifact.creation_date || "Unknown"}
        </p>
        <p>
          <strong>Located at:</strong>{" "}
          {artifact.current_location || "Location not specified"}
        </p>
      </section>
    </article>
  );
}
