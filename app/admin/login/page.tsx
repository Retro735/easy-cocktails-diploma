import Link from "next/link";
import { SectionHeader } from "@/app/_components/SectionHeader";

export default function AdminLoginPage() {
  return (
    <main className="flex-1 bg-[#130c0f]">
      <section className="mx-auto grid max-w-5xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <SectionHeader
          eyebrow="Вход администратора"
          title="Доступ к управлению баром"
          description="Форма-заглушка для будущей авторизации администратора."
        />

        <form className="rounded-lg border border-white/10 bg-white/[0.06] p-5 sm:p-6">
          <label className="block">
            <span className="text-sm font-semibold text-stone-200">Email</span>
            <input
              type="email"
              placeholder="admin@easybar.local"
              className="mt-2 h-11 w-full rounded-md border border-white/10 bg-[#21161a] px-3 text-sm text-white outline-none placeholder:text-stone-500 focus:border-amber-200"
            />
          </label>
          <label className="mt-5 block">
            <span className="text-sm font-semibold text-stone-200">
              Пароль
            </span>
            <input
              type="password"
              placeholder="••••••••"
              className="mt-2 h-11 w-full rounded-md border border-white/10 bg-[#21161a] px-3 text-sm text-white outline-none placeholder:text-stone-500 focus:border-amber-200"
            />
          </label>

          <Link
            href="/admin"
            className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-md bg-amber-300 px-5 text-sm font-semibold text-[#17100f] transition hover:bg-amber-200"
          >
            Войти
          </Link>
        </form>
      </section>
    </main>
  );
}
