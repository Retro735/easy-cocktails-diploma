const accentGradients = [
  "linear-gradient(135deg, #f59e0b, #fb7185 55%, #34d399)",
  "linear-gradient(135deg, #e11d48, #f97316 55%, #fef3c7)",
  "linear-gradient(135deg, #7f1d1d, #ea580c 55%, #27272a)",
  "linear-gradient(135deg, #059669, #a3e635 55%, #fef08a)",
];

export function getCocktailAccent(id: number) {
  return accentGradients[id % accentGradients.length];
}

export function formatCocktailPrice(price: number) {
  return `${price} ₽`;
}
