import { createContext, useContext, useState } from "react";

const SavedChicagoArtifactsContext = createContext();

export function useSavedChicagoArtifacts() {
  return useContext(SavedChicagoArtifactsContext);
}

export function SavedChicagoArtifactsProvider({ children }) {
  const [savedChicagoArtifacts, setSavedChicagoArtifacts] = useState([]);

  const addSavedChicagoArtifact = (id) => {
    setSavedChicagoArtifacts((prev) => [...prev, id]);
  };

  const removeSavedChicagoArtifact = (id) => {
    setSavedChicagoArtifacts((prev) =>
      prev.filter((artifactId) => artifactId !== id)
    );
  };

  return (
    <SavedChicagoArtifactsContext.Provider
      value={{
        savedChicagoArtifacts,
        addSavedChicagoArtifact,
        removeSavedChicagoArtifact,
      }}
    >
      {children}
    </SavedChicagoArtifactsContext.Provider>
  );
}
