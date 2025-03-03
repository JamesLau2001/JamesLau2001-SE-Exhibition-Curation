import "@/styles/globals.css";
import Layout from "./components/Layout";
import { SavedArtifactsProvider } from "@/contexts/ClevelandSavedArtifactsContext";
import { SavedChicagoArtifactsProvider } from "@/contexts/ChicagoSavedArtifactsContext";
export default function App({ Component, pageProps }) {
  return (
    <SavedArtifactsProvider>
      <SavedChicagoArtifactsProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SavedChicagoArtifactsProvider>
    </SavedArtifactsProvider>
  );
}
