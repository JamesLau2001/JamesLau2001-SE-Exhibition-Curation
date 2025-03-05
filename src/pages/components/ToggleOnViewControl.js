import React from "react";

const FilterOnViewControls = ({ currentlyOnView, handleOnViewToggle }) => {
  return (
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
        {currentlyOnView === "true" ? "On View ✅" : "Show Available at Museum"}
      </button>
    </div>
  );
};

export default FilterOnViewControls;
