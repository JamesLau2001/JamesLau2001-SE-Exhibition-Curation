import React from "react";

const PaginationControls = ({
  currentPage,
  handlePageChange,
  currentArtifacts = [], 
}) => {
  return (
    <div className="flex items-center justify-center space-x-4 mt-6">
     
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        aria-label="Go the previous page"
        disabled={currentPage === 1}
        className={`px-4 py-2 rounded-md font-medium transition bg-gray-700 text-white hover:bg-gray-800 border border-gray-700 ${
          currentPage === 1
            ? "bg-gray-400 text-gray-700 cursor-not-allowed border-gray-400"
            : "bg-gray-700 text-white hover:bg-gray-800 border-gray-700"
        }`}
      >
        Previous
      </button>

     
      <span className="text-lg font-semibold text-gray-900">
        Page {currentPage}
      </span>

     
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        aria-label="Go the next page"
        className={`px-4 py-2 rounded-md font-medium transition bg-gray-700 text-white hover:bg-gray-800 border border-gray-700 ${
          !Array.isArray(currentArtifacts) || currentArtifacts.length < 20
            ? "bg-gray-400 text-gray-700 cursor-not-allowed border-gray-400"
            : "bg-gray-700 text-white hover:bg-gray-800 border-gray-700"
        }`}
        disabled={!Array.isArray(currentArtifacts) || currentArtifacts.length < 20}
      >
        Next
      </button>
    </div>
  );
};

export default PaginationControls;

