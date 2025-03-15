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
    const fetchArtifacts = async () => {
      setLoading(true);
      try {
        console.log("Fetching artifacts for IDs:", [
          ...savedArtifacts,
          ...savedChicagoArtifacts,
        ]);

        const skip = (currentPage - 1) * itemsPerPage;

        const clevelandDetails = await Promise.all(
          savedArtifacts.slice(skip, skip + itemsPerPage).map(async (id) => {
            try {
              const data = await fetchClevelandArtifactById(id);
              return { ...data, source: "cleveland" };
            } catch {
              return null;
            }
          })
        );

        const chicagoDetails = await Promise.all(
          savedChicagoArtifacts
            .slice(skip, skip + itemsPerPage)
            .map(async (id) => {
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
        setTotalPages(
          Math.ceil(
            (savedArtifacts.length + savedChicagoArtifacts.length) /
              itemsPerPage
          )
        );
      } catch (err) {
        console.error("Error in fetchArtifacts:", err);
        setError("There was an error fetching the artifacts.");
      } finally {
        setLoading(false);
      }
    };

    if (savedArtifacts.length > 0 || savedChicagoArtifacts.length > 0) {
      fetchArtifacts();
    }
  }, [savedArtifacts, savedChicagoArtifacts, currentPage]);

  const handlePageChange = (direction) => {
    setCurrentPage((prev) =>
      Math.min(Math.max(prev + direction, 1), totalPages)
    );
  };

  const isLastPage = artifactDetails.length < itemsPerPage;

  return (
    <div
      className={`container mx-auto p-6 border-2 rounded-lg shadow-lg bg-white ${
        loading ? "pulse-border" : ""
      }`}
    >
      <h1 className="text-2xl text-gray-900 font-bold text-center mb-6">
        Here are your saved artifacts
      </h1>

      {/* Show error if there is any */}
      {error && <p className="text-red-600 text-center">{error}</p>}

      {/* Show loading spinner if data is being fetched */}
      {loading && (
        <div className="flex justify-center items-center space-x-2">
          <div className="w-16 h-16 border-4 border-t-4 border-blue-500 rounded-full animate-spin"></div>
        </div>
      )}

      {/* Render artifacts if available */}
      {artifactDetails.length > 0 && !loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {artifactDetails.map((artifact) =>
            artifact.source === "cleveland" ? (
              <div
                key={artifact.id}
                className="border border-gray-300 rounded-lg p-4 shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-xl"
              >
                <ArtifactCard artifact={artifact} />
              </div>
            ) : (
              <div
                key={artifact.id}
                className="border border-gray-300 rounded-lg p-4 shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-xl"
              >
                <ChicagoArtifactCard artifact={artifact} />
              </div>
            )
          )}
        </div>
      ) : !loading ? (
        <p className="col-span-full text-center text-gray-700">
          No saved artifacts found
        </p>
      ) : null}

      {/* Pagination Controls */}
      <div className="flex items-center justify-center space-x-4 mt-6">
        {/* Previous Button */}
        <button
          onClick={() => handlePageChange(-1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-md font-medium transition bg-gray-700 text-white hover:bg-gray-800 border border-gray-700 ${
            currentPage === 1
              ? "bg-gray-400 text-gray-700 cursor-not-allowed border-gray-400"
              : "bg-gray-700 text-white hover:bg-gray-800 border-gray-700"
          }`}
        >
          Previous
        </button>

        {/* Page Number */}
        <span className="text-lg font-semibold text-gray-900">
          {currentPage}
        </span>

        {/* Next Button */}
        <button
          onClick={() => handlePageChange(1)}
          disabled={
            currentPage === totalPages ||
            isLastPage ||
            artifactDetails.length === 0
          }
          className={`px-4 py-2 rounded-md font-medium transition bg-gray-700 text-white hover:bg-gray-800 border border-gray-700 ${
            currentPage === totalPages ||
            isLastPage ||
            artifactDetails.length === 0
              ? "bg-gray-400 text-gray-700 cursor-not-allowed border-gray-400"
              : "bg-gray-700 text-white hover:bg-gray-800 border-gray-700"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
