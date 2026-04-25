import Link from "next/link";
import { SectionHeader } from "@/app/_components/SectionHeader";
import { formatCocktailPrice, getCocktailAccent } from "@/app/cocktails/_helpers";
import { prisma } from "@/lib/prisma";

type RecommendPageProps = {
  searchParams: Promise<{
    taste?: string | string[];
    strength?: string | string[];
    favoriteIngredients?: string | string[];
    dislikedIngredients?: string | string[];
  }>;
};

const tasteOptions = ["сладкий", "кислый", "горький", "свежий"];
const strengthOptions = ["безалкогольный", "слабый", "средний", "крепкий"];

const tasteKeywords: Record<string, string[]> = {
  сладкий: ["слад", "ягод", "малина", "клюква"],
  кислый: ["кисл", "лимон", "лайм", "цитрус"],
  горький: ["горь", "биттер", "вермут"],
  свежий: ["свеж", "мята", "содовая", "цитрус", "лайм"],
};

const strengthKeywords: Record<string, string[]> = {
  безалкогольный: ["безалкоголь"],
  слабый: ["слаб", "легк", "лёгк"],
  средний: ["сред"],
  крепкий: ["креп"],
};

function getFirstParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

function getArrayParam(value?: string | string[]) {
  return Array.isArray(value) ? value : value ? [value] : [];
}

function getSelectedIds(value?: string | string[]) {
  return new Set(
    getArrayParam(value)
      .map((item) => Number(item))
      .filter((item) => Number.isSafeInteger(item) && item > 0),
  );
}

function normalize(value: string) {
  return value.toLowerCase().replaceAll("ё", "е");
}

function matchesByKeywords(value: string, selected: string, keywords: Record<string, string[]>) {
  const normalizedValue = normalize(value);
  const normalizedSelected = normalize(selected);
  const selectedKeywords = keywords[normalizedSelected] ?? [normalizedSelected];

  return selectedKeywords.some((keyword) => normalizedValue.includes(normalize(keyword)));
}

export default async function RecommendPage({
  searchParams,
}: RecommendPageProps) {
  const params = await searchParams;
  const selectedTaste = getFirstParam(params.taste) ?? "";
  const selectedStrength = getFirstParam(params.strength) ?? "";
  const favoriteIngredientIds = getSelectedIds(params.favoriteIngredients);
  const dislikedIngredientIds = getSelectedIds(params.dislikedIngredients);
  const hasSubmitted =
    Boolean(selectedTaste) ||
    Boolean(selectedStrength) ||
    favoriteIngredientIds.size > 0 ||
    dislikedIngredientIds.size > 0;

  const [cocktails, ingredients] = await Promise.all([
    prisma.cocktail.findMany({
      include: {
        category: true,
        ingredients: true,
      },
      orderBy: {
        id: "asc",
      },
    }),
    prisma.ingredient.findMany({
      orderBy: {
        name: "asc",
      },
    }),
  ]);

  const recommendations = cocktails
    .map((cocktail) => {
      const ingredientIds = cocktail.ingredients.map((ingredient) => ingredient.id);
      const favoriteMatches = ingredientIds.filter((id) =>
        favoriteIngredientIds.has(id),
      ).length;
      const dislikedMatches = ingredientIds.filter((id) =>
        dislikedIngredientIds.has(id),
      ).length;

      const score =
        (selectedTaste && matchesByKeywords(cocktail.taste, selectedTaste, tasteKeywords)
          ? 3
          : 0) +
        (selectedStrength &&
        matchesByKeywords(cocktail.strength, selectedStrength, strengthKeywords)
          ? 3
          : 0) +
        favoriteMatches * 2 -
        dislikedMatches * 5;

      return {
        cocktail,
        score,
      };
    })
    .filter((item) => item.score > 0)
    .sort((first, second) => second.score - first.score)
    .slice(0, 5);

  return (
    <main className="flex-1 bg-[#130c0f]">
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <SectionHeader
            eyebrow="Персональный подбор"
            title="Подбор коктейлей по настроению"
            description="Ответьте на несколько вопросов, и система подберет коктейли из меню по вкусу, крепости и ингредиентам."
          />

          <form
            action="/recommend"
            className="mt-8 space-y-5 rounded-lg border border-white/10 bg-white/[0.06] p-5"
          >
            <label className="block">
              <span className="text-sm font-semibold text-stone-200">
                Вкус
              </span>
              <select
                name="taste"
                defaultValue={selectedTaste}
                className="mt-2 h-11 w-full rounded-md border border-white/10 bg-[#21161a] px-3 text-sm text-white outline-none focus:border-amber-200"
              >
                <option value="">Не важно</option>
                {tasteOptions.map((taste) => (
                  <option key={taste} value={taste}>
                    {taste}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-stone-200">
                Крепость
              </span>
              <select
                name="strength"
                defaultValue={selectedStrength}
                className="mt-2 h-11 w-full rounded-md border border-white/10 bg-[#21161a] px-3 text-sm text-white outline-none focus:border-amber-200"
              >
                <option value="">Не важно</option>
                {strengthOptions.map((strength) => (
                  <option key={strength} value={strength}>
                    {strength}
                  </option>
                ))}
              </select>
            </label>

            <fieldset>
              <legend className="text-sm font-semibold text-stone-200">
                Любимые ингредиенты
              </legend>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {ingredients.map((ingredient) => (
                  <label
                    key={ingredient.id}
                    className="flex items-center gap-3 rounded-md bg-black/20 p-3 text-sm text-stone-200"
                  >
                    <input
                      type="checkbox"
                      name="favoriteIngredients"
                      value={ingredient.id}
                      defaultChecked={favoriteIngredientIds.has(ingredient.id)}
                      className="size-4 accent-amber-300"
                    />
                    {ingredient.name}
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-sm font-semibold text-stone-200">
                Нежелательные ингредиенты
              </legend>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {ingredients.map((ingredient) => (
                  <label
                    key={ingredient.id}
                    className="flex items-center gap-3 rounded-md bg-black/20 p-3 text-sm text-stone-200"
                  >
                    <input
                      type="checkbox"
                      name="dislikedIngredients"
                      value={ingredient.id}
                      defaultChecked={dislikedIngredientIds.has(ingredient.id)}
                      className="size-4 accent-amber-300"
                    />
                    {ingredient.name}
                  </label>
                ))}
              </div>
            </fieldset>

            <button
              type="submit"
              className="h-11 w-full rounded-md bg-amber-300 px-5 text-sm font-semibold text-[#17100f] transition hover:bg-amber-200"
            >
              Подобрать коктейли
            </button>
          </form>
        </div>

        <div className="grid content-start gap-4">
          {!hasSubmitted ? (
            <div className="rounded-lg border border-white/10 bg-white/[0.06] p-6">
              <h2 className="text-2xl font-semibold text-white">
                Рекомендации появятся после анкеты
              </h2>
              <p className="mt-3 text-sm leading-6 text-stone-300">
                Выберите вкус, крепость и ингредиенты. Результаты будут
                отсортированы по баллам и показаны на этой же странице.
              </p>
            </div>
          ) : recommendations.length > 0 ? (
            recommendations.map(({ cocktail, score }, index) => (
              <Link
                key={cocktail.id}
                href={`/cocktails/${cocktail.id}`}
                className="grid gap-4 rounded-lg border border-white/10 bg-white/[0.06] p-4 transition hover:border-emerald-200/60 hover:bg-white/[0.09] sm:grid-cols-[132px_1fr]"
              >
                <div
                  className="h-32 rounded-md"
                  style={{ background: getCocktailAccent(cocktail.id) }}
                />
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-emerald-100">
                      Рекомендация {index + 1}
                    </p>
                    <span className="rounded-md bg-emerald-300/15 px-2 py-1 text-xs font-semibold text-emerald-100">
                      {score} баллов
                    </span>
                  </div>
                  <h2 className="mt-2 text-2xl font-semibold text-white">
                    {cocktail.name}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-stone-300">
                    {cocktail.description}
                  </p>
                  <div className="mt-4 grid gap-2 text-sm text-stone-300">
                    <p>
                      <span className="font-semibold text-stone-100">Вкус:</span>{" "}
                      {cocktail.taste}
                    </p>
                    <p>
                      <span className="font-semibold text-stone-100">
                        Крепость:
                      </span>{" "}
                      {cocktail.strength}
                    </p>
                    <p>
                      <span className="font-semibold text-stone-100">
                        Ингредиенты:
                      </span>{" "}
                      {cocktail.ingredients
                        .map((ingredient) => ingredient.name)
                        .join(", ")}
                    </p>
                  </div>
                  <p className="mt-4 text-sm font-semibold text-amber-100">
                    {formatCocktailPrice(cocktail.price)}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <div className="rounded-lg border border-white/10 bg-white/[0.06] p-6">
              <h2 className="text-2xl font-semibold text-white">
                Подходящих коктейлей не найдено
              </h2>
              <p className="mt-3 text-sm leading-6 text-stone-300">
                Попробуйте убрать нежелательные ингредиенты или выбрать другую
                крепость.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
