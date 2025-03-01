import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { fetchClevelandArtifacts } from "../api/clevelandApiCalls";
import ArtifactCard from "../components/ArtifactCard.js";

export async function getServerSideProps({ query }) {
  const source = query.source || "cleveland";
  const titleSortByQuery = query.title || "asc";
  const currentlyOnViewQuery = query.currently_on_view || "";
  const currentPage = parseInt(query.page, 10) || 1;

  if (source !== "cleveland") {
    return {
      props: {
        artifacts: [],
        initialTitleSort: titleSortByQuery,
        initialOnView: currentlyOnViewQuery,
        initialPage: currentPage,
      },
    };
  }

  try {
    const artifacts = await fetchClevelandArtifacts({
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

  const titleSortByQuery = searchParams.get("title") || initialTitleSort;
  const currentlyOnViewQuery =
    searchParams.get("currently_on_view") || initialOnView;
  const pageQuery = parseInt(searchParams.get("page"), 10) || initialPage;

  useEffect(() => {
    if (pageQuery > 1) {
      setLoading(true);
      setFetchError(null);

      const fetchAndSortArtifacts = async () => {
        try {
          const updatedArtifacts = await fetchClevelandArtifacts({
            title: titleSortByQuery,
            currentlyOnView: currentlyOnViewQuery,
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
    artifacts,
    initialPage,
  ]);

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
    const newOnViewValue = currentlyOnViewQuery === "true" ? "false" : "true";
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
      <h1>Fetched Cleveland Artifacts</h1>

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
            backgroundColor:
              currentlyOnViewQuery === "true" ? "#007bff" : "white",
            color: currentlyOnViewQuery === "true" ? "white" : "black",
            cursor: "pointer",
            transition: "background-color 0.2s",
          }}
        >
          {currentlyOnViewQuery === "true"
            ? "On View ✅"
            : "Show Available at Museum"}
        </button>
      </div>

      {/* Show only if an error occurs */}
      {fetchError && <p style={{ color: "red" }}>{fetchError}</p>}

      {/* Show loading when fetching */}
      {loading && <p>Loading...</p>}

      {/* Render Artifacts */}
      <div className="artifact-container">
        {currentArtifacts.length > 0 ? (
          currentArtifacts.map((artifact) => (
            <ArtifactCard key={artifact.id} artifact={artifact} />
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
