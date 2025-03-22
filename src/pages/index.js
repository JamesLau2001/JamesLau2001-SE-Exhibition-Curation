import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  
  const fetchMuseumData = (museum) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`Fetched data for ${museum}`);
      }, 1500);
    });
  };

  const handleMuseumSelect = async (museum) => {
    setLoading(true);

    try {
      const data = await fetchMuseumData(museum); 
      console.log(data); 

     
      router.push(`/artifacts/${museum}`);
    } catch (error) {
      console.error("Error fetching museum data:", error);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 font-roboto mt-2">
      <h1 className="text-4xl font-bold text-gray-900 text-center mb-4">
        Welcome to the Exhibition Curator
      </h1>

      <p className="mt-4 text-lg text-gray-900 text-center mb-8">
        Which Museum/Exhibition would you like to view?
      </p>

      {loading ? (
        <div className="flex justify-center items-center space-x-2 mb-6 pulse-border">
          <div className="w-16 h-16 border-4 border-t-4 border-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="mt-6 flex space-x-8 justify-center">
          <Link href="/artifacts/Cleveland">
            <div
              onClick={() => handleMuseumSelect("Cleveland")}
              className="flex flex-col items-center shadow-lg rounded-xl p-4 transition-transform transform hover:scale-105 hover:shadow-2xl border-2 border-gray-300 bg-gray-300"
            >
              <Image
                src="/Images/cma-logo-black-trans.png"
                alt="Cleveland Museum of Art"
                width={500}
                height={400}
                className="cursor-pointer rounded-lg mb-4"
              />
              <p className="text-lg font-semibold text-gray-700">
                Cleveland Museum of Art
              </p>
            </div>
          </Link>

          <Link href="/artifacts/Chicago">
            <div
              onClick={() => handleMuseumSelect("Chicago")}
              className="flex flex-col items-center shadow-lg rounded-xl p-4 transition-transform transform hover:scale-105 hover:shadow-2xl border-2 border-gray-300 bg-gray-300"
            >
              <Image
                src="/Images/Art_Institute_of_Chicago_logo.svg.png"
                alt="Art Institute of Chicago"
                width={500}
                height={400}
                className="cursor-pointer rounded-lg mb-4"
              />
              <p className="text-lg font-semibold text-gray-700">
                Art Institute of Chicago
              </p>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
