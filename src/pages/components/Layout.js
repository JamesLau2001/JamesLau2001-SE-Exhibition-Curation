import { useRouter } from "next/router";
import Link from "next/link";

export default function Layout({ children }) {
  const router = useRouter();

  const isFirstPage = router.pathname === "/";

  return (
    <div>
      <header>
        <h1 className="text-2xl font-bold">My Exhibition Platform</h1>
      </header>

      {!isFirstPage && (
        <nav>
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/artifacts/SavedArtifacts">SavedArtifacts</Link>
            </li>
          </ul>
        </nav>
      )}

      <main className="p-6">{children}</main>
    </div>
  );
}
