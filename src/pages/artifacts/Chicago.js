import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { fetchChicagoArtifacts } from "../api/chicagoApiCalls";
import ChicagoArtifactCard from "../components/ChicagoArtifactCard";
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

    return {
      props: {
        artifacts,
        initialTitleSort: titleSortByQuery,
        initialOnView: currentlyOnViewQuery,
        initialPage: currentPage,
      },
    };
  } catch (error) {
    console.error("Server Fetch Error:", error);
    return {
      props: {
        artifacts: [],
        initialTitleSort: titleSortByQuery,
        initialOnView: currentlyOnViewQuery,
        initialPage: currentPage,
        error: "Failed to fetch artifacts.",
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

        let sortedArtifacts = [...updatedArtifacts];

        if (titleSortByQuery === "asc") {
          sortedArtifacts.sort((a, b) => a.title.localeCompare(b.title));
        } else if (titleSortByQuery === "desc") {
          sortedArtifacts.sort((a, b) => b.title.localeCompare(a.title));
        }

        setCurrentArtifacts(sortedArtifacts);
        setCurrentPage(pageQuery);
      } catch (err) {
        setFetchError("Failed to fetch artifacts.");
      }
      setLoading(false);
    };

    fetchAndSortArtifacts();
  }, [titleSortByQuery, currentlyOnView, pageQuery]);

  const handleSortChange = (event) => {
    const titleSort = event.target.value;
    searchParams.set("title", titleSort);
    router.push(
      {
        pathname: router.pathname,
        query: Object.fromEntries(searchParams),
      },
      undefined,
      { shallow: true }
    );
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

  const handlePageChange = (page) => {
    if (page < 1) return;
    searchParams.set("page", page);
    router.push(
      {
        pathname: router.pathname,
        query: Object.fromEntries(searchParams),
      },
      undefined,
      { shallow: true }
    );
    setCurrentPage(page);
  };
  return (
    <div>
      {/* Sorting Dropdowns */}
      <div>
        <p>Sort:</p>
        <label htmlFor="sort-select">Title by:</label>
        <select
          id="sort-select"
          onChange={handleSortChange}
          value={titleSortByQuery}
        >
          <option value="asc">A-Z</option>
          <option value="desc">Z-A</option>
        </select>
      </div>

      {/* Toggle Button for "Currently on View Feature" */}
      <div>
        <p>Filter by:</p>
        <button
          onClick={handleOnViewToggle}
          style={{
            border: "1px solid black",
            backgroundColor: currentlyOnView === "true" ? "#007bff" : "white",
            color: currentlyOnView === "true" ? "white" : "black",
            cursor: "pointer",
            transition: "background-color 0.2s",
          }}
        >
          {currentlyOnView === "true"
            ? "On View ✅"
            : "Show Available at Museum"}
        </button>
      </div>
      {/* Show only if an error occurs */}
      {fetchError && <p style={{ color: "red" }}>{fetchError}</p>}

      {/* Show loading when fetching */}
      {loading && <p>Loading...</p>}
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
      <div className="pagination-controls">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span> Page {currentPage} </span>
        <button onClick={() => handlePageChange(currentPage + 1)}>Next</button>
      </div>
    </div>
  );
}
