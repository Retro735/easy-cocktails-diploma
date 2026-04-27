"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminUser } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

const adminCocktailsPath = "/admin/cocktails";

type CocktailFormValues = {
  name: string;
  description: string;
  taste: string;
  strength: string;
  price: number;
  imageUrl: string;
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
  const imageUrl = getRequiredValue(formData, "imageUrl");
  const price = getPositiveInteger(formData, "price");
  const categoryId = getPositiveInteger(formData, "categoryId");
  const ingredientIds = getIngredientIds(formData);

  if (
    !name ||
    !description ||
    !taste ||
    !strength ||
    !imageUrl ||
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
    imageUrl,
    categoryId,
    ingredientIds,
  };
}

function redirectToCocktails(search: string): never {
  redirect(`${adminCocktailsPath}?${search}`);
}

export async function createCocktail(formData: FormData) {
  await requireAdminUser();

  const values = getCocktailFormValues(formData);

  if (!values) {
    redirectToCocktails("error=required");
  }

  await prisma.cocktail.create({
    data: {
      name: values.name,
      description: values.description,
      taste: values.taste,
      strength: values.strength,
      price: values.price,
      imageUrl: values.imageUrl,
      categoryId: values.categoryId,
      ingredients: {
        connect: values.ingredientIds.map((id) => ({ id })),
      },
    },
  });

  revalidatePath(adminCocktailsPath);
  redirectToCocktails("success=created");
}

export async function updateCocktail(formData: FormData) {
  await requireAdminUser();

  const cocktailId = getPositiveInteger(formData, "cocktailId");
  const values = getCocktailFormValues(formData);

  if (cocktailId === null || !values) {
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
      imageUrl: values.imageUrl,
      categoryId: values.categoryId,
      ingredients: {
        set: values.ingredientIds.map((id) => ({ id })),
      },
    },
  });

  revalidatePath(adminCocktailsPath);
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

  revalidatePath(adminCocktailsPath);
  redirectToCocktails("success=deleted");
}
