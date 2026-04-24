import { SectionHeader } from "@/app/_components/SectionHeader";
import { createReservation } from "./actions";

type BookingPageProps = {
  searchParams: Promise<{
    error?: string | string[];
  }>;
};

export default async function BookingPage({ searchParams }: BookingPageProps) {
  const { error } = await searchParams;
  const errorCode = Array.isArray(error) ? error[0] : error;
  const errorMessage =
    errorCode === "required"
      ? "Заполните все обязательные поля."
      : errorCode === "invalid"
        ? "Проверьте дату, email и количество гостей."
        : null;

  return (
    <main className="flex-1 bg-[#130c0f]">
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <div>
          <SectionHeader
            eyebrow="Онлайн-бронирование"
            title="Бронь столика в баре"
            description="Заполните форму, и заявка на бронирование будет сохранена в базе данных."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              ["Вечер пятницы", "лучше бронировать заранее"],
              ["Вечер субботы", "самые популярные слоты после 19:00"],
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

        <form
          action={createReservation}
          className="rounded-lg border border-white/10 bg-white/[0.06] p-5 sm:p-6"
        >
          {errorMessage ? (
            <p className="mb-5 rounded-md border border-rose-200/30 bg-rose-300/10 px-4 py-3 text-sm font-medium text-rose-100">
              {errorMessage}
            </p>
          ) : null}

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-stone-200">Имя</span>
              <input
                name="customerName"
                type="text"
                required
                placeholder="Алексей"
                className="mt-2 h-11 w-full rounded-md border border-white/10 bg-[#21161a] px-3 text-sm text-white outline-none placeholder:text-stone-500 focus:border-amber-200"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-stone-200">
                Телефон
              </span>
              <input
                name="phone"
                type="tel"
                required
                placeholder="+7 900 000-00-00"
                className="mt-2 h-11 w-full rounded-md border border-white/10 bg-[#21161a] px-3 text-sm text-white outline-none placeholder:text-stone-500 focus:border-amber-200"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-stone-200">
                Email
              </span>
              <input
                name="email"
                type="email"
                required
                placeholder="guest@example.com"
                className="mt-2 h-11 w-full rounded-md border border-white/10 bg-[#21161a] px-3 text-sm text-white outline-none placeholder:text-stone-500 focus:border-amber-200"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-stone-200">
                Гостей
              </span>
              <input
                name="guests"
                type="number"
                min="1"
                max="20"
                required
                placeholder="2"
                className="mt-2 h-11 w-full rounded-md border border-white/10 bg-[#21161a] px-3 text-sm text-white outline-none placeholder:text-stone-500 focus:border-amber-200"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-stone-200">Дата</span>
              <input
                name="date"
                type="date"
                required
                className="mt-2 h-11 w-full rounded-md border border-white/10 bg-[#21161a] px-3 text-sm text-white outline-none focus:border-amber-200"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-stone-200">
                Время
              </span>
              <input
                name="time"
                type="time"
                required
                className="mt-2 h-11 w-full rounded-md border border-white/10 bg-[#21161a] px-3 text-sm text-white outline-none focus:border-amber-200"
              />
            </label>
          </div>

          <button
            type="submit"
            className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-md bg-amber-300 px-5 text-sm font-semibold text-[#17100f] transition hover:bg-amber-200"
          >
            Подтвердить бронь
          </button>
        </form>
      </section>
    </main>
  );
}
