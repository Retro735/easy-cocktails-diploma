import Link from "next/link";
import { SectionHeader } from "@/app/_components/SectionHeader";
import { cocktails } from "@/app/_data/cocktails";

export default function AdminCocktailsPage() {
  return (
    <main className="flex-1 bg-[#130c0f]">
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            eyebrow="Админ-панель"
            title="Управление коктейлями"
            description="Таблица тестовых позиций меню для будущего CRUD-раздела."
          />
          <button
            type="button"
            className="h-11 rounded-md bg-amber-300 px-5 text-sm font-semibold text-[#17100f]"
          >
            Добавить коктейль
          </button>
        </div>

        <div className="mt-10 overflow-hidden rounded-lg border border-white/10 bg-white/[0.06]">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10 text-left text-sm">
              <thead className="bg-white/[0.04] text-stone-300">
                <tr>
                  <th className="px-5 py-4 font-semibold">Название</th>
                  <th className="px-5 py-4 font-semibold">Основа</th>
                  <th className="px-5 py-4 font-semibold">Крепость</th>
                  <th className="px-5 py-4 font-semibold">Цена</th>
                  <th className="px-5 py-4 font-semibold">Действие</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {cocktails.map((cocktail) => (
                  <tr key={cocktail.id} className="text-stone-200">
                    <td className="px-5 py-4 font-semibold text-white">
                      {cocktail.name}
                    </td>
                    <td className="px-5 py-4">{cocktail.base}</td>
                    <td className="px-5 py-4">{cocktail.strength}</td>
                    <td className="px-5 py-4">{cocktail.price}</td>
                    <td className="px-5 py-4">
                      <Link
                        href={`/cocktails/${cocktail.id}`}
                        className="font-semibold text-amber-100 transition hover:text-amber-200"
                      >
                        Открыть
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
