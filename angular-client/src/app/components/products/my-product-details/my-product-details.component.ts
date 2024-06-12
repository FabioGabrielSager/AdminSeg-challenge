import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {ProductFormComponent} from "../product-form/product-form.component";
import {ActivatedRoute, Params} from "@angular/router";
import {Subscription} from "rxjs";
import {ProductService} from "../../../services/product.service";
import {Product} from "../../../models/product/product";
import {ToastService} from "../../../services/toast.service";

@Component({
  selector: 'app-my-product-details',
  standalone: true,
  imports: [
    ProductFormComponent
  ],
  templateUrl: './my-product-details.component.html',
  styleUrl: './my-product-details.component.css'
})
export class MyProductDetailsComponent implements OnInit, OnDestroy {
  private productService: ProductService = new ProductService();
  private toastService: ToastService = inject(ToastService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private subs: Subscription = new Subscription();

  productId: number = 0;
  product!: Product;
  isProductDataLoaded: boolean = false;

  ngOnInit(): void {
    this.subs.add(
      this.route.params.subscribe((params: Params) => this.productId = params["id"])
    );

    this.subs.add(
      this.productService.getProductDetails(this.productId).subscribe({
        next: value => {
          this.product = value;
          this.isProductDataLoaded = true;
        },
        error: err => {
          this.toastService.show("Hubo un error al intentar recuperar el producto.", "bg-danger");
          console.error(err);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onSubmitForm(formData: FormData) {
    this.subs.add(
      this.productService.modifyProduct(formData).subscribe({
        next: value => {
          this.product = value;
          this.toastService.show("Producto modificado con éxito", "bg-success");
        },
        error: err => {
          this.toastService.show("Hubo un error al intentar modificar el producto", "bg-error");
          console.error(err);
        }
      })
    );
  }
}
