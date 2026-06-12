import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { ReservationStatus, UserRole } from "../lib/generated/prisma/enums";

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

const cocktailSeeds = [
  {
    name: "Citrus Spritz",
    description:
      "Свежий аперитив с игристым вином, апельсиновым биттером и розмарином.",
    taste: "цитрус, травы, легкая горечь",
    strength: "легкий",
    price: 690,
    imageUrl: "/images/coctails/citrus-spritz.png",
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
    imageUrl: "/images/coctails/berry-collins.jpg",
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
    imageUrl: "/images/coctails/smoky-negroni.jpg",
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
    imageUrl: "/images/coctails/mint-fizz.jpg",
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
    imageUrl: "/images/coctails/rosemary-sour.jpg",
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
    imageUrl: "/images/coctails/ginger-mule.jpg",
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
    imageUrl: "/images/coctails/cranberry-highball.jpg",
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
    imageUrl: "/images/coctails/vermouth-tonic.jpg",
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
    imageUrl: "/images/coctails/raspberry-rum-punch.jpg",
    category: "Авторские",
    ingredients: ["Белый ром", "Малина", "Лайм", "Тростниковый сироп"],
  },
  {
    name: "Coconut Tequila Sunset",
    description:
      "Текила, кокосовое молоко, маракуйя и лайм создают насыщенный тропический вкус с мягкой сливочной текстурой.",
    taste: "тропический, сливочный, кисло-сладкий",
    strength: "средний",
    price: 790,
    imageUrl: "/images/coctails/coconut-tequila-sunset.jpg",
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
    imageUrl: "/images/coctails/mint-cucumber-cooler.jpg",
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
    imageUrl: "/images/coctails/cranberry-whiskey-sour.jpg",
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
    imageUrl: "/images/coctails/rosemary-grapefruit-tonic.jpg",
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
    imageUrl: "/images/coctails/strawberry-basil-smash.jpg",
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
    imageUrl: "/images/coctails/passion-rum-punch.jpg",
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
    imageUrl: "/images/coctails/blueberry-gin-fizz.jpg",
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
    imageUrl: "/images/coctails/almond-orange-sour.jpg",
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
    imageUrl: "/images/coctails/coffee-rum-velvet.jpg",
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
    imageUrl: "/images/coctails/vermouth-citrus-spritz.jpg",
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
  await prisma.user.deleteMany();

  const adminPasswordHash = await bcrypt.hash("demo-password-change-me", 10);
  const bartenderPasswordHash = await bcrypt.hash("bartender-password", 10);

  await prisma.user.createMany({
    data: [
      {
        name: "Администратор бара",
        email: "admin@easybar.local",
        password: adminPasswordHash,
        role: UserRole.ADMIN,
      },
      {
        name: "Бартендер",
        email: "bartender@easybar.local",
        password: bartenderPasswordHash,
        role: UserRole.BARTENDER,
      },
    ],
  });

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

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
