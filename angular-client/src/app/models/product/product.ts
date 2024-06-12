import {Category} from "../category/category";

export interface Product {
  id: number;
  name: string;
  image: string;
  category: Category;
}
