import { SectionHeader } from "@/app/_components/SectionHeader";
import { reservations } from "@/app/_data/reservations";

export default function AdminReservationsPage() {
  return (
    <main className="flex-1 bg-[#130c0f]">
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Админ-панель"
          title="Управление бронированиями"
          description="Список тестовых броней для будущей обработки заявок гостей."
        />

        <div className="mt-10 overflow-hidden rounded-lg border border-white/10 bg-white/[0.06]">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10 text-left text-sm">
              <thead className="bg-white/[0.04] text-stone-300">
                <tr>
                  <th className="px-5 py-4 font-semibold">Номер</th>
                  <th className="px-5 py-4 font-semibold">Гость</th>
                  <th className="px-5 py-4 font-semibold">Дата</th>
                  <th className="px-5 py-4 font-semibold">Время</th>
                  <th className="px-5 py-4 font-semibold">Гостей</th>
                  <th className="px-5 py-4 font-semibold">Стол</th>
                  <th className="px-5 py-4 font-semibold">Статус</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {reservations.map((reservation) => (
                  <tr key={reservation.id} className="text-stone-200">
                    <td className="px-5 py-4 font-semibold text-white">
                      {reservation.id}
                    </td>
                    <td className="px-5 py-4">{reservation.guest}</td>
                    <td className="px-5 py-4">{reservation.date}</td>
                    <td className="px-5 py-4">{reservation.time}</td>
                    <td className="px-5 py-4">{reservation.guests}</td>
                    <td className="px-5 py-4">{reservation.table}</td>
                    <td className="px-5 py-4">
                      <span className="rounded-md bg-emerald-300/15 px-2 py-1 text-xs font-semibold text-emerald-100">
                        {reservation.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
