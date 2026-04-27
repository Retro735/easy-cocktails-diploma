import Link from "next/link";
import { AdminLogout } from "./_components/AdminLogout";
import { SectionHeader } from "@/app/_components/SectionHeader";
import { requireAdminUser } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [user, cocktailsCount, reservationsCount] = await Promise.all([
    requireAdminUser(),
    prisma.cocktail.count(),
    prisma.reservation.count(),
  ]);

  const cards = [
    {
      title: "Коктейли",
      value: cocktailsCount,
      href: "/admin/cocktails",
      text: "позиции в меню",
    },
    {
      title: "Бронирования",
      value: reservationsCount,
      href: "/admin/reservations",
      text: "заявки гостей",
    },
    {
      title: "Пользователь",
      value: user.role,
      href: "/admin",
      text: user.email,
    },
  ];

  return (
    <main className="flex-1 bg-[#130c0f]">
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            eyebrow="Админ-панель"
            title="Рабочая область администратора"
            description="Стартовый экран управления меню и бронированиями."
          />
          <AdminLogout />
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.title}
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
