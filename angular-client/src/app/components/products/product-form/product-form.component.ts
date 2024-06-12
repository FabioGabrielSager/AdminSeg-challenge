import {Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {CategoryService} from "../../../services/category.service";
import {Subscription} from "rxjs";
import {Category} from "../../../models/category/category";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ProductService} from "../../../services/product.service";
import {error} from "@angular/compiler-cli/src/transformers/util";
import {Product} from "../../../models/product/product";

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})

export class ProductFormComponent implements OnInit, OnDestroy {
  private categoryService: CategoryService = inject(CategoryService);
  private productService: ProductService = inject(ProductService);
  private subs: Subscription = new Subscription();

  @Input() formTitle: string = "";
  @Input() submitButtonText: string = "";
  @Input() initialData: Product | null = null;
  @Output() onSubmitForm: EventEmitter<FormData> = new EventEmitter<FormData>();

  categories: Category[] = [];
  productForm!: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.productForm = this.fb.group({
      productName: [this.initialData ? this.initialData.name : "", Validators.required],
      productCategory: [this.initialData ? this.initialData.category.id : "", Validators.required],
      image: [null, Validators.required]
    });

    if(this.initialData) {
      if(this.initialData.image) {
        this.imagePreview = this.initialData.image;
        this.productForm.controls["image"].clearValidators();
        this.productForm.controls["image"].updateValueAndValidity();
      }
    }

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

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
        this.productForm.patchValue({
          image: file
        });
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if(this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const formData: FormData = new FormData();
    if(this.initialData) {
      formData.append('productId', String(this.initialData.id));
    }
    formData.append('productName', this.productForm.controls['productName'].value);
    formData.append('categoryId', this.productForm.controls['productCategory'].value);
    formData.append('image', this.productForm.controls['image'].value);

    this.onSubmitForm.emit(formData);
  }
}
