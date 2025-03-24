import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  fetchChicagoArtifacts,
  fetchChicagoArtifactsByArtist,
} from "../api/chicagoApiCalls";
import ChicagoArtifactCard from "../components/ChicagoArtifactCard";
import { handlePageChange } from "@/utils/paginationControls";
import { handleSortChange } from "@/utils/handleSortChange";
import { handleSearchInputChange } from "@/utils/handleSearchChange";
import { handleOnViewToggleUtil } from "@/utils/handleOnViewToggle";
import PaginationControls from "../components/PaginationControls";

import { useDebounce } from "@/utils/useDebounce";
import SortingAndFilter from "../components/SortingAndFilter";

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
    handleOnViewToggleUtil({
      currentlyOnView,
      setCurrentlyOnView,
      router,
      searchParams,
    });
  };

  const handlePage = (page) => {
    handlePageChange(page, router, searchParams, setCurrentPage);
  };

  const [lastPageBeforeSearch, setLastPageBeforeSearch] = useState(initialPage);

  const handleSearchChange = (e) => {
    handleSearchInputChange({
      e,
      router,
      searchParams,
      artistSearch,
      setArtistSearch,
      setLastPageBeforeSearch,
      lastPageBeforeSearch,
      currentPage,
    });
  };

  return (
    <div
      className={`container mx-auto p-6 border-2 bg-white ${
        loading ? "pulse-border" : ""
      }`}
      role="region"
      aria-labelledby="artifact-container-heading"
    >
      <h1
        id="artifact-container-heading"
        className="text-2xl text-gray-900 font-bold text-center mb-6"
        role="heading"
        aria-level="1"
      >
        {artistSearch
          ? `Showing Artifacts Of Search Results for: "${artistSearch}"`
          : "Showing Artifacts For: Art Institute of Chicago"}
      </h1>

      <SortingAndFilter
        artistSearch={artistSearch}
        handleSort={handleSort}
        titleSortByQuery={titleSortByQuery}
        handleSearchChange={handleSearchChange}
        handleOnViewToggle={handleOnViewToggle}
        currentlyOnView={currentlyOnView}
      />

      {fetchError && (
        <p
          className="text-red-600 text-center"
          role="alert"
          aria-live="assertive"
        >
          {fetchError} {statusCode && `(Error Code: ${statusCode})`}
        </p>
      )}

      {loading && (
        <div className="flex justify-center items-center space-x-2">
          <div
            className="w-16 h-16 border-4 border-t-4 border-blue-500 rounded-full animate-spin"
            role="status"
            aria-live="polite"
            aria-label="Loading artifacts"
          ></div>
        </div>
      )}

      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        role="list"
      >
        {currentArtifacts.length > 0 ? (
          currentArtifacts.map((artifact) => (
            <div
              key={artifact.id}
              className="border border-gray-300 rounded-lg p-4 shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-xl"
              role="listitem"
              aria-labelledby={`artifact-${artifact.id}`}
            >
              <ChicagoArtifactCard artifact={artifact} key={artifact.id} />
            </div>
          ))
        ) : (
          <p
            className="text-red-600 col-span-full text-center"
            role="status"
            aria-live="assertive"
          >
            No artifacts found
          </p>
        )}
      </div>

      <div className="mt-6 flex justify-center">
        <PaginationControls
          currentPage={currentPage}
          handlePageChange={handlePage}
          currentArtifacts={currentArtifacts}
        />
      </div>
    </div>
  );
}
