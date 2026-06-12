import { existsSync, readdirSync } from "node:fs";
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
const cocktailImagesDirectory = resolve(publicDirectory, "images", "cocktails");
const legacyImagesPrefix = "/images/coctails/";
const imagesPrefix = "/images/cocktails/";

function slugifyFileName(value: string) {
  const slug = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "cocktail";
}

function findImageByCocktailName(name: string) {
  if (!existsSync(cocktailImagesDirectory)) {
    return null;
  }

  const slug = slugifyFileName(name);
  const imageFile = readdirSync(cocktailImagesDirectory)
    .filter((fileName) => fileName === `${slug}.png` || fileName.startsWith(`${slug}-`))
    .sort()
    .at(-1);

  return imageFile ? `${imagesPrefix}${imageFile}` : null;
}

function getPublicImagePath(imageUrl: string, name: string) {
  if (!imageUrl.startsWith("/")) {
    return findImageByCocktailName(name);
  }

  const normalizedImageUrl = imageUrl.startsWith(legacyImagesPrefix)
    ? imageUrl.replace(legacyImagesPrefix, imagesPrefix)
    : imageUrl;
  const imagePath = resolve(
    publicDirectory,
    normalizedImageUrl.replace(/^\/+/, ""),
  );

  if (!imagePath.startsWith(publicDirectory) || !existsSync(imagePath)) {
    return findImageByCocktailName(name);
  }

  return normalizedImageUrl;
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
  const imagePath = getPublicImagePath(imageUrl, name);

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
