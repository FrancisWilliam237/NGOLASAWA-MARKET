import { getDb } from "../api/queries/connection";
import { categories, products } from "./schema";

async function seed() {
  const db = getDb();

  console.log("Seeding categories...");

  const cats = await db.insert(categories).values([
    {
      name: "Fruits",
      slug: "fruits",
      description: "Fresh seasonal fruits from local farms",
      image: "/images/cat_fruits.jpg",
    },
    {
      name: "Vegetables",
      slug: "vegetables",
      description: "Garden-fresh vegetables",
      image: "/images/cat_vegetables.jpg",
    },
    {
      name: "Tubers & Roots",
      slug: "tubers",
      description: "Cassava, yams, sweet potatoes and more",
      image: "/images/cat_tubers.jpg",
    },
    {
      name: "Proteins",
      slug: "proteins",
      description: "Fresh fish, chicken and meat",
      image: "/images/cat_proteins.jpg",
    },
    {
      name: "Spices & Condiments",
      slug: "spices",
      description: "Peppers, spices and seasonings",
      image: "/images/cat_spices.jpg",
    },
  ]);

  console.log("Categories seeded:", cats.length);

  console.log("Seeding products...");

  const prods = await db.insert(products).values([
    // Fruits (categoryId: 1)
    {
      name: "Bananas",
      description: "Sweet ripe bananas, perfect for snacking or smoothies",
      price: "500",
      unit: "bunch",
      categoryId: 1,
      image: "/images/produce_bananas.jpg",
      stock: 50,
      featured: "yes",
    },
    {
      name: "Avocados",
      description: "Creamy, buttery avocados",
      price: "300",
      unit: "piece",
      categoryId: 1,
      image: "/images/produce_avocado.jpg",
      stock: 40,
      featured: "yes",
    },
    {
      name: "Pineapple",
      description: "Sweet and juicy pineapples",
      price: "800",
      unit: "piece",
      categoryId: 1,
      image: "/images/produce_pineapple.jpg",
      stock: 30,
      featured: "yes",
    },
    {
      name: "Oranges",
      description: "Fresh oranges, full of vitamin C",
      price: "400",
      unit: "bag",
      categoryId: 1,
      image: "/images/produce_oranges.jpg",
      stock: 45,
      featured: "no",
    },
    {
      name: "Mangoes",
      description: "Ripe and sweet mangoes",
      price: "250",
      unit: "piece",
      categoryId: 1,
      image: "/images/produce_mangoes.jpg",
      stock: 35,
      featured: "yes",
    },
    {
      name: "Papayas",
      description: "Large ripe papayas",
      price: "600",
      unit: "piece",
      categoryId: 1,
      image: "/images/produce_papaya.jpg",
      stock: 25,
      featured: "no",
    },
    // Vegetables (categoryId: 2)
    {
      name: "Tomatoes",
      description: "Fresh red tomatoes for cooking and salads",
      price: "500",
      unit: "basket",
      categoryId: 2,
      image: "/images/produce_tomatoes.jpg",
      stock: 60,
      featured: "yes",
    },
    {
      name: "Onions",
      description: "Yellow onions, essential for every kitchen",
      price: "300",
      unit: "bag",
      categoryId: 2,
      image: "/images/produce_onions.jpg",
      stock: 80,
      featured: "no",
    },
    {
      name: "Green Peppers",
      description: "Crisp green bell peppers",
      price: "200",
      unit: "piece",
      categoryId: 2,
      image: "/images/produce_peppers.jpg",
      stock: 40,
      featured: "no",
    },
    {
      name: "Carrots",
      description: "Fresh orange carrots",
      price: "400",
      unit: "bunch",
      categoryId: 2,
      image: "/images/produce_carrots.jpg",
      stock: 50,
      featured: "no",
    },
    {
      name: "Cabbage",
      description: "Fresh green cabbage",
      price: "500",
      unit: "head",
      categoryId: 2,
      image: "/images/produce_cabbage.jpg",
      stock: 30,
      featured: "yes",
    },
    // Tubers (categoryId: 3)
    {
      name: "Cassava",
      description: "Fresh cassava tubers",
      price: "300",
      unit: "piece",
      categoryId: 3,
      image: "/images/produce_cassava.jpg",
      stock: 60,
      featured: "yes",
    },
    {
      name: "Yams",
      description: "White yams, perfect for fufu or boiling",
      price: "500",
      unit: "tubers",
      categoryId: 3,
      image: "/images/produce_yams.jpg",
      stock: 40,
      featured: "yes",
    },
    {
      name: "Sweet Potatoes",
      description: "Orange sweet potatoes",
      price: "400",
      unit: "bag",
      categoryId: 3,
      image: "/images/produce_sweetpotatoes.jpg",
      stock: 35,
      featured: "no",
    },
    {
      name: "Plantains",
      description: "Green plantains for cooking",
      price: "600",
      unit: "bunch",
      categoryId: 3,
      image: "/images/produce_plantains.jpg",
      stock: 45,
      featured: "yes",
    },
    // Proteins (categoryId: 4)
    {
      name: "Fresh Mackerel",
      description: "Whole fresh mackerel fish",
      price: "1200",
      unit: "piece",
      categoryId: 4,
      image: "/images/produce_mackerel.jpg",
      stock: 20,
      featured: "yes",
    },
    {
      name: "Chicken",
      description: "Whole fresh chicken",
      price: "4500",
      unit: "piece",
      categoryId: 4,
      image: "/images/produce_chicken.jpg",
      stock: 15,
      featured: "yes",
    },
    {
      name: "Beef",
      description: "Fresh beef cuts",
      price: "3500",
      unit: "kg",
      categoryId: 4,
      image: "/images/produce_beef.jpg",
      stock: 20,
      featured: "no",
    },
    {
      name: "Smoked Fish",
      description: "Traditional smoked fish",
      price: "1500",
      unit: "pack",
      categoryId: 4,
      image: "/images/produce_smokedfish.jpg",
      stock: 25,
      featured: "no",
    },
    // Spices (categoryId: 5)
    {
      name: "Fresh Peppers",
      description: "Hot chili peppers",
      price: "200",
      unit: "bunch",
      categoryId: 5,
      image: "/images/produce_peppers_spice.jpg",
      stock: 50,
      featured: "no",
    },
    {
      name: "Ginger",
      description: "Fresh ginger roots",
      price: "300",
      unit: "piece",
      categoryId: 5,
      image: "/images/produce_ginger.jpg",
      stock: 40,
      featured: "no",
    },
    {
      name: "Garlic",
      description: "Fresh garlic bulbs",
      price: "250",
      unit: "head",
      categoryId: 5,
      image: "/images/produce_garlic.jpg",
      stock: 45,
      featured: "no",
    },
  ]);

  console.log("Products seeded:", prods.length);
  console.log("Seed complete!");
}

seed().catch(console.error);
