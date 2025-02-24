import Link from "next/link";

export default function SelectAPI() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">Select an API</h1>
      <p className="mt-4">Choose an API to explore artifacts from:</p>

      <div className="mt-6 space-x-4">
        <Link href="/artifacts?source=cleveland">
          <button className="px-4 py-2 bg-green-500 text-white rounded">Cleveland API</button>
        </Link>
        <Link href="/artifacts?source=chicago">
          <button className="px-4 py-2 bg-red-500 text-white rounded">Chicago API</button>
        </Link>
      </div>
    </div>
  );
}
