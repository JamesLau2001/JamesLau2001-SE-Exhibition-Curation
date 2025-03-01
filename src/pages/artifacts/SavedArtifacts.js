import { useEffect, useState } from "react";
import { useSavedArtifacts } from "@/contexts/SavedArtifactsContext";
import ArtifactCard from "../components/ArtifactCard";
import { fetchClevelandArtifactById } from "../api/clevelandApiCalls";

export default function SavedArtifacts() {
  const { savedArtifacts } = useSavedArtifacts();
  const [artifactDetails, setArtifactDetails] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtifacts = async () => {
      try {
        console.log("Fetching artifacts for IDs:", savedArtifacts);
        const details = await Promise.all(
          savedArtifacts.map(async (id) => {
            try {
              const data = await fetchClevelandArtifactById(id);
              console.log(`Fetched artifact ${id}:`, data);
              return data;
            } catch (fetchError) {
              console.error(`Error fetching artifact ${id}:`, fetchError);
              return null;
            }
          })
        );
        setArtifactDetails(details.filter(Boolean));
      } catch (err) {
        console.error("Error in fetchArtifacts:", err);
        setError("There was an error fetching the artifacts.");
      }
    };

    if (savedArtifacts.length > 0) {
      fetchArtifacts();
    }
  }, [savedArtifacts]);

  return (
    <div>
      {error && <p>{error}</p>}
      {artifactDetails.length > 0 ? (
        artifactDetails.map((artifact) => {
          console.log("Artifact data:", artifact);
          return <ArtifactCard key={artifact.id} artifact={artifact} />;
        })
      ) : (
        <p>No artifacts found</p>
      )}
    </div>
  );
}
