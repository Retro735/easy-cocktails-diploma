import { logoutAdmin } from "../actions";

export function AdminLogout() {
  return (
    <form action={logoutAdmin}>
      <button
        type="submit"
        className="h-11 rounded-md border border-white/15 px-5 text-sm font-semibold text-white transition hover:bg-white/10"
      >
        Выйти
      </button>
    </form>
  );
}
