import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { fetchClevelandArtifactById } from "@/pages/api/clevelandApiCalls";
import Image from "next/image";
import { useSavedArtifacts } from "@/contexts/ClevelandSavedArtifactsContext";

export async function getServerSideProps({ params }) {
  const { id } = params;

  try {
    const artifact = await fetchClevelandArtifactById(id);

    if (artifact?.error) {
      return {
        props: {
          artifact: null,
          error: artifact.message,
          statusCode: artifact.statusCode,
        },
      };
    }

    if (!artifact || Object.keys(artifact).length === 0) {
      return { notFound: true };
    }

    return {
      props: { artifact, error: null, statusCode: null }
    };
  } catch (error) {
    return {
      props: {
        artifact: null,
        error: "Failed to fetch artifact.",
        statusCode: 500,
      },
    };
  }
}

export default function ArtifactPage({ artifact: initialArtifact, error, statusCode }) {
  const router = useRouter();
  const { id } = router.query;
  const { savedArtifacts, addSavedArtifact, removeSavedArtifact } =
    useSavedArtifacts();
  const [artifact, setArtifact] = useState(initialArtifact);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(error || null);

  useEffect(() => {
    const fetchArtifact = async () => {
      if (!artifact && id) {
        setLoading(true);
        try {
          const data = await fetchClevelandArtifactById(id);

          if (data?.error) {
            setFetchError(data.message);
            setArtifact(null);
          } else {
            setArtifact(data);
          }
        } catch {
          setFetchError("Failed to load artifact.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchArtifact();
  }, [id, artifact]);

  if (fetchError)
    return <p style={{ color: "red" }}>{fetchError} {statusCode && `(Error Code: ${statusCode})`}</p>;
  if (loading) return <p>Loading...</p>;
  if (!artifact) return <p>Artifact not found.</p>;

  const handleSave = () => {
    if (savedArtifacts.includes(initialArtifact.id)) {
      removeSavedArtifact(initialArtifact.id); 
    } else {
      addSavedArtifact(initialArtifact.id); 
    }
  };

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

      <div>
        <h1>{initialArtifact.title}</h1>
        <button onClick={handleSave}>
          {savedArtifacts.includes(initialArtifact.id)
            ? "Remove from Saved"
            : "Save Artifact"}
        </button>
      </div>
    </article>
  );
}
