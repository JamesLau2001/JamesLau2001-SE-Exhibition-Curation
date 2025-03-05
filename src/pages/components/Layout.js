import { useRouter } from "next/router";
import Link from "next/link";

export default function Layout({ children }) {
  const router = useRouter();

  const isFirstPage = router.pathname === "/";

  return (
    <div>
      <Link href="/">
        <header>
          <h1 className="text-2xl font-bold">My Exhibition Platform</h1>
        </header>
      </Link>

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
