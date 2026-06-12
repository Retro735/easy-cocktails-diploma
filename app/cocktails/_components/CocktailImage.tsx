import { existsSync } from "node:fs";
import { resolve } from "node:path";
import Image from "next/image";
import { getCocktailAccent } from "../_helpers";

type CocktailImageProps = {
  id: number;
  imageUrl: string;
  name: string;
  className: string;
  sizes: string;
  imageClassName?: string;
  priority?: boolean;
};

const publicDirectory = resolve(process.cwd(), "public");

function getPublicImagePath(imageUrl: string) {
  if (!imageUrl.startsWith("/")) {
    return null;
  }

  const imagePath = resolve(publicDirectory, imageUrl.replace(/^\/+/, ""));

  if (!imagePath.startsWith(publicDirectory) || !existsSync(imagePath)) {
    return null;
  }

  return imageUrl;
}

export function CocktailImage({
  id,
  imageUrl,
  name,
  className,
  sizes,
  imageClassName = "object-cover",
  priority = false,
}: CocktailImageProps) {
  const imagePath = getPublicImagePath(imageUrl);

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ background: getCocktailAccent(id) }}
    >
      {imagePath ? (
        <Image
          src={imagePath}
          alt={name}
          fill
          sizes={sizes}
          priority={priority}
          className={imageClassName}
        />
      ) : null}
    </div>
  );
}
