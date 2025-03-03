import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">Welcome to the Exhibition Curator</h1>
      <p className="mt-4">Which Museum/Exhibition would you like to view?:</p>

      <div className="mt-6 space-x-4">
        <Link href="/artifacts/Cleveland">
          <button className="px-4 py-2 bg-green-500 text-white rounded">The Cleveland Museum of Art</button>
        </Link>
        <Link href="/artifacts/Chicago">
          <button className="px-4 py-2 bg-red-500 text-white rounded">Art Institute of Chicago</button>
        </Link>
      </div>
    </div>
  );
}
