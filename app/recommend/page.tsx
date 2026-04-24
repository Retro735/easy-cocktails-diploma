import Link from "next/link";
import { SectionHeader } from "@/app/_components/SectionHeader";
import { cocktails } from "@/app/_data/cocktails";

export default function RecommendPage() {
  const recommended = cocktails.slice(0, 3);

  return (
    <main className="flex-1 bg-[#130c0f]">
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <SectionHeader
            eyebrow="Персональный подбор"
            title="Подбор коктейлей по настроению"
            description="Форма-заглушка для будущего алгоритма рекомендаций. Сейчас справа показаны тестовые результаты из статического меню."
          />

          <form className="mt-8 space-y-5 rounded-lg border border-white/10 bg-white/[0.06] p-5">
            <label className="block">
              <span className="text-sm font-semibold text-stone-200">
                Базовый алкоголь
              </span>
              <select className="mt-2 h-11 w-full rounded-md border border-white/10 bg-[#21161a] px-3 text-sm text-white outline-none focus:border-amber-200">
                <option>Не важно</option>
                <option>Джин</option>
                <option>Ром</option>
                <option>Игристое</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-stone-200">
                Предпочтение по вкусу
              </span>
              <select className="mt-2 h-11 w-full rounded-md border border-white/10 bg-[#21161a] px-3 text-sm text-white outline-none focus:border-amber-200">
                <option>Свежий</option>
                <option>Ягодный</option>
                <option>Горький</option>
                <option>Дымный</option>
              </select>
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex items-center gap-3 rounded-md bg-black/20 p-3 text-sm text-stone-200">
                <input type="checkbox" className="size-4 accent-amber-300" />
                Без крепких коктейлей
              </label>
              <label className="flex items-center gap-3 rounded-md bg-black/20 p-3 text-sm text-stone-200">
                <input type="checkbox" className="size-4 accent-amber-300" />
                Больше цитруса
              </label>
            </div>
          </form>
        </div>

        <div className="grid gap-4">
          {recommended.map((cocktail, index) => (
            <Link
              key={cocktail.id}
              href={`/cocktails/${cocktail.id}`}
              className="grid gap-4 rounded-lg border border-white/10 bg-white/[0.06] p-4 transition hover:border-emerald-200/60 hover:bg-white/[0.09] sm:grid-cols-[132px_1fr]"
            >
              <div
                className="h-32 rounded-md"
                style={{ background: cocktail.accent }}
              />
              <div>
                <p className="text-sm font-semibold text-emerald-100">
                  Рекомендация {index + 1}
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  {cocktail.name}
                </h2>
                <p className="mt-3 text-sm leading-6 text-stone-300">
                  {cocktail.taste}
                </p>
                <p className="mt-4 text-sm font-semibold text-amber-100">
                  {cocktail.price}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
