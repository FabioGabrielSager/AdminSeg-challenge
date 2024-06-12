import {Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {ProductsDisplayComponent} from "../products-display/products-display.component";
import {CategoryService} from "../../../services/category.service";
import {Subscription} from "rxjs";
import {Category} from "../../../models/category/category";
import {FormsModule} from "@angular/forms";

export interface SearchRequest {
  productName: string;
  categoryId: number | undefined;
}

@Component({
  selector: 'app-product-finder',
  standalone: true,
  imports: [
    ProductsDisplayComponent,
    FormsModule
  ],
  templateUrl: './product-finder.component.html',
  styleUrl: './product-finder.component.css'
})
export class ProductFinderComponent implements OnInit, OnDestroy {
  @Input() title: string = "Buscar producto"
  @Output() onSearch: EventEmitter<SearchRequest> = new EventEmitter<SearchRequest>();
  categories: Category[] = [];
  searchRequest = { productName: "", categoryId: undefined } as SearchRequest;

  private categoryService: CategoryService = inject(CategoryService);
  private subs: Subscription = new Subscription();

  ngOnInit(): void {
    this.subs.add(
      this.categoryService.getAll().subscribe(
        {
          next: value => this.categories = value.categories,
          error: err => console.error(err)
        }
      )
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onSubmitSearch() {
    this.onSearch.emit({
      productName: this.searchRequest.productName,
      categoryId: this.searchRequest.categoryId == -1 ? undefined : this.searchRequest.categoryId
    });
  }

  onKeydown($event: KeyboardEvent) {
    if($event.key === "Enter") {
      this.onSubmitSearch();
    }
  }
}
