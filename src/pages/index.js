import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 font-roboto">
      <h1 className="text-4xl font-bold text-gray-900 text-center">
        Welcome to the Exhibition Curator
      </h1>

      <p className="mt-4 text-lg text-gray-700 text-center">
        Which Museum/Exhibition would you like to view?
      </p>

      <div className="mt-6 flex space-x-4">
        <Link href="/artifacts/Cleveland">
          <button className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg">
            The Cleveland Museum of Art
          </button>
        </Link>
        <Link href="/artifacts/Chicago">
          <button className="px-6 py-3 bg-red-600 text-white rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg">
            Art Institute of Chicago
          </button>
        </Link>
      </div>
    </div>
  );
}
