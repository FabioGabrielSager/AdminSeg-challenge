import {Component, inject} from '@angular/core';
import {ProductFormComponent} from "../product-form/product-form.component";
import {Subscription} from "rxjs";
import {ProductService} from "../../../services/product.service";
import {Router} from "@angular/router";
import {ToastService} from "../../../services/toast.service";

@Component({
  selector: 'app-create-product',
  standalone: true,
    imports: [
        ProductFormComponent
    ],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.css'
})
export class CreateProductComponent {
  private productService: ProductService = inject(ProductService);
  private toastService: ToastService = inject(ToastService);
  private router: Router = inject(Router);
  private subs: Subscription = new Subscription();

  submitForm(formData: FormData) {
    this.subs.add(
      this.productService.createProduct(formData).subscribe(
        {
          next: value => {
            this.toastService.show("Producto registrado con éxito.", "bg-success");
            this.router.navigate(["product", "myproducts", value.id]);
          },
          error: err => {
            this.toastService.show("Hubo un error al intentar registrar el producto.", "bg-danger")
            console.error(err);
          }
        }
      )
    );
  }
}
