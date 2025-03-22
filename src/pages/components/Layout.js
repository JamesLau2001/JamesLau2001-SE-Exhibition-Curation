import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
export default function Layout({ children }) {
  const router = useRouter();

  const isFirstPage = router.pathname === "/";

  return (
    <div className="min-h-screen bg-gray-200">
      <Head>
        <title>The Exhibition Curation Platform</title>
      </Head>
      <Link href="/">
        <header className="py-6 bg-white shadow-md">
          <h1 className="text-4xl font-bold text-center text-gray-900">
            The Exhibition Curation Platform
          </h1>
        </header>
      </Link>

      {!isFirstPage && (
        <nav className="sticky top-0 container mx-auto p-6 border-2 border-gray-300 rounded-lg shadow-xl bg-white z-10 mt-6">
          <ul className="flex justify-between items-center max-w-4xl mx-auto">
            <li>
              <Link
                href="/"
                className="text-blue-800 hover:underline text-lg font-medium"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/artifacts/SavedArtifacts"
                className="text-blue-800 hover:underline text-lg font-medium"
              >
                Saved Artifacts
              </Link>
            </li>
          </ul>
        </nav>
      )}

      <main className="container mx-auto mt-6 p-6 border-2 border-gray-300 rounded-lg shadow-lg bg-white">
        {children}
      </main>
    </div>
  );
}
