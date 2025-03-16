import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center p-6 font-roboto mt-10">
      <h1 className="text-4xl font-bold text-gray-900 text-center">
        Welcome to the Exhibition Curator
      </h1>

      <p className="mt-4 text-lg text-gray-700 text-center">
        Which Museum/Exhibition would you like to view?
      </p>

      <div className="mt-6 flex space-x-4">
        <Link href="/artifacts/Cleveland">
          <Image
            src="/Images/cma-logo-black-trans.png"
            alt="Cleveland Museum of Art"
            width={500}
            height={400}
            className="cursor-pointer shadow-md transition-transform transform hover:scale-105 hover:shadow-lg"
          />
        </Link>
        <Link href="/artifacts/Chicago">
          <Image
            src="/Images/Art_Institute_of_Chicago_logo.svg.png"
            alt="Art Institute of Chicago"
            width={500}
            height={400}
            className="cursor-pointer shadow-md transition-transform transform hover:scale-105 hover:shadow-lg"
          />
        </Link>
      </div>
    </div>
  );
}
