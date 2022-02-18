export interface ApiReturnType {
  nutritionList: NutritionType[];
}

export interface NutritionType {
  productName: string;
  brand: string | null;
}
