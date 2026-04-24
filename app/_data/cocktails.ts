export type Cocktail = {
  id: string;
  name: string;
  base: string;
  taste: string;
  strength: string;
  price: string;
  description: string;
  ingredients: string[];
  accent: string;
};

export const cocktails: Cocktail[] = [
  {
    id: "citrus-spritz",
    name: "Citrus Spritz",
    base: "просекко",
    taste: "цитрус, травы, легкая горечь",
    strength: "легкий",
    price: "690 ₽",
    description:
      "Свежий аперитив с игристым вином, апельсиновым биттером и розмарином.",
    ingredients: ["просекко", "апельсиновый биттер", "содовая", "розмарин"],
    accent: "linear-gradient(135deg, #f59e0b, #fb7185 55%, #34d399)",
  },
  {
    id: "berry-collins",
    name: "Berry Collins",
    base: "джин",
    taste: "ягоды, лимон, мягкая сладость",
    strength: "средний",
    price: "740 ₽",
    description:
      "Фруктовая версия классического Collins с малиной, лимоном и газированной водой.",
    ingredients: ["джин", "малина", "лимон", "сахарный сироп", "содовая"],
    accent: "linear-gradient(135deg, #e11d48, #f97316 55%, #fef3c7)",
  },
  {
    id: "smoky-negroni",
    name: "Smoky Negroni",
    base: "джин",
    taste: "горечь, дым, апельсин",
    strength: "крепкий",
    price: "820 ₽",
    description:
      "Плотный барный коктейль с дымным акцентом, вермутом и красным биттером.",
    ingredients: ["джин", "красный вермут", "биттер", "апельсиновая цедра"],
    accent: "linear-gradient(135deg, #7f1d1d, #ea580c 55%, #27272a)",
  },
  {
    id: "mint-fizz",
    name: "Mint Fizz",
    base: "ром",
    taste: "мята, лайм, свежесть",
    strength: "средний",
    price: "710 ₽",
    description:
      "Освежающий коктейль с белым ромом, лаймом, мятой и сухой содовой.",
    ingredients: ["белый ром", "лайм", "мята", "тростниковый сироп", "содовая"],
    accent: "linear-gradient(135deg, #059669, #a3e635 55%, #fef08a)",
  },
];

export function getCocktailById(id: string) {
  return cocktails.find((cocktail) => cocktail.id === id);
}
