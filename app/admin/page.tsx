import Link from "next/link";
import { SectionHeader } from "@/app/_components/SectionHeader";
import { cocktails } from "@/app/_data/cocktails";
import { reservations } from "@/app/_data/reservations";

export default function AdminPage() {
  const cards = [
    {
      title: "Коктейли",
      value: cocktails.length,
      href: "/admin/cocktails",
      text: "позиции в меню",
    },
    {
      title: "Бронирования",
      value: reservations.length,
      href: "/admin/reservations",
      text: "заявки в тестовых данных",
    },
    {
      title: "Вход",
      value: 1,
      href: "/admin/login",
      text: "экран авторизации",
    },
  ];

  return (
    <main className="flex-1 bg-[#130c0f]">
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Админ-панель"
          title="Рабочая область администратора"
          description="Стартовый экран управления меню и бронированиями без подключения базы данных."
        />

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="rounded-lg border border-white/10 bg-white/[0.06] p-6 transition hover:border-amber-200/60 hover:bg-white/[0.09]"
            >
              <p className="text-sm font-semibold text-amber-100">
                {card.title}
              </p>
              <p className="mt-4 text-5xl font-semibold text-white">
                {card.value}
              </p>
              <p className="mt-3 text-sm text-stone-300">{card.text}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
