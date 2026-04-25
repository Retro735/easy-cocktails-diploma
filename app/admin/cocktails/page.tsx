import { Fragment } from "react";
import Link from "next/link";
import { SectionHeader } from "@/app/_components/SectionHeader";
import { prisma } from "@/lib/prisma";
import { createCocktail, deleteCocktail, updateCocktail } from "./actions";

export const dynamic = "force-dynamic";

type AdminCocktailsPageProps = {
  searchParams: Promise<{
    error?: string | string[];
    success?: string | string[];
  }>;
};

function formatPrice(price: number) {
  return `${price} ₽`;
}

function getSearchValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminCocktailsPage({
  searchParams,
}: AdminCocktailsPageProps) {
  const [{ error, success }, cocktails, categories, ingredients] =
    await Promise.all([
      searchParams,
      prisma.cocktail.findMany({
        include: {
          category: true,
          ingredients: true,
        },
        orderBy: {
          id: "asc",
        },
      }),
      prisma.category.findMany({
        orderBy: {
          name: "asc",
        },
      }),
      prisma.ingredient.findMany({
        orderBy: {
          name: "asc",
        },
      }),
    ]);

  const errorCode = getSearchValue(error);
  const successCode = getSearchValue(success);
  const message =
    errorCode === "required"
      ? "Заполните обязательные поля: название, описание, вкус, крепость, цену, изображение, категорию и ингредиенты."
      : successCode === "created"
        ? "Коктейль создан."
        : successCode === "updated"
          ? "Коктейль обновлен."
          : successCode === "deleted"
            ? "Коктейль удален."
            : null;

  return (
    <main className="flex-1 bg-[#130c0f]">
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Админ-панель"
          title="Управление коктейлями"
          description="Список коктейлей из базы данных, создание новых позиций и inline-редактирование меню."
        />

        {message ? (
          <p
            className={`mt-8 rounded-md border px-4 py-3 text-sm font-medium ${
              errorCode
                ? "border-rose-200/30 bg-rose-300/10 text-rose-100"
                : "border-emerald-200/30 bg-emerald-300/10 text-emerald-100"
            }`}
          >
            {message}
          </p>
        ) : null}

        <form
          action={createCocktail}
          className="mt-10 rounded-lg border border-white/10 bg-white/[0.06] p-5 sm:p-6"
        >
          <h2 className="text-xl font-semibold text-white">
            Добавить коктейль
          </h2>
          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-stone-200">
                name
              </span>
              <input
                name="name"
                required
                className="mt-2 h-11 w-full rounded-md border border-white/10 bg-[#21161a] px-3 text-sm text-white outline-none focus:border-amber-200"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-stone-200">
                taste
              </span>
              <input
                name="taste"
                required
                className="mt-2 h-11 w-full rounded-md border border-white/10 bg-[#21161a] px-3 text-sm text-white outline-none focus:border-amber-200"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-stone-200">
                strength
              </span>
              <input
                name="strength"
                required
                className="mt-2 h-11 w-full rounded-md border border-white/10 bg-[#21161a] px-3 text-sm text-white outline-none focus:border-amber-200"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-stone-200">
                price
              </span>
              <input
                name="price"
                type="number"
                min="1"
                required
                className="mt-2 h-11 w-full rounded-md border border-white/10 bg-[#21161a] px-3 text-sm text-white outline-none focus:border-amber-200"
              />
            </label>
            <label className="block lg:col-span-2">
              <span className="text-sm font-semibold text-stone-200">
                imageUrl
              </span>
              <input
                name="imageUrl"
                required
                placeholder="/images/cocktails/example.jpg"
                className="mt-2 h-11 w-full rounded-md border border-white/10 bg-[#21161a] px-3 text-sm text-white outline-none placeholder:text-stone-500 focus:border-amber-200"
              />
            </label>
            <label className="block lg:col-span-2">
              <span className="text-sm font-semibold text-stone-200">
                description
              </span>
              <textarea
                name="description"
                required
                rows={3}
                className="mt-2 w-full rounded-md border border-white/10 bg-[#21161a] px-3 py-3 text-sm text-white outline-none focus:border-amber-200"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-stone-200">
                categoryId
              </span>
              <select
                name="categoryId"
                required
                defaultValue=""
                className="mt-2 h-11 w-full rounded-md border border-white/10 bg-[#21161a] px-3 text-sm text-white outline-none focus:border-amber-200"
              >
                <option value="" disabled>
                  Выберите категорию
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            <fieldset className="lg:col-span-2">
              <legend className="text-sm font-semibold text-stone-200">
                ingredientIds
              </legend>
              <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {ingredients.map((ingredient) => (
                  <label
                    key={ingredient.id}
                    className="flex items-center gap-3 rounded-md bg-black/20 p-3 text-sm text-stone-200"
                  >
                    <input
                      type="checkbox"
                      name="ingredientIds"
                      value={ingredient.id}
                      className="size-4 accent-amber-300"
                    />
                    {ingredient.name}
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
          <button
            type="submit"
            className="mt-6 h-11 rounded-md bg-amber-300 px-5 text-sm font-semibold text-[#17100f] transition hover:bg-amber-200"
          >
            Создать коктейль
          </button>
        </form>

        <div className="mt-10 overflow-hidden rounded-lg border border-white/10 bg-white/[0.06]">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10 text-left text-sm">
              <thead className="bg-white/[0.04] text-stone-300">
                <tr>
                  <th className="px-5 py-4 font-semibold">id</th>
                  <th className="px-5 py-4 font-semibold">Название</th>
                  <th className="px-5 py-4 font-semibold">Описание</th>
                  <th className="px-5 py-4 font-semibold">Вкус</th>
                  <th className="px-5 py-4 font-semibold">Крепость</th>
                  <th className="px-5 py-4 font-semibold">Цена</th>
                  <th className="px-5 py-4 font-semibold">Категория</th>
                  <th className="px-5 py-4 font-semibold">Ингредиенты</th>
                  <th className="px-5 py-4 font-semibold">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {cocktails.map((cocktail) => {
                  const cocktailIngredientIds = new Set(
                    cocktail.ingredients.map((ingredient) => ingredient.id),
                  );

                  return (
                    <Fragment key={cocktail.id}>
                      <tr className="align-top text-stone-200">
                        <td className="px-5 py-4 font-semibold text-white">
                          {cocktail.id}
                        </td>
                        <td className="px-5 py-4 font-semibold text-white">
                          {cocktail.name}
                        </td>
                        <td className="max-w-xs px-5 py-4 leading-6">
                          {cocktail.description}
                        </td>
                        <td className="px-5 py-4">{cocktail.taste}</td>
                        <td className="px-5 py-4">{cocktail.strength}</td>
                        <td className="px-5 py-4">
                          {formatPrice(cocktail.price)}
                        </td>
                        <td className="px-5 py-4">{cocktail.category.name}</td>
                        <td className="px-5 py-4">
                          <div className="flex max-w-xs flex-wrap gap-2">
                            {cocktail.ingredients.map((ingredient) => (
                              <span
                                key={ingredient.id}
                                className="rounded-md bg-amber-300/10 px-2 py-1 text-xs font-medium text-amber-100"
                              >
                                {ingredient.name}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex flex-col gap-2">
                            <Link
                              href={`/cocktails/${cocktail.id}`}
                              className="font-semibold text-amber-100 transition hover:text-amber-200"
                            >
                              Открыть
                            </Link>
                            <form action={deleteCocktail}>
                              <input
                                type="hidden"
                                name="cocktailId"
                                value={cocktail.id}
                              />
                              <button
                                type="submit"
                                className="font-semibold text-rose-100 transition hover:text-rose-200"
                              >
                                Удалить
                              </button>
                            </form>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={9} className="bg-black/10 px-5 py-5">
                          <form
                            action={updateCocktail}
                            className="grid gap-4 lg:grid-cols-4"
                          >
                            <input
                              type="hidden"
                              name="cocktailId"
                              value={cocktail.id}
                            />
                            <input
                              name="name"
                              defaultValue={cocktail.name}
                              required
                              className="h-10 rounded-md border border-white/10 bg-[#21161a] px-3 text-sm text-white outline-none focus:border-amber-200"
                            />
                            <input
                              name="taste"
                              defaultValue={cocktail.taste}
                              required
                              className="h-10 rounded-md border border-white/10 bg-[#21161a] px-3 text-sm text-white outline-none focus:border-amber-200"
                            />
                            <input
                              name="strength"
                              defaultValue={cocktail.strength}
                              required
                              className="h-10 rounded-md border border-white/10 bg-[#21161a] px-3 text-sm text-white outline-none focus:border-amber-200"
                            />
                            <input
                              name="price"
                              type="number"
                              min="1"
                              defaultValue={cocktail.price}
                              required
                              className="h-10 rounded-md border border-white/10 bg-[#21161a] px-3 text-sm text-white outline-none focus:border-amber-200"
                            />
                            <input
                              name="imageUrl"
                              defaultValue={cocktail.imageUrl}
                              required
                              className="h-10 rounded-md border border-white/10 bg-[#21161a] px-3 text-sm text-white outline-none focus:border-amber-200 lg:col-span-2"
                            />
                            <select
                              name="categoryId"
                              defaultValue={cocktail.categoryId}
                              required
                              className="h-10 rounded-md border border-white/10 bg-[#21161a] px-3 text-sm text-white outline-none focus:border-amber-200"
                            >
                              {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                  {category.name}
                                </option>
                              ))}
                            </select>
                            <textarea
                              name="description"
                              defaultValue={cocktail.description}
                              required
                              rows={3}
                              className="rounded-md border border-white/10 bg-[#21161a] px-3 py-3 text-sm text-white outline-none focus:border-amber-200 lg:col-span-4"
                            />
                            <fieldset className="lg:col-span-4">
                              <legend className="text-xs font-semibold text-stone-300">
                                ingredientIds
                              </legend>
                              <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                                {ingredients.map((ingredient) => (
                                  <label
                                    key={ingredient.id}
                                    className="flex items-center gap-2 rounded-md bg-black/20 p-2 text-xs text-stone-200"
                                  >
                                    <input
                                      type="checkbox"
                                      name="ingredientIds"
                                      value={ingredient.id}
                                      defaultChecked={cocktailIngredientIds.has(
                                        ingredient.id,
                                      )}
                                      className="size-4 accent-amber-300"
                                    />
                                    {ingredient.name}
                                  </label>
                                ))}
                              </div>
                            </fieldset>
                            <button
                              type="submit"
                              className="h-10 rounded-md bg-amber-300 px-4 text-sm font-semibold text-[#17100f] transition hover:bg-amber-200 lg:col-span-1"
                            >
                              Сохранить изменения
                            </button>
                          </form>
                        </td>
                      </tr>
                    </Fragment>
                  );
                })}
                {cocktails.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-5 py-8 text-center text-stone-300"
                    >
                      Коктейлей пока нет.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
