import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {ProductFinderComponent, SearchRequest} from "../product-finder/product-finder.component";
import {ProductService} from "../../../services/product.service";
import {Subscription} from "rxjs";
import {ProductsPage} from "../../../models/product/productsPage";
import {ProductsDisplayComponent} from "../products-display/products-display.component";
import {ToastService} from "../../../services/toast.service";
import {Router} from "@angular/router";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {AlertComponent} from "../../common/alert/alert.component";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-my-product',
  standalone: true,
  imports: [
    ProductFinderComponent,
    ProductsDisplayComponent,
    NgClass
  ],
  templateUrl: './my-products.component.html',
  styleUrl: './my-products.component.css'
})
export class MyProductsComponent implements OnInit, OnDestroy {
  private router: Router = inject(Router);
  private productService: ProductService = inject(ProductService);
  private toastService: ToastService = inject(ToastService);
  private modalService: NgbModal = inject(NgbModal);
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
      this.productService.getCurrentUserProducts(name, categoryId, page).subscribe(
        {
          next: (value: ProductsPage) => this.productsPage = value,
          error: err => {
            this.toastService.show("Hubo un error al intentar recuperar los eventos.", "bg-danger")
            console.error(err);
          }
        }
      )
    );
  }

  onSeeProduct(productId: number) {
    this.router.navigate(["product", "myproducts", productId])
  }

  onDeleteProduct(productId: number) {
    const modal: NgbModalRef = this.modalService.open(AlertComponent, {centered: true, size: "sm"});
    modal.componentInstance.isAConfirm = true;
    modal.componentInstance.title = "Eliminar producto";
    modal.componentInstance.bodyString = {textParagraphs: ["Seguro que quieres eliminar este producto?"]};
    modal.componentInstance.confirmBehavior = () => {
      this.subs.add(
        this.productService.deleteProduct(productId).subscribe({
          next: () => {
            this.searchProduct(this.lastSearch.productName, this.lastSearch.categoryId, this.productsPage.page);
          },
          error: err => {
            this.toastService.show("Hubo un error al intentar eliminar el producto", "bg-danger");
            console.error(err);
          }
        })
      );
    }
  }
}
