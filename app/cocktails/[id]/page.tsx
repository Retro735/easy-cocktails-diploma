import Link from "next/link";
import { notFound } from "next/navigation";
import { cocktails, getCocktailById } from "@/app/_data/cocktails";

export function generateStaticParams() {
  return cocktails.map((cocktail) => ({
    id: cocktail.id,
  }));
}

export default async function CocktailDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cocktail = getCocktailById(id);

  if (!cocktail) {
    notFound();
  }

  return (
    <main className="flex-1 bg-[#130c0f]">
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <div
          className="min-h-[360px] rounded-lg border border-white/10 shadow-2xl shadow-black/30"
          style={{ background: cocktail.accent }}
        />

        <div className="rounded-lg border border-white/10 bg-white/[0.06] p-6 sm:p-8">
          <Link
            href="/cocktails"
            className="text-sm font-semibold text-amber-200 transition hover:text-amber-100"
          >
            Назад к каталогу
          </Link>
          <h1 className="mt-6 text-4xl font-semibold text-white sm:text-5xl">
            {cocktail.name}
          </h1>
          <p className="mt-5 text-lg leading-8 text-stone-300">
            {cocktail.description}
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              ["Основа", cocktail.base],
              ["Вкус", cocktail.taste],
              ["Крепость", cocktail.strength],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-lg border border-white/10 bg-black/20 p-4"
              >
                <p className="text-sm text-stone-400">{label}</p>
                <p className="mt-2 font-semibold text-white">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-white">Состав</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {cocktail.ingredients.map((ingredient) => (
                <li
                  key={ingredient}
                  className="rounded-md bg-white/10 px-3 py-2 text-sm text-stone-200"
                >
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-2xl font-semibold text-amber-100">
              {cocktail.price}
            </p>
            <Link
              href="/booking"
              className="inline-flex h-11 items-center justify-center rounded-md bg-amber-300 px-5 text-sm font-semibold text-[#17100f] transition hover:bg-amber-200"
            >
              Забронировать стол
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
