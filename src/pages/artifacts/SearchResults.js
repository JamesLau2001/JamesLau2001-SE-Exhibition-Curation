import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { fetchClevelandArtifactsByArtist } from "../api/clevelandApiCalls";
import ArtifactCard from "../components/ClevelandArtifactCard";
import PaginationControls from "../components/PaginationControls";
import { handlePageChange } from "@/utils/paginationControls"; 

export default function SearchResults() {
  const router = useRouter();
  const searchParams = new URLSearchParams(router.query);
  const { artist } = router.query;
  const currentPage = parseInt(searchParams.get("page"), 10) || 1;

  const [artifacts, setArtifacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  
  useEffect(() => {
    if (!artist) return;

    setLoading(true);
    setFetchError(null);

    fetchClevelandArtifactsByArtist(artist, currentPage)
      .then((data) => {
        if (data?.error) {
          setFetchError(data.message);
          setArtifacts([]);
        } else {
          setArtifacts(data);
        }
      })
      .catch(() => setFetchError("Failed to fetch search results."))
      .finally(() => setLoading(false));
  }, [artist, currentPage]);

  return (
    <div className="container mx-auto p-6 border-2 rounded-lg shadow-lg bg-white">
      <h1 className="text-2xl text-gray-900 font-bold text-center mb-6">
        {`Search Results for "${artist}"`}
      </h1>

      {fetchError && <p className="text-red-600 text-center">{fetchError}</p>}

      {loading ? (
        <div className="flex justify-center items-center">
          <div className="w-16 h-16 border-4 border-t-4 border-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.isArray(artifacts) && artifacts.length > 0 ? (
            artifacts.map((artifact) => (
              <ArtifactCard key={artifact.id} artifact={artifact} />
            ))
          ) : (
            <p className="text-red-600 col-span-full text-center">No artifacts found</p>
          )}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="mt-6 flex justify-center">
        <PaginationControls
          currentPage={currentPage}
          handlePageChange={(page) => handlePageChange(page, router, searchParams, () => {})}
        />
      </div>
    </div>
  );
}
