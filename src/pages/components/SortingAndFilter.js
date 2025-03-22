import React from "react";

const SortingAndFilter = ({artistSearch, handleSort, titleSortByQuery, handleSearchChange, handleOnViewToggle, currentlyOnView}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 p-3 rounded-md border border-gray-400 shadow-sm">
      <div className="flex items-center space-x-2">
        <p className="font-semibold text-gray-900">Sort:</p>
        <label htmlFor="sort-select" className="sr-only"></label>
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

      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={artistSearch}
          onChange={handleSearchChange}
          className="px-4 py-2 border border-gray-400 rounded-md text-black"
          placeholder="Search for ..."
        />
      </div>

      <div className="flex items-center space-x-2">
        <p className="font-semibold text-gray-900">Toggle:</p>
        <button
          onClick={handleOnViewToggle}
          className="px-4 py-2 rounded-md font-medium transition bg-gray-700 text-white hover:bg-gray-800 border border-gray-700 min-w-[200px]"
        >
          {currentlyOnView === "true" ? "All Artifacts" : "Available at Museum"}
        </button>
      </div>
    </div>
  );
};

export default SortingAndFilter