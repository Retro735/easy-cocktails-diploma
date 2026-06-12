import "dotenv/config";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { prisma } from "../lib/prisma";
import { cocktailSeeds } from "./seed";

const publicDirectory = resolve(process.cwd(), "public");
const legacyImagesPrefix = "/images/coctails/";
const imagesPrefix = "/images/cocktails/";

function normalizeImageUrl(imageUrl: string) {
  return imageUrl.startsWith(legacyImagesPrefix)
    ? imageUrl.replace(legacyImagesPrefix, imagesPrefix)
    : imageUrl;
}

function publicImageExists(imageUrl: string) {
  if (!imageUrl.startsWith("/")) {
    return false;
  }

  const imagePath = resolve(publicDirectory, imageUrl.replace(/^\/+/, ""));

  return imagePath.startsWith(publicDirectory) && existsSync(imagePath);
}

async function main() {
  let created = 0;
  let repairedImages = 0;

  for (const cocktail of cocktailSeeds) {
    const category = await prisma.category.upsert({
      where: { name: cocktail.category },
      update: {},
      create: { name: cocktail.category },
    });

    const ingredients = await Promise.all(
      cocktail.ingredients.map((name) =>
        prisma.ingredient.upsert({
          where: { name },
          update: {},
          create: { name },
        }),
      ),
    );

    const existingCocktail = await prisma.cocktail.findFirst({
      where: { name: cocktail.name },
      select: {
        id: true,
        imageUrl: true,
      },
    });

    if (!existingCocktail) {
      await prisma.cocktail.create({
        data: {
          name: cocktail.name,
          description: cocktail.description,
          taste: cocktail.taste,
          strength: cocktail.strength,
          price: cocktail.price,
          imageUrl: cocktail.imageUrl,
          categoryId: category.id,
          ingredients: {
            connect: ingredients.map((ingredient) => ({ id: ingredient.id })),
          },
        },
      });
      created += 1;
      continue;
    }

    const normalizedImageUrl = normalizeImageUrl(existingCocktail.imageUrl);

    if (!publicImageExists(normalizedImageUrl)) {
      await prisma.cocktail.update({
        where: { id: existingCocktail.id },
        data: { imageUrl: cocktail.imageUrl },
      });
      repairedImages += 1;
    } else if (normalizedImageUrl !== existingCocktail.imageUrl) {
      await prisma.cocktail.update({
        where: { id: existingCocktail.id },
        data: { imageUrl: normalizedImageUrl },
      });
      repairedImages += 1;
    }
  }

  console.log(
    `Cocktail sync complete. Created: ${created}. Repaired images: ${repairedImages}.`,
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
