import Link from "next/link";
import { SectionHeader } from "@/app/_components/SectionHeader";

export default function BookingPage() {
  return (
    <main className="flex-1 bg-[#130c0f]">
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <div>
          <SectionHeader
            eyebrow="Онлайн-бронирование"
            title="Бронь столика в баре"
            description="Статическая форма для будущей записи гостей. На следующем этапе ее можно связать с серверной логикой и базой данных."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              ["Вечер пятницы", "свободно 6 столов"],
              ["Вечер субботы", "свободно 4 стола"],
            ].map(([title, text]) => (
              <div
                key={title}
                className="rounded-lg border border-white/10 bg-white/[0.06] p-5"
              >
                <p className="font-semibold text-white">{title}</p>
                <p className="mt-2 text-sm text-stone-300">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <form className="rounded-lg border border-white/10 bg-white/[0.06] p-5 sm:p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-stone-200">Имя</span>
              <input
                type="text"
                placeholder="Алексей"
                className="mt-2 h-11 w-full rounded-md border border-white/10 bg-[#21161a] px-3 text-sm text-white outline-none placeholder:text-stone-500 focus:border-amber-200"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-stone-200">
                Телефон
              </span>
              <input
                type="tel"
                placeholder="+7 900 000-00-00"
                className="mt-2 h-11 w-full rounded-md border border-white/10 bg-[#21161a] px-3 text-sm text-white outline-none placeholder:text-stone-500 focus:border-amber-200"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-stone-200">Дата</span>
              <input
                type="date"
                className="mt-2 h-11 w-full rounded-md border border-white/10 bg-[#21161a] px-3 text-sm text-white outline-none focus:border-amber-200"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-stone-200">
                Время
              </span>
              <input
                type="time"
                className="mt-2 h-11 w-full rounded-md border border-white/10 bg-[#21161a] px-3 text-sm text-white outline-none focus:border-amber-200"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-stone-200">
                Гостей
              </span>
              <input
                type="number"
                min="1"
                max="10"
                placeholder="2"
                className="mt-2 h-11 w-full rounded-md border border-white/10 bg-[#21161a] px-3 text-sm text-white outline-none placeholder:text-stone-500 focus:border-amber-200"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-stone-200">
                Зона
              </span>
              <select className="mt-2 h-11 w-full rounded-md border border-white/10 bg-[#21161a] px-3 text-sm text-white outline-none focus:border-amber-200">
                <option>Основной зал</option>
                <option>Барная стойка</option>
                <option>Лаунж</option>
              </select>
            </label>
          </div>

          <label className="mt-5 block">
            <span className="text-sm font-semibold text-stone-200">
              Комментарий
            </span>
            <textarea
              rows={4}
              placeholder="Пожелания по столику"
              className="mt-2 w-full rounded-md border border-white/10 bg-[#21161a] px-3 py-3 text-sm text-white outline-none placeholder:text-stone-500 focus:border-amber-200"
            />
          </label>

          <Link
            href="/booking/success"
            className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-md bg-amber-300 px-5 text-sm font-semibold text-[#17100f] transition hover:bg-amber-200"
          >
            Подтвердить бронь
          </Link>
        </form>
      </section>
    </main>
  );
}
