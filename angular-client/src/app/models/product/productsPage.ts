import {Product} from "./product";

export interface ProductsPage {
  page: number;
  limit: number;
  totalMatches: number;
  products: Product[]
}
