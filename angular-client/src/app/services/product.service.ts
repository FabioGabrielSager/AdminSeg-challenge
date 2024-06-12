import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {Product} from "../models/product/product";
import {ProductsPage} from "../models/product/productsPage";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private httpClient: HttpClient = inject(HttpClient);
  private baseUrl = "http://localhost:8000/api"

  constructor() { }

  searchProduct(name: string, categoryId: number|undefined, page: number|undefined): Observable<ProductsPage> {
    let baseParams: HttpParams = new HttpParams();

    if(name) {
      baseParams = baseParams.append('productName', name);
    }

    if(categoryId) {
      baseParams = baseParams.append('categoryId', categoryId);
    }

    if(page) {
      baseParams = baseParams.append('page', page);
    }

    return this.httpClient.get<ProductsPage>(this.baseUrl + "/product", {params: baseParams});
  }

  createProduct(formData: FormData): Observable<Product> {
    return this.httpClient.post<Product>(this.baseUrl + "/secure/product/create", formData);
  }

  getCurrentUserProducts(name: string, categoryId: number|undefined, page: number|undefined): Observable<ProductsPage> {
    let baseParams: HttpParams = new HttpParams();

    if(name) {
      baseParams = baseParams.append('productName', name);
    }

    if(categoryId) {
      baseParams = baseParams.append('categoryId', categoryId);
    }

    return this.httpClient.get<ProductsPage>(this.baseUrl + "/secure/user/products", {params: baseParams});
  }

  getProductDetails(productId: number) {
    return this.httpClient.get<Product>(this.baseUrl + "/product/" + productId);
  }

  modifyProduct(formData: FormData) {
    return this.httpClient.post<Product>(this.baseUrl + "/secure/product/update", formData);
  }

  deleteProduct(productId: number) {
    return this.httpClient.delete(this.baseUrl + "/secure/product/delete/" + productId);
  }
}
