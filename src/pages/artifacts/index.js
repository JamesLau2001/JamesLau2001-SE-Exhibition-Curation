import { useRouter } from "next/router";

export default function Artifacts() {
  const router = useRouter();
  const { source } = router.query; // Get the selected API from URL

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">Viewing Artifacts</h1>
      <p className="mt-4">You selected: <strong>{source ? source.toUpperCase() : "None"}</strong></p>

      <button 
        onClick={() => router.push("/select")} 
        className="mt-6 px-4 py-2 bg-gray-500 text-white rounded"
      >
        Change API
      </button>
    </div>
  );
}
