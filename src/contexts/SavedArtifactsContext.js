// context/SavedArtifactsContext.js

import { createContext, useContext, useState } from "react";

const SavedArtifactsContext = createContext();

export function useSavedArtifacts() {
  return useContext(SavedArtifactsContext);
}

export function SavedArtifactsProvider({ children }) {
  const [savedArtifacts, setSavedArtifacts] = useState([]);

  const addSavedArtifact = (id) => {
    setSavedArtifacts((prev) => [...prev, id]);
  };

  const removeSavedArtifact = (id) => {
    setSavedArtifacts((prev) => prev.filter((artifactId) => artifactId !== id));
  };

  return (
    <SavedArtifactsContext.Provider
      value={{ savedArtifacts, addSavedArtifact, removeSavedArtifact }}
    >
      {children}
    </SavedArtifactsContext.Provider>
  );
}
