"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ReservationStatus } from "@/lib/generated/prisma/enums";

function getRequiredValue(formData: FormData, field: string) {
  const value = formData.get(field);

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

export async function createReservation(formData: FormData) {
  const customerName = getRequiredValue(formData, "customerName");
  const phone = getRequiredValue(formData, "phone");
  const email = getRequiredValue(formData, "email");
  const guestsValue = getRequiredValue(formData, "guests");
  const dateValue = getRequiredValue(formData, "date");
  const time = getRequiredValue(formData, "time");

  if (!customerName || !phone || !email || !guestsValue || !dateValue || !time) {
    redirect("/booking?error=required");
  }

  const guests = Number(guestsValue);
  const date = new Date(`${dateValue}T00:00:00.000Z`);

  if (
    !Number.isInteger(guests) ||
    guests < 1 ||
    guests > 20 ||
    Number.isNaN(date.getTime()) ||
    !email.includes("@")
  ) {
    redirect("/booking?error=invalid");
  }

  const reservation = await prisma.reservation.create({
    data: {
      customerName,
      phone,
      email,
      guests,
      date,
      time,
      status: ReservationStatus.NEW,
    },
    select: {
      id: true,
    },
  });

  redirect(`/booking/success?id=${reservation.id}`);
}
