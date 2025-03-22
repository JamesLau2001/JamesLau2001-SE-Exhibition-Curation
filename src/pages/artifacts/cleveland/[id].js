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

export default function ArtifactPage({
  artifact: initialArtifact,
  error,
  statusCode,
}) {
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
    return (
      <p className="text-red-600 text-center text-lg">
        {fetchError} {statusCode && `(Error Code: ${statusCode})`}
      </p>
    );
  if (loading)
    return <p className="text-center text-lg font-medium">Loading...</p>;
  if (!artifact)
    return (
      <p className="text-center text-lg font-medium">Artifact not found.</p>
    );

  const handleSave = () => {
    if (savedArtifacts.includes(initialArtifact.id)) {
      removeSavedArtifact(initialArtifact.id);
    } else {
      addSavedArtifact(initialArtifact.id);
    }
  };
  const stripHtmlTags = (html) => {
    if (!html) return "No description available.";
    return html.replace(/<[^>]*>/g, "").trim();
  };
  return (
    <article className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-center text-gray-900" tabIndex="0">
        {artifact.title}
      </h1>

      {artifact?.images?.web?.url ? (
        <div className="flex justify-center my-4">
          <Image
            src={artifact.images.web.url}
            alt={`Image of ${artifact.title || "Untitled"}`}
            width={500}
            height={500}
            className="rounded-lg shadow-lg"
            priority
          />
        </div>
      ) : (
        <p className="text-center text-gray-500">No Image Available</p>
      )}

      <section className="mt-4">
        <h2 className="text-xl font-semibold text-gray-800">Description</h2>
        <p className="text-gray-700 mt-2">
          {stripHtmlTags(artifact.description) || "No description available."}
        </p>
      </section>

      <section className="mt-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Artifact Details
        </h2>
        <p className="text-gray-700 mt-2">
          <strong>Created by:</strong>{" "}
          {artifact.creators?.[0]?.description || "Unknown"}
        </p>
        <p className="text-gray-700 mt-1">
          <strong>Created in:</strong> {artifact.creation_date || "Unknown"}
        </p>
        <p className="text-gray-700 mt-1">
          <strong>Located at:</strong>{" "}
          {`${artifact.current_location} (The Cleveland Museum of Art)` || "Location not specified"}
        </p>
      </section>

      <div className="mt-6 flex flex-col items-center">
        <button
          onClick={handleSave}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            savedArtifacts.includes(initialArtifact.id)
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-blue-700 text-white hover:bg-blue-700"
          }`}
        >
          {savedArtifacts.includes(initialArtifact.id)
            ? "Remove from Saved"
            : "Save Artifact"}
        </button>
      </div>
    </article>
  );
}
