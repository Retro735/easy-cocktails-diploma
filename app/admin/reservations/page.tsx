import { SectionHeader } from "@/app/_components/SectionHeader";
import { prisma } from "@/lib/prisma";
import { ReservationStatus } from "@/lib/generated/prisma/enums";
import { updateReservationStatus } from "./actions";

export const dynamic = "force-dynamic";

const statusLabels: Record<string, string> = {
  [ReservationStatus.NEW]: "Новая",
  [ReservationStatus.CONFIRMED]: "Подтверждена",
  [ReservationStatus.CANCELED]: "Отменена",
  [ReservationStatus.COMPLETED]: "Завершена",
};

function formatReservationDate(date: Date) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export default async function AdminReservationsPage() {
  const reservations = await prisma.reservation.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="flex-1 bg-[#130c0f]">
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Админ-панель"
          title="Управление бронированиями"
          description="Список бронирований из базы данных с возможностью изменить статус заявки."
        />

        <div className="mt-10 overflow-hidden rounded-lg border border-white/10 bg-white/[0.06]">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10 text-left text-sm">
              <thead className="bg-white/[0.04] text-stone-300">
                <tr>
                  <th className="px-5 py-4 font-semibold">Номер</th>
                  <th className="px-5 py-4 font-semibold">Клиент</th>
                  <th className="px-5 py-4 font-semibold">Телефон</th>
                  <th className="px-5 py-4 font-semibold">Email</th>
                  <th className="px-5 py-4 font-semibold">Гостей</th>
                  <th className="px-5 py-4 font-semibold">Дата</th>
                  <th className="px-5 py-4 font-semibold">Время</th>
                  <th className="px-5 py-4 font-semibold">Статус</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {reservations.map((reservation) => (
                  <tr key={reservation.id} className="text-stone-200">
                    <td className="px-5 py-4 font-semibold text-white">
                      #{reservation.id}
                    </td>
                    <td className="px-5 py-4">{reservation.customerName}</td>
                    <td className="px-5 py-4">{reservation.phone}</td>
                    <td className="px-5 py-4">{reservation.email}</td>
                    <td className="px-5 py-4">{reservation.guests}</td>
                    <td className="px-5 py-4">
                      {formatReservationDate(reservation.date)}
                    </td>
                    <td className="px-5 py-4">{reservation.time}</td>
                    <td className="px-5 py-4">
                      <form
                        action={updateReservationStatus}
                        className="flex min-w-[220px] items-center gap-2"
                      >
                        <input
                          type="hidden"
                          name="reservationId"
                          value={reservation.id}
                        />
                        <select
                          name="status"
                          defaultValue={reservation.status}
                          className="h-9 rounded-md border border-white/10 bg-[#21161a] px-2 text-xs font-semibold text-emerald-100 outline-none focus:border-amber-200"
                        >
                          {Object.values(ReservationStatus).map((status) => (
                            <option key={status} value={status}>
                              {statusLabels[status]}
                            </option>
                          ))}
                        </select>
                        <button
                          type="submit"
                          className="h-9 rounded-md bg-amber-300 px-3 text-xs font-semibold text-[#17100f] transition hover:bg-amber-200"
                        >
                          Сохранить
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
                {reservations.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-5 py-8 text-center text-stone-300"
                    >
                      Бронирований пока нет.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
