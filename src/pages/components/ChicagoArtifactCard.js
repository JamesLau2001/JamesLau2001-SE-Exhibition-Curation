import Link from "next/link";
import Image from "next/image";

const ChicagoArtifactCard = ({ artifact }) => {
  const imageUrl = artifact?.image_id
    ? `https://www.artic.edu/iiif/2/${artifact.image_id}/full/843,/0/default.jpg`
    : null;

  return (
    <div className="artifact-card">
      <Link href={`chicago/${artifact.id}`} legacyBehavior>
        <div>
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={`Image of ${artifact.title || "Untitled"}`}
              width={500}
              height={500}
              unoptimized 
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

export default ChicagoArtifactCard;
