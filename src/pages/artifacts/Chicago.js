import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { fetchChicagoArtifacts } from "../api/chicagoApiCalls";
import ChicagoArtifactCard from "../components/ChicagoArtifactCard";
import { handlePageChange } from "@/utils/paginationControls";
import { handleSortChange } from "@/utils/handleSortChange";
import PaginationControls from "../components/PaginationControls";
import FilterOnViewControls from "../components/ToggleOnViewControl";
export async function getServerSideProps({ query }) {
  const titleSortByQuery = query.title || "asc";
  const currentlyOnViewQuery = query.currently_on_view || "false";
  const currentPage = parseInt(query.page, 10) || 1;

  try {
    const artifacts = await fetchChicagoArtifacts({
      title: titleSortByQuery,
      currentlyOnView: currentlyOnViewQuery,
      page: currentPage,
    });

    if (artifacts?.error) {
      return {
        props: {
          artifacts: [],
          error: artifacts.message || "Failed to fetch artifacts.",
          statusCode: artifacts.statusCode || 500,
          initialTitleSort: titleSortByQuery,
          initialOnView: currentlyOnViewQuery,
          initialPage: currentPage,
        },
      };
    }

    return {
      props: {
        artifacts,
        initialTitleSort: titleSortByQuery,
        initialOnView: currentlyOnViewQuery,
        initialPage: currentPage,
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
}) {
  const router = useRouter();
  const searchParams = new URLSearchParams(router.query);

  const [currentArtifacts, setCurrentArtifacts] = useState(artifacts);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(error || null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [currentlyOnView, setCurrentlyOnView] = useState(initialOnView);

  const titleSortByQuery = searchParams.get("title") || initialTitleSort;
  const pageQuery = parseInt(searchParams.get("page"), 10) || initialPage;

  useEffect(() => {
    setLoading(true);
    setFetchError(null);

    const fetchAndSortArtifacts = async () => {
      try {
        const updatedArtifacts = await fetchChicagoArtifacts({
          title: titleSortByQuery,
          currentlyOnView,
          page: pageQuery,
        });

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
  }, [titleSortByQuery, currentlyOnView, pageQuery]);

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

  return (
    <div>
      <h1>Fetched Chicago Artifacts</h1>

      {/* Sorting Dropdowns */}
      <div>
        <p>Sort:</p>
        <label htmlFor="sort-select">Title by:</label>
        <select id="sort-select" onChange={handleSort} value={titleSortByQuery}>
          <option value="asc">A-Z</option>
          <option value="desc">Z-A</option>
        </select>
      </div>

      {/* Toggle Button for "Currently on View Feature" */}
      <FilterOnViewControls
        currentlyOnView={currentlyOnView}
        handleOnViewToggle={() =>
          handleOnViewToggle(router, searchParams, setCurrentlyOnView)
        }
      />

      {/* Show only if an error occurs */}
      {fetchError && (
        <p style={{ color: "red" }}>
          {fetchError} {statusCode && `(Error Code: ${statusCode})`}
        </p>
      )}

      {/* Show loading when fetching */}
      {loading && <p>Loading...</p>}

      {/* Render Artifacts */}
      <div className="artifact-container">
        {currentArtifacts.length > 0 ? (
          currentArtifacts.map((artifact) => (
            <ChicagoArtifactCard key={artifact.id} artifact={artifact} />
          ))
        ) : (
          <p>No artifacts found</p>
        )}
      </div>

      {/* Pagination Controls */}
      <PaginationControls
        currentPage={currentPage}
        handlePageChange={(page) =>
          handlePage(page, router, searchParams, setCurrentPage)
        }
      />
    </div>
  );
}
