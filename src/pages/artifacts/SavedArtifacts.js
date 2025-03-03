import { useEffect, useState } from "react";
import { useSavedArtifacts } from "@/contexts/ClevelandSavedArtifactsContext";
import { useSavedChicagoArtifacts } from "@/contexts/ChicagoSavedArtifactsContext";

import ArtifactCard from "../components/ClevelandArtifactCard";
import ChicagoArtifactCard from "../components/ChicagoArtifactCard";
import { fetchClevelandArtifactById } from "../api/clevelandApiCalls";
import { fetchChicagoArtifactById } from "../api/chicagoApiCalls";

export default function SavedArtifacts() {
  const { savedArtifacts } = useSavedArtifacts();
  const { savedChicagoArtifacts } = useSavedChicagoArtifacts();
  const [artifactDetails, setArtifactDetails] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtifacts = async () => {
      try {
        console.log("Fetching artifacts for IDs:", [
          ...savedArtifacts,
          ...savedChicagoArtifacts,
        ]);

        const clevelandDetails = await Promise.all(
          savedArtifacts.map(async (id) => {
            try {
              const data = await fetchClevelandArtifactById(id);
              return { ...data, source: "cleveland" };
            } catch {
              return null;
            }
          })
        );

        const chicagoDetails = await Promise.all(
          savedChicagoArtifacts.map(async (id) => {
            try {
              const data = await fetchChicagoArtifactById(id);
              return { ...data, source: "chicago" };
            } catch {
              return null;
            }
          })
        );

        setArtifactDetails(
          [...clevelandDetails, ...chicagoDetails].filter(Boolean)
        );
      } catch (err) {
        console.error("Error in fetchArtifacts:", err);
        setError("There was an error fetching the artifacts.");
      }
    };

    if (savedArtifacts.length > 0 || savedChicagoArtifacts.length > 0) {
      fetchArtifacts();
    }
  }, [savedArtifacts, savedChicagoArtifacts]);

  return (
    <div>
      {error && <p>{error}</p>}
      {artifactDetails.length > 0 ? (
        artifactDetails.map((artifact) =>
          artifact.source === "cleveland" ? (
            <ArtifactCard key={artifact.id} artifact={artifact} />
          ) : (
            <ChicagoArtifactCard key={artifact.id} artifact={artifact} />
          )
        )
      ) : (
        <p>No saved artifacts found</p>
      )}
    </div>
  );
}
