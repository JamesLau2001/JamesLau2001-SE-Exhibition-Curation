// pages/_app.js

import "@/styles/globals.css";
import Layout from "./components/Layout";
import { SavedArtifactsProvider } from "@/contexts/SavedArtifactsContext";

export default function App({ Component, pageProps }) {
  return (
    <SavedArtifactsProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SavedArtifactsProvider>
  );
}
