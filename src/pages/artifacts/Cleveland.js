import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import {
  fetchClevelandArtifacts,
  fetchClevelandArtifactsByArtist,
} from "../api/clevelandApiCalls";
import ArtifactCard from "../components/ClevelandArtifactCard.js";
import { handlePageChange } from "@/utils/paginationControls";
import { handleSortChange } from "@/utils/handleSortChange";
import PaginationControls from "../components/PaginationControls";
import { useDebounce } from "@/utils/useDebounce";

export async function getServerSideProps({ query }) {
  const titleSortByQuery = query.title || "asc";
  const currentlyOnViewQuery = query.currently_on_view || "";
  const artistQuery = query.artist || "";
  const currentPage = parseInt(query.page, 10) || 1;

  try {
    let artifacts;
    if (artistQuery) {
      artifacts = await fetchClevelandArtifactsByArtist(
        artistQuery,
        currentPage,
        20
      );
    } else {
      artifacts = await fetchClevelandArtifacts({
        title: titleSortByQuery,
        currentlyOnView: currentlyOnViewQuery,
        page: currentPage,
      });
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
  initialArtist,
}) {
  const router = useRouter();
  const searchParams = useMemo(
    () => new URLSearchParams(router.query),
    [router.query]
  );

  const [currentArtifacts, setCurrentArtifacts] = useState(artifacts);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [artistSearch, setArtistSearch] = useState(initialArtist || "");

  const debouncedArtistSearch = useDebounce(artistSearch, 300);

  const titleSortByQuery = searchParams.get("title") || initialTitleSort;
  const currentlyOnViewQuery =
    searchParams.get("currently_on_view") || initialOnView;
  const pageQuery = parseInt(searchParams.get("page"), 10) || initialPage;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (pageQuery > 1 || debouncedArtistSearch.trim().length > 0) {
      setLoading(true);
      setFetchError(null);

      const fetchArtifacts = async () => {
        try {
          let updatedArtifacts;

          if (debouncedArtistSearch.trim().length > 0) {
            updatedArtifacts = await fetchClevelandArtifactsByArtist(
              debouncedArtistSearch,
              pageQuery,
              20
            );
          } else {
            if (searchParams.has("artist")) {
              searchParams.delete("artist");
              router.replace(
                {
                  pathname: router.pathname,
                  query: Object.fromEntries(searchParams),
                },
                undefined,
                { shallow: true }
              );
            }

            updatedArtifacts = await fetchClevelandArtifacts({
              title: titleSortByQuery,
              currentlyOnView: currentlyOnViewQuery,
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

      fetchArtifacts();
    } else {
      let sortedArtifacts = [...artifacts];

      if (titleSortByQuery === "asc") {
        sortedArtifacts.sort((a, b) => a.title.localeCompare(b.title));
      } else if (titleSortByQuery === "desc") {
        sortedArtifacts.sort((a, b) => b.title.localeCompare(a.title));
      }

      setCurrentArtifacts(sortedArtifacts);
      setCurrentPage(initialPage);
    }
  }, [
    titleSortByQuery,
    currentlyOnViewQuery,
    pageQuery,
    debouncedArtistSearch,
    artifacts,
    initialPage,
    searchParams,
    router,
  ]);

  return (
    <div className="container mx-auto p-6 border-2 rounded-lg shadow-lg bg-white">
      <h1 className="text-2xl text-gray-900 font-bold text-center mb-6">
        {artistSearch
          ? `Search Results for "${artistSearch}"`
          : "Fetched Cleveland Artifacts"}
      </h1>

      {/* Sorting, Search, and Toggle in the Same UI Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 p-3 rounded-md border border-gray-400 shadow-sm gap-3">
        {/* Sorting Dropdown */}
        <div className="flex items-center space-x-2">
          <p className="font-semibold text-gray-900">Sort:</p>
          <select
            id="sort-select"
            onChange={(e) => handleSortChange(e, router, searchParams)}
            value={titleSortByQuery}
            className="border border-gray-400 rounded-md px-3 py-1 bg-white text-gray-800"
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
            onChange={(e) => {
              setArtistSearch(e.target.value);
            }}
            className="px-4 py-2 border border-gray-400 rounded-md text-black"
            placeholder="Search for an artist..."
          />
        </div>

        {/* Toggle Button for "Currently on View Feature" */}
        <button
          onClick={() => {
            const newOnViewValue =
              currentlyOnViewQuery === "true" ? "false" : "true";
            searchParams.set("currently_on_view", newOnViewValue);
            router.push(
              {
                pathname: router.pathname,
                query: Object.fromEntries(searchParams),
              },
              undefined,
              { shallow: true }
            );
          }}
          className="px-4 py-2 rounded-md bg-gray-700 text-white hover:bg-gray-800"
        >
          {currentlyOnViewQuery === "true"
            ? "On View ✅"
            : "Show Available at Museum"}
        </button>
      </div>

      {/* Show errors properly */}
      {fetchError && <p className="text-red-600 text-center">{fetchError}</p>}

      {/* Loading Indicator */}
      {loading ? (
        <div className="flex justify-center items-center">
          <div className="w-16 h-16 border-4 border-t-4 border-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentArtifacts.length > 0 ? (
            currentArtifacts.map((artifact) => (
              <div
                key={artifact.id}
                className="border border-gray-300 rounded-lg p-4 shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-xl"
              >
                <ArtifactCard artifact={artifact} />
              </div>
            ))
          ) : (
            <p className="text-red-600 col-span-full text-center">
              No artifacts found
            </p>
          )}
        </div>
      )}

      {/* Pagination */}
      <div className="mt-6 flex justify-center">
        <PaginationControls
          currentPage={currentPage}
          handlePageChange={(page) =>
            handlePageChange(page, router, searchParams, setCurrentPage)
          }
        />
      </div>
    </div>
  );
}
