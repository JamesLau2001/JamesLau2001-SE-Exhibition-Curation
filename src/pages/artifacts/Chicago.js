import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { fetchChicagoArtifacts, fetchChicagoArtifactsByArtist } from "../api/chicagoApiCalls";
import ChicagoArtifactCard from "../components/ChicagoArtifactCard";
import { handlePageChange } from "@/utils/paginationControls";
import { handleSortChange } from "@/utils/handleSortChange";
import PaginationControls from "../components/PaginationControls";
import FilterOnViewControls from "../components/ToggleOnViewControl";
import { useDebounce } from "@/utils/useDebounce"; 

export async function getServerSideProps({ query }) {
  const titleSortByQuery = query.title || "asc";
  const currentlyOnViewQuery = query.currently_on_view || "false";
  const artistQuery = query.artist || ""; 
  const currentPage = parseInt(query.page, 10) || 1;

  try {
    let artifacts;
    if (artistQuery) {
      artifacts = await fetchChicagoArtifactsByArtist(
        artistQuery,
        currentPage,
        20
      );
    } else {
      artifacts = await fetchChicagoArtifacts({
        title: titleSortByQuery,
        currentlyOnView: currentlyOnViewQuery,
        page: currentPage,
      });
    }

    if (artifacts?.error) {
      return {
        props: {
          artifacts: [],
          error: artifacts.message || "Failed to fetch artifacts.",
          statusCode: artifacts.statusCode || 500,
          initialTitleSort: titleSortByQuery,
          initialOnView: currentlyOnViewQuery,
          initialPage: currentPage,
          initialArtist: artistQuery, 
        },
      };
    }

    return {
      props: {
        artifacts,
        initialTitleSort: titleSortByQuery,
        initialOnView: currentlyOnViewQuery,
        initialPage: currentPage,
        initialArtist: artistQuery, 
        error: null,
        statusCode: null,
      },
    };
  } catch (error) {
    return {
      props: {
        artifacts: [],
        error: "Failed to fetch artifacts.",
        statusCode: 500,
        initialTitleSort: titleSortByQuery,
        initialOnView: currentlyOnViewQuery,
        initialPage: currentPage,
        initialArtist: "",
      },
    };
  }
}

export default function ArtifactContainer({
  artifacts,
  initialTitleSort,
  initialOnView,
  initialPage,
  error,
  statusCode,
  initialArtist,
}) {
  const router = useRouter();
  const searchParams = new URLSearchParams(router.query);

  const [currentArtifacts, setCurrentArtifacts] = useState(artifacts);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(error || null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [currentlyOnView, setCurrentlyOnView] = useState(initialOnView);
  const [artistSearch, setArtistSearch] = useState(initialArtist || ""); 

  const debouncedArtistSearch = useDebounce(artistSearch, 300);  

  const titleSortByQuery = searchParams.get("title") || initialTitleSort;
  const pageQuery = parseInt(searchParams.get("page"), 10) || initialPage;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setLoading(true);
    setFetchError(null);

    const fetchAndSortArtifacts = async () => {
      try {
        let updatedArtifacts;

        
        if (debouncedArtistSearch.trim().length > 0) {
          updatedArtifacts = await fetchChicagoArtifactsByArtist(
            debouncedArtistSearch,
            pageQuery,
            20
          );
        } else {
          updatedArtifacts = await fetchChicagoArtifacts({
            title: titleSortByQuery,
            currentlyOnView,
            page: pageQuery,
          });
        }

        if (updatedArtifacts?.error) {
          setFetchError(updatedArtifacts.message);
          setCurrentArtifacts([]);
        } else {
          let sortedArtifacts = [...updatedArtifacts];

          if (titleSortByQuery === "asc") {
            sortedArtifacts.sort((a, b) => a.title.localeCompare(b.title));
          } else if (titleSortByQuery === "desc") {
            sortedArtifacts.sort((a, b) => b.title.localeCompare(a.title));
          }

          setCurrentArtifacts(sortedArtifacts);
          setCurrentPage(pageQuery);
        }
      } catch (err) {
        setFetchError("Failed to fetch artifacts.");
      }

      setLoading(false);
    };

    fetchAndSortArtifacts();
  }, [debouncedArtistSearch, titleSortByQuery, currentlyOnView, pageQuery]);

  const handleSort = (event) => {
    handleSortChange(event, router, searchParams);
  };

  const handleOnViewToggle = () => {
    const newOnViewValue = currentlyOnView === "true" ? "false" : "true";
    setCurrentlyOnView(newOnViewValue);
    searchParams.set("currently_on_view", newOnViewValue);
    router.push(
      {
        pathname: router.pathname,
        query: Object.fromEntries(searchParams),
      },
      undefined,
      { shallow: true }
    );
  };

  const handlePage = (page) => {
    handlePageChange(page, router, searchParams, setCurrentPage);
  };

  const handleSearchChange = (e) => {
    setArtistSearch(e.target.value); 
    searchParams.set("artist", e.target.value.trim()); 
    router.push(
      {
        pathname: router.pathname,
        query: Object.fromEntries(searchParams),
      },
      undefined,
      { shallow: true }
    );
  };

  return (
    <div className={`container mx-auto p-6 border-2 rounded-lg shadow-lg bg-white ${loading ? "pulse-border" : ""}`}>
      <h1 className="text-2xl text-gray-900 font-bold text-center mb-6">
        {artistSearch ? `Search Results for "${artistSearch}"` : "Fetched Chicago Artifacts"}
      </h1>

      {/* Sorting & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 p-3 rounded-md border border-gray-400 shadow-sm">
        <div className="flex items-center space-x-2">
          <p className="font-semibold text-gray-900">Sort:</p>
          <label htmlFor="sort-select" className="sr-only">
            Title by:
          </label>
          <select
            id="sort-select"
            onChange={handleSort}
            value={titleSortByQuery}
            className="border border-gray-400 rounded-md px-3 py-1 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-700"
          >
            <option value="asc">A-Z</option>
            <option value="desc">Z-A</option>
          </select>
        </div>

        {/* Search Bar */}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={artistSearch}
            onChange={handleSearchChange} 
            className="px-4 py-2 border border-gray-400 rounded-md text-black"
            placeholder="Search for an artist..."
          />
        </div>

        {/* Toggle Button for "Currently on View Feature" */}
        <button
          onClick={handleOnViewToggle}
          className="px-4 py-2 rounded-md font-medium transition bg-gray-700 text-white hover:bg-gray-800 border border-gray-700"
        >
          {currentlyOnView === "true"
            ? "On View ✅"
            : "Show Available at Museum"}
        </button>
      </div>

      {/* Show only if an error occurs */}
      {fetchError && (
        <p className="text-red-600 text-center">
          {fetchError} {statusCode && `(Error Code: ${statusCode})`}
        </p>
      )}

      {/* Show loading when fetching */}
      {loading && (
        <div className="flex justify-center items-center space-x-2">
          <div className="w-16 h-16 border-4 border-t-4 border-blue-500 rounded-full animate-spin"></div>
        </div>
      )}

      {/* Render Artifacts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentArtifacts.length > 0 ? (
          currentArtifacts.map((artifact) => (
            <div
              key={artifact.id}
              className="border border-gray-300 rounded-lg p-4 shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-xl"
            >
              <ChicagoArtifactCard artifact={artifact} />
            </div>
          ))
        ) : (
          <p className="text-red-600 col-span-full text-center">No artifacts found</p>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="mt-6 flex justify-center">
        <PaginationControls
          currentPage={currentPage}
          handlePageChange={(page) =>
            handlePage(page, router, searchParams, setCurrentPage)
          }
        />
      </div>
    </div>
  );
}
