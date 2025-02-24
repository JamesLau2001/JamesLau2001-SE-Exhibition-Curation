import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">Welcome to the Exhibition Curator</h1>
      <p className="mt-4">Select an API to explore artifacts.</p>

      <div className="mt-6 space-x-4">
        <Link href="/select">
          <button className="px-4 py-2 bg-blue-500 text-white rounded">
            Choose API
          </button>
        </Link>
      </div>
    </div>
  );
}
