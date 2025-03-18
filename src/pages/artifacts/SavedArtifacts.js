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
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const itemsPerPage = 20;

  useEffect(() => {
    console.log("Context - Saved Cleveland Artifacts:", savedArtifacts);
    console.log("Context - Saved Chicago Artifacts:", savedChicagoArtifacts);

    const fetchArtifacts = async () => {
      setLoading(true);
      try {
        if (savedArtifacts.length === 0 && savedChicagoArtifacts.length === 0) {
          console.warn("No saved artifacts found, skipping fetch.");
          setArtifactDetails([]); // Ensure UI updates correctly
          return;
        }

        const skip = (currentPage - 1) * itemsPerPage;
        console.log(`Fetching page ${currentPage}, skip index: ${skip}`);

        const clevelandDetails = await Promise.all(
          savedArtifacts.slice(skip, skip + itemsPerPage).map(async (id, index) => {
            try {
              const data = await fetchClevelandArtifactById(id);
              console.log(`Fetched Cleveland Artifact ${index}:`, data);
              return data && data.id ? { ...data, source: "cleveland" } : null;
            } catch (err) {
              console.error(`Error fetching Cleveland artifact (ID: ${id}):`, err);
              return null;
            }
          })
        );

        const chicagoDetails = await Promise.all(
          savedChicagoArtifacts.slice(skip, skip + itemsPerPage).map(async (id, index) => {
            try {
              const data = await fetchChicagoArtifactById(id);
              console.log(`Fetched Chicago Artifact ${index}:`, data);
              return data && data.id ? { ...data, source: "chicago" } : null;
            } catch (err) {
              console.error(`Error fetching Chicago artifact (ID: ${id}):`, err);
              return null;
            }
          })
        );

        const newArtifacts = [...clevelandDetails, ...chicagoDetails].filter(Boolean);

        // ✅ Remove duplicates
        const uniqueArtifacts = Array.from(new Map(newArtifacts.map(item => [item.id, item])).values());

        console.log("Final list of fetched artifacts:", uniqueArtifacts);

        setArtifactDetails(uniqueArtifacts);
        setTotalPages(
          Math.ceil((savedArtifacts.length + savedChicagoArtifacts.length) / itemsPerPage)
        );
      } catch (err) {
        console.error("Error in fetchArtifacts:", err);
        setError("There was an error fetching the artifacts.");
      } finally {
        setLoading(false);
      }
    };

    // ✅ Prevent double fetching
    if (
      artifactDetails.length === 0 && 
      (savedArtifacts.length > 0 || savedChicagoArtifacts.length > 0)
    ) {
      fetchArtifacts();
    }
  }, [savedArtifacts, savedChicagoArtifacts, currentPage]);

  const handlePageChange = (direction) => {
    setCurrentPage((prev) => Math.min(Math.max(prev + direction, 1), totalPages));
    console.log(`Page changed to: ${currentPage + direction}`);
  };

  console.log("Rendering SavedArtifacts Component");
  console.log("Current Artifact Details:", artifactDetails);

  return (
    <div className="container mx-auto p-6 border-2 rounded-lg shadow-lg bg-white">
      <h1 className="text-2xl text-gray-900 font-bold text-center mb-6">
        Showing Artifacts Of: Your Saved Artifacts
      </h1>

      {error && <p className="text-red-600 text-center">{error}</p>}

      {loading && (
        <div className="flex justify-center items-center space-x-2">
          <div className="w-16 h-16 border-4 border-t-4 border-blue-500 rounded-full animate-spin"></div>
        </div>
      )}

      {artifactDetails.length > 0 && !loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {artifactDetails.map((artifact, index) => (
            <div key={artifact.id} className="border border-gray-300 rounded-lg p-4 shadow-md">
              {artifact.source === "cleveland" ? (
                <ArtifactCard artifact={artifact} />
              ) : (
                <ChicagoArtifactCard artifact={artifact} />
              )}
            </div>
          ))}
        </div>
      ) : (
        !loading && <p className="text-red-600 text-center">No saved artifacts found</p>
      )}
    </div>
  );
}
