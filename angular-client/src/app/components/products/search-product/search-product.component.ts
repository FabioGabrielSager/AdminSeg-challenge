import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {ProductFinderComponent, SearchRequest} from "../product-finder/product-finder.component";
import {ProductsDisplayComponent} from "../products-display/products-display.component";
import {ProductService} from "../../../services/product.service";
import {Subscription} from "rxjs";
import {ProductsPage} from "../../../models/product/productsPage";
import {NavbarComponent} from "../../common/navbar/navbar.component";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-search-product',
  standalone: true,
  imports: [
    ProductFinderComponent,
    ProductsDisplayComponent,
    NavbarComponent,
    NgClass
  ],
  templateUrl: './search-product.component.html',
  styleUrl: './search-product.component.css'
})
export class SearchProductComponent implements OnInit, OnDestroy {
  private productService: ProductService = inject(ProductService);
  private subs: Subscription = new Subscription();
  productsPage: ProductsPage = { products: [], page: 1, limit: 10, totalMatches: 0 } as ProductsPage;
  private lastSearch: SearchRequest = { productName: "", categoryId: undefined } as SearchRequest;

  ngOnInit(): void {
    this.onSearch({productName: "", categoryId: undefined});
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onPageChange(page: number) {
    this.searchProduct(this.lastSearch.productName, this.lastSearch.categoryId, page);
  }

  onSearch($event: SearchRequest) {
    this.lastSearch = $event;
   this.searchProduct($event.productName, $event.categoryId, undefined);
  }

  searchProduct(name: string, categoryId: number|undefined, page: number|undefined) {
    this.subs.add(
      this.productService.searchProduct(name, categoryId, page).subscribe(
        {
          next: (value: ProductsPage) => this.productsPage = value,
          error: err => console.error(err)
        }
      )
    );
  }
}
