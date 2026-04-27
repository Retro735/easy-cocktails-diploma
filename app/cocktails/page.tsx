import Link from "next/link";
import { SectionHeader } from "@/app/_components/SectionHeader";
import { prisma } from "@/lib/prisma";
import { formatCocktailPrice, getCocktailAccent } from "./_helpers";

export default async function CocktailsPage() {
  const cocktails = await prisma.cocktail.findMany({
    include: {
      category: true,
      ingredients: true,
    },
    orderBy: {
      id: "asc",
    },
  });

  return (
    <main className="flex-1 bg-[#130c0f]">
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Каталог"
          title="Коктейли бара"
          description="Выберите напиток по вкусу, крепости и настроению — в карточке каждого коктейля есть состав и подробное описание."
        />

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {cocktails.map((cocktail) => (
            <Link
              key={cocktail.id}
              href={`/cocktails/${cocktail.id}`}
              className="group overflow-hidden rounded-lg border border-white/10 bg-white/[0.06] transition hover:-translate-y-1 hover:border-amber-200/60 hover:bg-white/[0.09]"
            >
              <div
                className="h-36 border-b border-white/10"
                style={{ background: getCocktailAccent(cocktail.id) }}
              />
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-xl font-semibold text-white">
                    {cocktail.name}
                  </h2>
                  <span className="rounded-md bg-amber-300 px-2 py-1 text-sm font-semibold text-[#17100f]">
                    {formatCocktailPrice(cocktail.price)}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-stone-300">
                  {cocktail.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="rounded-md bg-white/10 px-2 py-1 text-xs font-medium text-stone-200">
                    {cocktail.category.name}
                  </span>
                  <span className="rounded-md bg-emerald-300/15 px-2 py-1 text-xs font-medium text-emerald-100">
                    {cocktail.strength}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {cocktail.ingredients.slice(0, 3).map((ingredient) => (
                    <span
                      key={ingredient.id}
                      className="rounded-md bg-amber-300/10 px-2 py-1 text-xs font-medium text-amber-100"
                    >
                      {ingredient.name}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
