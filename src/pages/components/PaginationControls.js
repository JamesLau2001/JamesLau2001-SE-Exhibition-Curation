import React from "react";

const PaginationControls = ({ currentPage, handlePageChange }) => {
  return (
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
  );
};

export default PaginationControls;
