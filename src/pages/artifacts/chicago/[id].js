import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { fetchChicagoArtifactById } from "@/pages/api/chicagoApiCalls";
import Image from "next/image";
import { useSavedChicagoArtifacts } from "@/contexts/ChicagoSavedArtifactsContext";

export async function getServerSideProps({ params }) {
  const { id } = params;

  try {
    const artifact = await fetchChicagoArtifactById(id);

    if (!artifact || Object.keys(artifact).length === 0) {
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

export default function ChicagoArtifactPage({ artifact: initialArtifact }) {
  const router = useRouter();
  const { id } = router.query;
  const [artifact, setArtifact] = useState(initialArtifact);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const {
    savedChicagoArtifacts,
    addSavedChicagoArtifact,
    removeSavedChicagoArtifact,
  } = useSavedChicagoArtifacts();

  const imageUrl = artifact?.image_id
    ? `https://www.artic.edu/iiif/2/${artifact.image_id}/full/843,/0/default.jpg`
    : null;

  useEffect(() => {
    const fetchArtifact = async () => {
      if (!artifact && id) {
        setLoading(true);
        try {
          const data = await fetchChicagoArtifactById(id);
          setArtifact(data);
        } catch {
          setError("Failed to load artifact.");
        }
        setLoading(false);
      }
    };

    fetchArtifact();
  }, [id, artifact]);

  if (error) return <p>Error: {error}</p>;
  if (loading) return <p>Loading...</p>;
  if (!artifact) return <p>Artifact not found.</p>;

  const handleSave = () => {
    if (savedChicagoArtifacts.includes(initialArtifact.id)) {
      removeSavedChicagoArtifact(initialArtifact.id); 
    } else {
      addSavedChicagoArtifact(initialArtifact.id); 
    }
  };
  const stripHtmlTags = (html) => {
    if (!html) return "No description available.";
    return html.replace(/<[^>]*>/g, "").trim();
  };
  return (
    <article>
      <h1 tabIndex="0">{artifact.title}</h1>
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={`Image of ${artifact.title || "Untitled"}`}
          width={500}
          height={500}
          unoptimized 
        />
      ) : (
        <p>No Image Available</p>
      )}
      <section>
        <h2>Description</h2>
        <p>{stripHtmlTags(artifact.description) || "No description available."}</p>
      </section>
      <section>
        <h2>Artifact Details</h2>
        <p>
          <strong>Created by:</strong> {artifact.artist_title || "Unknown"}
        </p>
        <p>
          <strong>Created in:</strong> {artifact.date_display || "Unknown"}
        </p>
        <p>
          <strong>Located at:</strong>{" "}
          {artifact.gallery_title || "Not available at this museum"}
        </p>
      </section>
      <div>
        <button onClick={handleSave}>
          {savedChicagoArtifacts.includes(initialArtifact.id)
            ? "Remove from Saved"
            : "Save Artifact"}
        </button>
      </div>
    </article>
  );
}
