import { useRouter } from "next/router";
import Link from "next/link";

export default function Layout({ children }) {
  const router = useRouter();

  const isFirstPage = router.pathname === "/";

  return (
    <div>
      <Link href="/">
        <header className="py-6">
          <h1 className="text-4xl font-bold text-gray-900 text-center">
            My Exhibition Platform
          </h1>
        </header>
      </Link>

      {!isFirstPage && (
        <nav className="sticky top-0 container mx-auto p-6 border-2 border-gray-300 rounded-lg shadow-lg bg-white z-10">
          <ul className="flex justify-between items-center">
            <li>
              <Link href="/" className="text-blue-500 hover:underline">
                Home
              </Link>
            </li>
            <li className="flex-grow text-center">
              <Link
                href="/artifacts/SavedArtifacts"
                className="text-blue-500 hover:underline"
              >
                Saved Artifacts
              </Link>
            </li>
          </ul>
        </nav>
      )}

      <main className="p-6">{children}</main>
    </div>
  );
}
