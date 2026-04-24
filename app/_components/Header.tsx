import Link from "next/link";

const mainNav = [
  { href: "/", label: "Главная" },
  { href: "/cocktails", label: "Коктейли" },
  { href: "/recommend", label: "Подбор" },
  { href: "/booking", label: "Бронирование" },
];

const adminNav = [
  { href: "/admin", label: "Админ" },
  { href: "/admin/cocktails", label: "Коктейли" },
  { href: "/admin/reservations", label: "Брони" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#140e11]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-md bg-amber-300 text-sm font-black text-[#140e11]">
              EC
            </span>
            <span>
              <span className="block text-lg font-semibold text-white">
                Easy Cocktails
              </span>
              <span className="block text-xs font-medium text-amber-100/70">
                cocktail bar
              </span>
            </span>
          </Link>

          <Link
            href="/booking"
            className="inline-flex h-10 items-center justify-center rounded-md bg-amber-300 px-4 text-sm font-semibold text-[#160d10] transition hover:bg-amber-200"
          >
            Забронировать стол
          </Link>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <nav
            aria-label="Основная навигация"
            className="flex flex-wrap items-center gap-2"
          >
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap rounded-md border border-white/10 px-3 py-2 text-sm font-medium text-stone-100 transition hover:border-amber-300/70 hover:bg-white/10"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <nav
            aria-label="Навигация администратора"
            className="flex flex-wrap items-center gap-2"
          >
            {adminNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap rounded-md bg-white/[0.06] px-3 py-2 text-sm font-medium text-stone-300 transition hover:bg-emerald-300/15 hover:text-emerald-100"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/admin/login"
              className="whitespace-nowrap rounded-md bg-rose-300/15 px-3 py-2 text-sm font-semibold text-rose-100 transition hover:bg-rose-300/25"
            >
              Вход
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
