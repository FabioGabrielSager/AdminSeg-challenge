import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Category} from "../models/category/category";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private httpClient: HttpClient = inject(HttpClient);
  private baseUrl = "http://localhost:8000/api";

  constructor() { }

  getAll(): Observable<{categories: Category[]}> {
    return this.httpClient.get<{categories: Category[]}>(this.baseUrl + "/category");
  }

  deleteCategory(categoryId: number) {
    return this.httpClient.delete(this.baseUrl + "/secure/category/delete/" + categoryId);
  }

  createCategory(formData: FormData) {
    return this.httpClient.post<Category>(this.baseUrl + "/secure/category/create", formData);
  }

  modifyCategory(formData: FormData) {
    return this.httpClient.post<Category>(this.baseUrl + "/secure/category/modify", formData);
  }
}
