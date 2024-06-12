import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Category} from "../../../models/category/category";

@Component({
  selector: 'app-category-form-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './category-form-modal.component.html',
  styleUrl: './category-form-modal.component.css'
})
export class CategoryFormModalComponent implements OnInit {
  private fb: FormBuilder = inject(FormBuilder);
  activeModal: NgbActiveModal = inject(NgbActiveModal);
  @Input() title: string = "";
  @Input() initialData: Category | null = null;
  @Output() onFormSubmit: EventEmitter<FormData> = new EventEmitter<FormData>();

  categoryForm!: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;

  ngOnInit(): void {
    this.categoryForm = this.fb.group({
      name: [this.initialData ? this.initialData.name : "", Validators.required],
      icon: [null]
    });

    if(this.initialData) {
      if(this.initialData.icon) {
        this.imagePreview = this.initialData.icon;
      }
    }
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
        this.categoryForm.patchValue({
          icon: file
        });
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if(this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    const formData: FormData = new FormData();

    if(this.initialData) {
      formData.append('id', String(this.initialData.id));
    }

    formData.append('name', this.categoryForm.controls['name'].value);

    if(this.categoryForm.controls['icon'].value) {
      formData.append('icon', this.categoryForm.controls['icon'].value);
    }

    this.onFormSubmit.emit(formData);
  }
}
