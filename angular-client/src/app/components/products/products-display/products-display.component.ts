import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgbPagination, NgbPaginationNext, NgbPaginationPages, NgbPaginationPrevious} from "@ng-bootstrap/ng-bootstrap";
import {ProductsPage} from "../../../models/product/productsPage";

@Component({
  selector: 'app-product-display',
  standalone: true,
  imports: [
    NgbPagination,
    NgbPaginationPrevious,
    NgbPaginationPages,
    NgbPaginationNext
  ],
  templateUrl: './products-display.component.html',
  styleUrl: './products-display.component.css'
})
export class ProductsDisplayComponent {
  @Input() productsPage: ProductsPage = { products: [], page: 1, limit: 10, totalMatches: 0 } as ProductsPage;
  @Input() showSeeProductBtn: boolean = false;
  @Input() showDeleteProductBtn: boolean = false;
  @Output() onPageChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() onSeeProduct: EventEmitter<number> = new EventEmitter<number>();
  @Output() onDeleteProduct: EventEmitter<number> = new EventEmitter<number>();

  onSelectPreviousPage() {
    console.log(this.productsPage.page - 1)
    this.onPageChange.emit(this.productsPage.page - 1);
  }

  onSelectSpecificPage(p: number) {
    if(p != this.productsPage.page) {
      this.onPageChange.emit(p)
    }
  }

  onSelectNextPage() {
    console.log(this.productsPage.page + 1)
    this.onPageChange.emit(this.productsPage.page + 1);
  }

  onSeeProductClick(productId: number) {
    this.onSeeProduct.emit(productId);
  }

  onDeleteProductClick(productId: number) {
    this.onDeleteProduct.emit(productId);
  }
}
