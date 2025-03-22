import Link from "next/link";
import Image from "next/image";

const ChicagoArtifactCard = ({ artifact }) => {
  const imageUrl = artifact?.image_id
    ? `https://www.artic.edu/iiif/2/${artifact.image_id}/full/843,/0/default.jpg`
    : null;

  if (!artifact || !artifact.id) {
    return (
      <div className="flex items-center justify-center h-60 bg-gray-200" role="alert" aria-live="assertive">
        <p className="text-gray-600">Artifact data unavailable</p>
      </div>
    );
  }

  return (
    <div>
      <Link href={`chicago/${artifact.id}`} legacyBehavior>
        <div className="cursor-pointer" aria-labelledby={`artifact-${artifact.id}`}>
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={`Image of ${artifact.title || "Untitled"}`}
              width={400}
              height={300}
              className="w-full h-60 object-contain"
              priority
            />
          ) : (
            <div className="flex items-center justify-center h-60 bg-gray-200" aria-label="No Image Available">
              <p className="text-gray-600">No Image Available</p>
            </div>
          )}
          <div
            className="p-4 bg-white text-center flex items-center justify-center h-[3rem]"
            aria-label={`Artifact: ${artifact.title || "Untitled"}`}
          >
            <h2
              id={`artifact-${artifact.id}`}
              className="text-lg font-semibold text-gray-800 overflow-hidden text-ellipsis text-center leading-snug"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                maxHeight: "3rem",
              }}
            >
              {artifact.title || "Untitled"}
            </h2>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ChicagoArtifactCard;
