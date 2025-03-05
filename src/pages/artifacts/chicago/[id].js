import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { fetchChicagoArtifactById } from "@/pages/api/chicagoApiCalls";
import Image from "next/image";
import { useSavedChicagoArtifacts } from "@/contexts/ChicagoSavedArtifactsContext";

export async function getServerSideProps({ params }) {
  const { id } = params;

  try {
    const artifact = await fetchChicagoArtifactById(id);

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
      props: { artifact, error: null, statusCode: null },
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

export default function ChicagoArtifactPage({ artifact: initialArtifact, error, statusCode }) {
  const router = useRouter();
  const { id } = router.query;
  const [artifact, setArtifact] = useState(initialArtifact);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(error || null);
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
