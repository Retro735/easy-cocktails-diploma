import { redirect } from "next/navigation";
import { SectionHeader } from "@/app/_components/SectionHeader";
import { getAdminSessionUser } from "@/lib/admin-auth";
import { loginAdmin } from "./actions";

type AdminLoginPageProps = {
  searchParams: Promise<{
    error?: string | string[];
  }>;
};

function getSearchValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminLoginPage({
  searchParams,
}: AdminLoginPageProps) {
  const [params, user] = await Promise.all([
    searchParams,
    getAdminSessionUser(),
  ]);

  if (user) {
    redirect("/admin");
  }

  const error = getSearchValue(params.error);

  return (
    <main className="flex-1 bg-[#130c0f]">
      <section className="mx-auto grid max-w-5xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <SectionHeader
          eyebrow="Вход администратора"
          title="Доступ к управлению баром"
          description="Введите учетные данные администратора или бармена для доступа к панели управления."
        />

        <form
          action={loginAdmin}
          className="rounded-lg border border-white/10 bg-white/[0.06] p-5 sm:p-6"
        >
          {error === "invalid" ? (
            <p className="mb-5 rounded-md border border-rose-200/30 bg-rose-300/10 px-4 py-3 text-sm font-medium text-rose-100">
              Неверный email, пароль или роль пользователя.
            </p>
          ) : null}

          <label className="block">
            <span className="text-sm font-semibold text-stone-200">Email</span>
            <input
              name="email"
              type="email"
              required
              placeholder="admin@easybar.local"
              className="mt-2 h-11 w-full rounded-md border border-white/10 bg-[#21161a] px-3 text-sm text-white outline-none placeholder:text-stone-500 focus:border-amber-200"
            />
          </label>
          <label className="mt-5 block">
            <span className="text-sm font-semibold text-stone-200">
              Пароль
            </span>
            <input
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="mt-2 h-11 w-full rounded-md border border-white/10 bg-[#21161a] px-3 text-sm text-white outline-none placeholder:text-stone-500 focus:border-amber-200"
            />
          </label>

          <button
            type="submit"
            className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-md bg-amber-300 px-5 text-sm font-semibold text-[#17100f] transition hover:bg-amber-200"
          >
            Войти
          </button>
        </form>
      </section>
    </main>
  );
}
