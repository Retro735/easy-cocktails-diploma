import Link from "next/link";

export default function BookingSuccessPage() {
  return (
    <main className="flex flex-1 items-center bg-[#130c0f]">
      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <div className="rounded-lg border border-emerald-200/20 bg-emerald-300/10 p-8">
          <p className="text-sm font-semibold uppercase text-emerald-100">
            Бронирование создано
          </p>
          <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">
            Столик ждет гостей
          </h1>
          <p className="mt-5 text-lg leading-8 text-stone-300">
            Номер тестовой брони:{" "}
            <span className="font-semibold text-amber-100">BR-1045</span>
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/cocktails"
              className="inline-flex h-11 items-center justify-center rounded-md border border-white/15 px-5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Посмотреть меню
            </Link>
            <Link
              href="/"
              className="inline-flex h-11 items-center justify-center rounded-md bg-amber-300 px-5 text-sm font-semibold text-[#17100f] transition hover:bg-amber-200"
            >
              На главную
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
