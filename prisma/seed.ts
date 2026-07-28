import "dotenv/config";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { prisma } from "../lib/prisma";
import { ReservationStatus } from "../lib/generated/prisma/enums";

const ingredientNames = [
  "Джин",
  "Белый ром",
  "Просекко",
  "Красный вермут",
  "Апельсиновый биттер",
  "Лайм",
  "Лимон",
  "Мята",
  "Малина",
  "Клюква",
  "Содовая",
  "Тростниковый сироп",
  "Розмарин",
  "Имбирь",
  "Апельсиновая цедра",
  "Водка",
  "Текила",
  "Виски",
  "Бурбон",
  "Тоник",
  "Грейпфрутовый сок",
  "Ананасовый сок",
  "Кокосовое молоко",
  "Кофейный ликер",
  "Миндальный сироп",
  "Медовый сироп",
  "Гранатовый сироп",
  "Огурец",
  "Базилик",
  "Клубника",
  "Голубика",
  "Персик",
  "Маракуйя",
  "Ангостура",
  "Яичный белок",
];

const categoryNames = ["Легкие", "Классика", "Авторские"];

export const cocktailSeeds = [
  {
    name: "Citrus Spritz",
    description:
      "Свежий аперитив с игристым вином, апельсиновым биттером и розмарином.",
    taste: "цитрус, травы, легкая горечь",
    strength: "легкий",
    price: 690,
    imageUrl: "/images/cocktails/citrus-spritz.png",
    category: "Легкие",
    ingredients: ["Просекко", "Апельсиновый биттер", "Содовая", "Розмарин"],
  },
  {
    name: "Berry Collins",
    description:
      "Фруктовая версия Collins с малиной, лимоном и газированной водой.",
    taste: "ягоды, лимон, мягкая сладость",
    strength: "средний",
    price: 740,
    imageUrl: "/images/cocktails/berry-collins-1778769979685.png",
    category: "Авторские",
    ingredients: ["Джин", "Малина", "Лимон", "Тростниковый сироп", "Содовая"],
  },
  {
    name: "Smoky Negroni",
    description:
      "Плотный барный коктейль с дымным акцентом, вермутом и красным биттером.",
    taste: "горечь, дым, апельсин",
    strength: "крепкий",
    price: 820,
    imageUrl: "/images/cocktails/smoky-negroni-1778770266164.png",
    category: "Классика",
    ingredients: ["Джин", "Красный вермут", "Апельсиновый биттер", "Апельсиновая цедра"],
  },
  {
    name: "Mint Fizz",
    description:
      "Освежающий коктейль с белым ромом, лаймом, мятой и сухой содовой.",
    taste: "мята, лайм, свежесть",
    strength: "средний",
    price: 710,
    imageUrl: "/images/cocktails/mint-fizz-1778770437093.png",
    category: "Легкие",
    ingredients: ["Белый ром", "Лайм", "Мята", "Тростниковый сироп", "Содовая"],
  },
  {
    name: "Rosemary Sour",
    description:
      "Кисло-сладкий сауэр с травяным ароматом розмарина и свежим лимоном.",
    taste: "лимон, травы, сладость",
    strength: "средний",
    price: 760,
    imageUrl: "/images/cocktails/rosemary-sour-1780871526560.png",
    category: "Авторские",
    ingredients: ["Джин", "Лимон", "Розмарин", "Тростниковый сироп"],
  },
  {
    name: "Ginger Mule",
    description:
      "Бодрящий микс с лаймом, имбирем и пряной газированной текстурой.",
    taste: "имбирь, лайм, пряность",
    strength: "средний",
    price: 730,
    imageUrl: "/images/cocktails/ginger-mule-1778770996184.png",
    category: "Классика",
    ingredients: ["Белый ром", "Лайм", "Имбирь", "Содовая"],
  },
  {
    name: "Cranberry Highball",
    description:
      "Легкий хайбол с клюквой, цитрусом и сухим освежающим финишем.",
    taste: "клюква, цитрус, свежесть",
    strength: "легкий",
    price: 680,
    imageUrl: "/images/cocktails/cranberry-highball-1778771135290.png",
    category: "Легкие",
    ingredients: ["Джин", "Клюква", "Лимон", "Содовая"],
  },
  {
    name: "Vermouth Tonic",
    description:
      "Низкоалкогольный коктейль с красным вермутом, содовой и апельсином.",
    taste: "вермут, апельсин, мягкая горечь",
    strength: "легкий",
    price: 650,
    imageUrl: "/images/cocktails/vermouth-tonic-1778771311895.png",
    category: "Легкие",
    ingredients: ["Красный вермут", "Содовая", "Апельсиновая цедра"],
  },
  {
    name: "Raspberry Rum Punch",
    description:
      "Ягодный ромовый пунш с малиной, лаймом и мягкой тростниковой сладостью.",
    taste: "малина, лайм, ром",
    strength: "средний",
    price: 790,
    imageUrl: "/images/cocktails/raspberry-rum-punch-1780870912114.png",
    category: "Авторские",
    ingredients: ["Белый ром", "Малина", "Лайм", "Тростниковый сироп"],
  },
  {
    name: "Pineapple Rum Splash",
    description:
      "Освежающий коктейль на белом роме с ананасовым соком и лаймом. Подходит для тех, кто любит мягкие фруктовые напитки.",
    taste: "Сладкий, тропический, слегка кислый",
    strength: "Средний",
    price: 590,
    imageUrl: "/images/cocktails/pineapple-rum-splash-1780871430793.png",
    category: "Авторские",
    ingredients: ["Белый ром", "Лайм", "Тростниковый сироп", "Ананасовый сок"],
  },
  {
    name: "Berry Bourbon Fizz",
    description:
      "Бурбон сочетается с малиной, клюквой и содовой, создавая яркий ягодный вкус с легкой газированностью.",
    taste: "Ягодный, сладко-кислый",
    strength: "Средний",
    price: 650,
    imageUrl: "/images/cocktails/berry-bourbon-fizz-1780871481383.png",
    category: "Авторские",
    ingredients: ["Малина", "Клюква", "Содовая", "Бурбон"],
  },
  {
    name: "Ginger Vodka Mule",
    description:
      "Коктейль на водке с имбирем, лаймом и содовой. Отличается бодрящим вкусом и легкой остротой.",
    taste: "Пряный, свежий, кислый",
    strength: "Средний",
    price: 650,
    imageUrl: "/images/cocktails/ginger-vodka-mule-1780871712722.png",
    category: "Авторские",
    ingredients: ["Лайм", "Содовая", "Имбирь", "Водка"],
  },
  {
    name: "Citrus Gin Breeze",
    description:
      "Джин, грейпфрутовый сок, лимон и тоник создают свежий напиток с выраженной цитрусовой горчинкой.",
    taste: "Цитрусовый, свежий, горьковатый",
    strength: "Средний",
    price: 600,
    imageUrl: "/images/cocktails/citrus-gin-breeze-1780871866735.png",
    category: "Авторские",
    ingredients: ["Джин", "Лимон", "Грейпфрутовый сок", "Медовый сироп"],
  },
  {
    name: "Peach Prosecco Sparkle",
    description:
      "Легкий игристый коктейль с просекко, персиком и медовым сиропом. Хорошо подходит для мягкого вечернего напитка.",
    taste: "Сладкий, фруктовый, легкий",
    strength: "Слабый",
    price: 720,
    imageUrl: "/images/cocktails/peach-prosecco-sparkle-1780872008463.png",
    category: "Авторские",
    ingredients: ["Просекко", "Лимон", "Медовый сироп", "Персик"],
  },
  {
    name: "Coconut Tequila Sunset",
    description:
      "Текила, кокосовое молоко, маракуйя и лайм создают насыщенный тропический вкус с мягкой сливочной текстурой.",
    taste: "тропический, сливочный, кисло-сладкий",
    strength: "средний",
    price: 790,
    imageUrl: "/images/cocktails/coconut-tequila-sunset-1780872203230.png",
    category: "Авторские",
    ingredients: ["Текила", "Кокосовое молоко", "Маракуйя", "Лайм"],
  },
  {
    name: "Mint Cucumber Cooler",
    description:
      "Освежающий безалкогольный коктейль с огурцом, мятой, лаймом, содовой и тростниковым сиропом.",
    taste: "свежий, травяной, слегка сладкий",
    strength: "безалкогольный",
    price: 620,
    imageUrl: "/images/cocktails/mint-cucumber-cooler-1780872380804.png",
    category: "Авторские",
    ingredients: ["Огурец", "Мята", "Лайм", "Содовая", "Тростниковый сироп"],
  },
  {
    name: "Cranberry Whiskey Sour",
    description:
      "Виски, клюква, лимон и яичный белок создают плотный сауэр с яркой кислинкой и мягкой пеной.",
    taste: "кислый, ягодный, насыщенный",
    strength: "крепкий",
    price: 820,
    imageUrl: "/images/cocktails/cranberry-whiskey-sour-1780872525402.png",
    category: "Классика",
    ingredients: ["Виски", "Клюква", "Лимон", "Яичный белок", "Тростниковый сироп"],
  },
  {
    name: "Rosemary Grapefruit Tonic",
    description:
      "Джин с грейпфрутовым соком, розмарином и тоником. Напиток с сухим вкусом и выразительным ароматом.",
    taste: "сухой, цитрусовый, травяной",
    strength: "средний",
    price: 760,
    imageUrl: "/images/cocktails/rosemary-grapefruit-tonic-1780872769526.png",
    category: "Авторские",
    ingredients: ["Джин", "Грейпфрутовый сок", "Розмарин", "Тоник"],
  },
  {
    name: "Strawberry Basil Smash",
    description:
      "Водка, клубника, базилик и лимон образуют яркий коктейль с фруктовой сладостью и свежим травяным оттенком.",
    taste: "сладкий, ягодный, травяной",
    strength: "средний",
    price: 780,
    imageUrl: "/images/cocktails/strawberry-basil-smash-1780872891995.png",
    category: "Авторские",
    ingredients: ["Водка", "Клубника", "Базилик", "Лимон", "Тростниковый сироп"],
  },
  {
    name: "Passion Rum Punch",
    description:
      "Белый ром, маракуйя, ананасовый сок и лайм создают сочный коктейль с выраженным тропическим характером.",
    taste: "тропический, сладко-кислый",
    strength: "средний",
    price: 790,
    imageUrl: "/images/cocktails/passion-rum-punch-1780873024813.png",
    category: "Классика",
    ingredients: ["Белый ром", "Маракуйя", "Ананасовый сок", "Лайм"],
  },
  {
    name: "Blueberry Gin Fizz",
    description:
      "Джин, голубика, лимон, содовая и тростниковый сироп дают свежий ягодный fizz с легкой кислинкой.",
    taste: "ягодный, свежий, слегка кислый",
    strength: "средний",
    price: 760,
    imageUrl: "/images/cocktails/blueberry-gin-fizz-1780873251543.png",
    category: "Классика",
    ingredients: ["Джин", "Голубика", "Лимон", "Содовая", "Тростниковый сироп"],
  },
  {
    name: "Almond Orange Sour",
    description:
      "Виски с миндальным сиропом, апельсиновым биттером, лимоном и яичным белком. Получается насыщенный сауэр с мягким ореховым послевкусием.",
    taste: "ореховый, цитрусовый, кислый",
    strength: "крепкий",
    price: 840,
    imageUrl: "/images/cocktails/almond-orange-sour-1780873405469.png",
    category: "Авторские",
    ingredients: [
      "Виски",
      "Миндальный сироп",
      "Апельсиновый биттер",
      "Лимон",
      "Яичный белок",
    ],
  },
  {
    name: "Coffee Rum Velvet",
    description:
      "Белый ром, кофейный ликер и кокосовое молоко создают мягкий десертный коктейль с бархатной текстурой.",
    taste: "кофейный, сливочный, сладкий",
    strength: "средний",
    price: 780,
    imageUrl: "/images/cocktails/coffee-rum-velvet-1780873588387.png",
    category: "Авторские",
    ingredients: ["Белый ром", "Кофейный ликер", "Кокосовое молоко"],
  },
  {
    name: "Vermouth Citrus Spritz",
    description:
      "Красный вермут, просекко, апельсиновая цедра и содовая образуют легкий спритц с цитрусовым ароматом и приятной горчинкой.",
    taste: "горьковато-сладкий, цитрусовый, легкий",
    strength: "слабый",
    price: 690,
    imageUrl: "/images/cocktails/vermouth-citrus-spritz-1780873732173.png",
    category: "Классика",
    ingredients: ["Красный вермут", "Просекко", "Апельсиновая цедра", "Содовая"],
  },
];

const reservationSeeds = [
  {
    customerName: "Анна Смирнова",
    phone: "+7 900 111-22-33",
    email: "anna@example.com",
    guests: 4,
    date: new Date("2026-04-25T00:00:00.000Z"),
    time: "19:30",
    status: ReservationStatus.CONFIRMED,
  },
  {
    customerName: "Илья Волков",
    phone: "+7 900 222-33-44",
    email: "ilya@example.com",
    guests: 2,
    date: new Date("2026-04-25T00:00:00.000Z"),
    time: "21:00",
    status: ReservationStatus.NEW,
  },
  {
    customerName: "Мария Орлова",
    phone: "+7 900 333-44-55",
    email: "maria@example.com",
    guests: 6,
    date: new Date("2026-04-26T00:00:00.000Z"),
    time: "18:00",
    status: ReservationStatus.COMPLETED,
  },
  {
    customerName: "Павел Соколов",
    phone: "+7 900 444-55-66",
    email: "pavel@example.com",
    guests: 3,
    date: new Date("2026-04-27T00:00:00.000Z"),
    time: "20:00",
    status: ReservationStatus.CANCELED,
  },
];

async function main() {
  await prisma.preference.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.cocktail.deleteMany();
  await prisma.ingredient.deleteMany();
  await prisma.category.deleteMany();



  const categories = await Promise.all(
    categoryNames.map((name) => prisma.category.create({ data: { name } })),
  );
  const categoryByName = new Map(categories.map((category) => [category.name, category]));

  const ingredients = await Promise.all(
    ingredientNames.map((name) => prisma.ingredient.create({ data: { name } })),
  );
  const ingredientByName = new Map(
    ingredients.map((ingredient) => [ingredient.name, ingredient]),
  );

  for (const cocktail of cocktailSeeds) {
    const category = categoryByName.get(cocktail.category);

    if (!category) {
      throw new Error(`Category not found: ${cocktail.category}`);
    }

    await prisma.cocktail.create({
      data: {
        name: cocktail.name,
        description: cocktail.description,
        taste: cocktail.taste,
        strength: cocktail.strength,
        price: cocktail.price,
        imageUrl: cocktail.imageUrl,
        categoryId: category.id,
        ingredients: {
          connect: cocktail.ingredients.map((name) => {
            const ingredient = ingredientByName.get(name);

            if (!ingredient) {
              throw new Error(`Ingredient not found: ${name}`);
            }

            return { id: ingredient.id };
          }),
        },
      },
    });
  }

  await Promise.all(
    reservationSeeds.map((reservation) =>
      prisma.reservation.create({ data: reservation }),
    ),
  );

  await prisma.preference.create({
    data: {
      taste: "цитрус и свежесть",
      strength: "легкий",
      favoriteIngredients: ["Лайм", "Мята", "Содовая"],
      dislikedIngredients: ["Красный вермут"],
    },
  });
}

const isDirectExecution =
  Boolean(process.argv[1]) &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

if (isDirectExecution) {
  main()
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (error) => {
      console.error(error);
      await prisma.$disconnect();
      process.exit(1);
    });
}
