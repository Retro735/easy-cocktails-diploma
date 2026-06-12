import Link from "next/link";
import { SectionHeader } from "./_components/SectionHeader";
import { CocktailImage } from "./cocktails/_components/CocktailImage";
import { formatCocktailPrice } from "./cocktails/_helpers";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const cocktails = await prisma.cocktail.findMany({
    include: {
      category: true,
      ingredients: true,
    },
    orderBy: {
      id: "asc",
    },
    take: 3,
  });

  return (
    <main className="flex-1">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(251,191,36,0.24),transparent_32%),radial-gradient(circle_at_85%_15%,rgba(16,185,129,0.18),transparent_30%),linear-gradient(135deg,#130c0f,#241116_48%,#0e1511)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-24">
          <div className="flex flex-col justify-center">
            <SectionHeader
              eyebrow="Коктейльный бар"
              title="Авторские коктейли, быстрый подбор и бронирование столов"
              description="Подберем и познакомим с любым коктейлем на ваш вкус."
            />
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/cocktails"
                className="inline-flex h-12 items-center justify-center rounded-md bg-amber-300 px-5 text-sm font-semibold text-[#17100f] transition hover:bg-amber-200"
              >
                Открыть каталог
              </Link>
              <Link
                href="/recommend"
                className="inline-flex h-12 items-center justify-center rounded-md border border-white/15 px-5 text-sm font-semibold text-white transition hover:border-emerald-200/70 hover:bg-white/10"
              >
                Подобрать коктейль
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-lg border border-white/10 bg-white/[0.07] p-5 shadow-2xl shadow-black/20">
              <div className="mb-5 flex items-center justify-between">
                <p className="text-sm font-semibold text-amber-100">
                  Барная карта
                </p>
                <p className="rounded-md bg-emerald-300/15 px-3 py-1 text-sm font-semibold text-emerald-100">
                  сегодня
                </p>
              </div>
              <div className="space-y-3">
                {cocktails.map((cocktail) => (
                  <Link
                    key={cocktail.id}
                    href={`/cocktails/${cocktail.id}`}
                    className="grid grid-cols-[48px_1fr_auto] items-center gap-4 rounded-lg bg-black/20 p-3 transition hover:bg-black/30"
                  >
                    <CocktailImage
                      id={cocktail.id}
                      imageUrl={cocktail.imageUrl}
                      name={cocktail.name}
                      className="size-12 rounded-md"
                      sizes="48px"
                    />
                    <span>
                      <span className="block font-semibold text-white">
                        {cocktail.name}
                      </span>
                      <span className="block text-sm text-stone-300">
                        {cocktail.ingredients[0]?.name ?? cocktail.category.name} -{" "}
                        {cocktail.strength}
                      </span>
                    </span>
                    <span className="whitespace-nowrap text-sm font-semibold text-amber-100">
                      {formatCocktailPrice(cocktail.price)}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
