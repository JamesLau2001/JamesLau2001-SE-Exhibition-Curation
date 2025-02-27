import Link from "next/link";
import Image from "next/image";

const ArtifactCard = ({ artifact }) => {
  return (
    <div className="artifact-card">
      <Link href={`cleveland/${artifact.id}`} legacyBehavior>
        <div>
          {artifact?.images?.web?.url ? (
            <Image
              src={artifact.images.web.url}
              alt={
                artifact.title
                  ? `Image of ${artifact.title} by ${
                      artifact.creators?.[0]?.description || "Unknown Creator"
                    }`
                  : "No Image Available"
              }
              width={500}
              height={500}
            />
          ) : (
            <p>No Image Available</p>
          )}
          <h2>{artifact.title || "Untitled"}</h2>
        </div>
      </Link>
    </div>
  );
};

export default ArtifactCard;
