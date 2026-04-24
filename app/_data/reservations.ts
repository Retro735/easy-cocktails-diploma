export type Reservation = {
  id: string;
  guest: string;
  date: string;
  time: string;
  guests: number;
  table: string;
  status: "новая" | "подтверждена" | "ожидает";
};

export const reservations: Reservation[] = [
  {
    id: "BR-1042",
    guest: "Анна Смирнова",
    date: "25.04.2026",
    time: "19:30",
    guests: 4,
    table: "T-03",
    status: "подтверждена",
  },
  {
    id: "BR-1043",
    guest: "Илья Волков",
    date: "25.04.2026",
    time: "21:00",
    guests: 2,
    table: "T-07",
    status: "новая",
  },
  {
    id: "BR-1044",
    guest: "Мария Орлова",
    date: "26.04.2026",
    time: "18:00",
    guests: 6,
    table: "T-01",
    status: "ожидает",
  },
];
