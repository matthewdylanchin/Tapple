export const CATEGORIES = [
  "Animals", "Foods", "Countries", "Cities", "Movies", "Colors",
  "Sports", "Fruits", "Vegetables", "Occupations", "Clothing",
  "Furniture", "Vehicles", "Instruments", "Brands", "Drinks",
] as const;

export function randomCategory(): string {
  return CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
}
