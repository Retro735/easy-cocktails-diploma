"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { ReservationStatus } from "@/lib/generated/prisma/enums";
import type { ReservationStatus as ReservationStatusValue } from "@/lib/generated/prisma/enums";

const allowedStatuses = new Set<string>(Object.values(ReservationStatus));

function isReservationStatus(status: string): status is ReservationStatusValue {
  return allowedStatuses.has(status);
}

export async function updateReservationStatus(formData: FormData) {
  const reservationId = Number(formData.get("reservationId"));
  const status = formData.get("status");

  if (
    !Number.isSafeInteger(reservationId) ||
    reservationId <= 0 ||
    typeof status !== "string" ||
    !isReservationStatus(status)
  ) {
    return;
  }

  await prisma.reservation.update({
    where: {
      id: reservationId,
    },
    data: {
      status,
    },
  });

  revalidatePath("/admin/reservations");
}
