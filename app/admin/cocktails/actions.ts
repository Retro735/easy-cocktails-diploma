"use server";

import { Buffer } from "node:buffer";
import { mkdir, writeFile } from "node:fs/promises";
import { extname, resolve } from "node:path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminUser } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

const adminCocktailsPath = "/admin/cocktails";
const cocktailImagesDirectory = resolve(process.cwd(), "public", "images", "cocktails");
const cocktailImagesPublicPath = "/images/cocktails";
const maxImageSize = 5 * 1024 * 1024;
const imageTypeExtensions = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/gif", ".gif"],
  ["image/avif", ".avif"],
]);
const allowedImageExtensions = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".avif",
]);

type CocktailFormValues = {
  name: string;
  description: string;
  taste: string;
  strength: string;
  price: number;
  categoryId: number;
  ingredientIds: number[];
};

function getRequiredValue(formData: FormData, field: string) {
  const value = formData.get(field);

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function getPositiveInteger(formData: FormData, field: string) {
  const value = Number(getRequiredValue(formData, field));

  if (!Number.isSafeInteger(value) || value <= 0) {
    return null;
  }

  return value;
}

function getIngredientIds(formData: FormData) {
  const ids = formData
    .getAll("ingredientIds")
    .map((value) => Number(value))
    .filter((value) => Number.isSafeInteger(value) && value > 0);

  return Array.from(new Set(ids));
}

function getCocktailFormValues(formData: FormData): CocktailFormValues | null {
  const name = getRequiredValue(formData, "name");
  const description = getRequiredValue(formData, "description");
  const taste = getRequiredValue(formData, "taste");
  const strength = getRequiredValue(formData, "strength");
  const price = getPositiveInteger(formData, "price");
  const categoryId = getPositiveInteger(formData, "categoryId");
  const ingredientIds = getIngredientIds(formData);

  if (
    !name ||
    !description ||
    !taste ||
    !strength ||
    price === null ||
    categoryId === null ||
    ingredientIds.length === 0
  ) {
    return null;
  }

  return {
    name,
    description,
    taste,
    strength,
    price,
    categoryId,
    ingredientIds,
  };
}

function getImageFile(formData: FormData) {
  const value = formData.get("imageFile");

  if (!(value instanceof File) || value.size === 0) {
    return null;
  }

  return value;
}

function getImageExtension(file: File) {
  const originalExtension = extname(file.name).toLowerCase();

  return (
    imageTypeExtensions.get(file.type) ??
    (allowedImageExtensions.has(originalExtension) ? originalExtension : null)
  );
}

function slugifyFileName(value: string) {
  const slug = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "cocktail";
}

async function saveCocktailImage(formData: FormData, cocktailName: string) {
  const imageFile = getImageFile(formData);

  if (!imageFile) {
    return null;
  }

  const extension = getImageExtension(imageFile);

  if (!extension || imageFile.size > maxImageSize) {
    redirectToCocktails("error=image");
  }

  await mkdir(cocktailImagesDirectory, { recursive: true });

  const fileName = `${slugifyFileName(cocktailName)}-${Date.now()}${extension}`;
  const filePath = resolve(cocktailImagesDirectory, fileName);
  const publicPath = `${cocktailImagesPublicPath}/${fileName}`;
  const buffer = Buffer.from(await imageFile.arrayBuffer());

  await writeFile(filePath, buffer);

  return publicPath;
}

function redirectToCocktails(search: string): never {
  redirect(`${adminCocktailsPath}?${search}`);
}

function revalidateCocktailPages(cocktailId?: number) {
  revalidatePath(adminCocktailsPath);
  revalidatePath("/cocktails");
  revalidatePath("/recommend");

  if (cocktailId) {
    revalidatePath(`/cocktails/${cocktailId}`);
  }
}

export async function createCocktail(formData: FormData) {
  await requireAdminUser();

  const values = getCocktailFormValues(formData);

  if (!values) {
    redirectToCocktails("error=required");
  }

  const imageUrl = await saveCocktailImage(formData, values.name);

  if (!imageUrl) {
    redirectToCocktails("error=required");
  }

  const cocktail = await prisma.cocktail.create({
    data: {
      name: values.name,
      description: values.description,
      taste: values.taste,
      strength: values.strength,
      price: values.price,
      imageUrl,
      categoryId: values.categoryId,
      ingredients: {
        connect: values.ingredientIds.map((id) => ({ id })),
      },
    },
  });

  revalidateCocktailPages(cocktail.id);
  redirectToCocktails("success=created");
}

export async function updateCocktail(formData: FormData) {
  await requireAdminUser();

  const cocktailId = getPositiveInteger(formData, "cocktailId");
  const values = getCocktailFormValues(formData);

  if (cocktailId === null || !values) {
    redirectToCocktails("error=required");
  }

  const currentImageUrl = getRequiredValue(formData, "currentImageUrl");
  const uploadedImageUrl = await saveCocktailImage(formData, values.name);
  const imageUrl = uploadedImageUrl ?? currentImageUrl;

  if (!imageUrl) {
    redirectToCocktails("error=required");
  }

  await prisma.cocktail.update({
    where: {
      id: cocktailId,
    },
    data: {
      name: values.name,
      description: values.description,
      taste: values.taste,
      strength: values.strength,
      price: values.price,
      imageUrl,
      categoryId: values.categoryId,
      ingredients: {
        set: values.ingredientIds.map((id) => ({ id })),
      },
    },
  });

  revalidateCocktailPages(cocktailId);
  redirectToCocktails("success=updated");
}

export async function deleteCocktail(formData: FormData) {
  await requireAdminUser();

  const cocktailId = getPositiveInteger(formData, "cocktailId");

  if (cocktailId === null) {
    redirectToCocktails("error=required");
  }

  await prisma.cocktail.deleteMany({
    where: {
      id: cocktailId,
    },
  });

  revalidateCocktailPages(cocktailId);
  redirectToCocktails("success=deleted");
}
