import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { fetchClevelandArtifacts } from "../api/clevelandApiCalls";
import ArtifactCard from "../components/ArtifactCard.js";

export async function getServerSideProps({ query }) {
  const titleSortByQuery = query.title || "asc";
  const currentlyOnViewQuery = query.currently_on_view || "";

  try {
    const artifacts = await fetchClevelandArtifacts({
      title: titleSortByQuery,
      currentlyOnView: currentlyOnViewQuery,
    });
    return { props: { artifacts, initialTitleSort: titleSortByQuery, initialOnView: currentlyOnViewQuery } };
  } catch (error) {
    console.error("Server Fetch Error:", error);
    return {
      props: {
        artifacts: [],
        initialTitleSort: titleSortByQuery,
        initialOnView: currentlyOnViewQuery,
        error: "Failed to fetch artifacts.",
      },
    };
  }
}

export default function ArtifactContainer({ artifacts, initialTitleSort, initialOnView, error }) {
  const router = useRouter();
  const searchParams = new URLSearchParams(router.query);

  const [currentArtifacts, setCurrentArtifacts] = useState(artifacts);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(error || null);

  const titleSortByQuery = searchParams.get("title") || initialTitleSort;
  const currentlyOnViewQuery = searchParams.get("currently_on_view") || initialOnView;

  useEffect(() => {
    setLoading(true);
    setFetchError(null);

    const applySorting = () => {
      let sortedArtifacts = [...artifacts];

      if (titleSortByQuery === "asc") {
        sortedArtifacts.sort((a, b) => a.title.localeCompare(b.title));
      } else if (titleSortByQuery === "desc") {
        sortedArtifacts.sort((a, b) => b.title.localeCompare(a.title));
      }

      setCurrentArtifacts(sortedArtifacts);
      setLoading(false);
    };

    applySorting();
  }, [titleSortByQuery, artifacts]);

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

  return (
    <div>
      <h1>Fetched Cleveland Artifacts</h1>

      {/* Sorting Dropdowns */}
      <div>
        <p>Sort:</p>
        <label htmlFor="sort-select">Title by:</label>
      <select id="sort-select" onChange={handleSortChange} value={titleSortByQuery}>
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
          backgroundColor: currentlyOnViewQuery === "true" ? "#007bff" : "white",
          color: currentlyOnViewQuery === "true" ? "white" : "black",
          cursor: "pointer",
          transition: "background-color 0.2s",
        }}
      >
        {currentlyOnViewQuery === "true" ? "On View ✅" : "Show Available at Museum"}
      </button>
      </div>
      

      {/* Show only if an error occurs */}
      {fetchError && <p style={{ color: "red" }}>{fetchError}</p>}

      {/* Show loading when fetching */}
      {loading && <p>Loading...</p>}

      {/* Render Artifacts */}
      <div className="artifact-container">
        {currentArtifacts.length > 0 ? (
          currentArtifacts.map((artifact) => <ArtifactCard key={artifact.id} artifact={artifact} />)
        ) : (
          <p>No artifacts found</p>
        )}
      </div>
    </div>
  );
}
