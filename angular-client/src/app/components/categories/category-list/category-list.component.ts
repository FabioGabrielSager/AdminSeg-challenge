import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {Category} from "../../../models/category/category";
import {CategoryService} from "../../../services/category.service";
import {Subscription} from "rxjs";
import {ToastService} from "../../../services/toast.service";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {AlertComponent} from "../../common/alert/alert.component";
import {CategoryFormModalComponent} from "../category-form-modal/category-form-modal.component";

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css'
})
export class CategoryListComponent implements OnInit, OnDestroy {
  private categoryService: CategoryService = inject(CategoryService);
  private toastService: ToastService = inject(ToastService);
  private modalService: NgbModal = inject(NgbModal);
  private subs: Subscription = new Subscription();
  categories: Category[] = [];

  ngOnInit(): void {
    this.loadCategories();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  loadCategories() {
    this.subs.add(
      this.categoryService.getAll().subscribe(
        {
          next: value => this.categories = value.categories,
          error: err => {
            this.toastService.show("Hubo un error al intentar recuperar las categorías.", "bg-danger");
            console.error(err);
          }
        }
      )
    );
  }

  onDeleteCategory(categoryId: number) {
    const modal: NgbModalRef = this.modalService.open(AlertComponent, {centered: true, size: "sm"});
    modal.componentInstance.isAConfirm = true;
    modal.componentInstance.title = "Eliminar categoría";
    modal.componentInstance.bodyString = {textParagraphs:
        [
          "Seguro que quieres eliminar esta categoría?",
          "¡Ten en cuenta que todos los productos asociada a ella también serán eliminados!"
        ]};
    modal.componentInstance.confirmBehavior = () => {
      this.subs.add(
        this.categoryService.deleteCategory(categoryId).subscribe({
          next: () => {
            this.loadCategories();
          },
          error: err => {
            this.toastService.show("Hubo un error al intentar eliminar la categoría", "bg-danger");
            console.error(err);
          }
        })
      );
    }
  }

  onModifyCategory(category: Category) {
    const modal: NgbModalRef = this.modalService.open(CategoryFormModalComponent, {centered: true, size: "lg"});
    modal.componentInstance.title = "Modificar categoría";
    modal.componentInstance.initialData = category;

    this.subs.add(
      modal.componentInstance.onFormSubmit.subscribe(
        (value: FormData) => {
          this.subs.add(
            this.categoryService.modifyCategory(value).subscribe({
              next: () => {
                this.toastService.show("Categoría modificada con éxito.", "bg-success");
                this.loadCategories();
                modal.dismiss();
              },
              error: err => {
                this.toastService.show("Hubo un error al intentar modificar la categoría", "bg-danger");
                console.error(err);
              }
            })
          );
        }
      )
    );
  }

  onAddCategory() {
    const modal: NgbModalRef = this.modalService.open(CategoryFormModalComponent, {centered: true, size: "lg"});
    modal.componentInstance.title = "Añadir categoría";

    this.subs.add(
      modal.componentInstance.onFormSubmit.subscribe(
        (value: FormData) => {
          this.subs.add(
            this.categoryService.createCategory(value).subscribe({
              next: (category: Category) => {
                this.toastService.show("Categoría añadida con éxito.", "bg-success");
                this.categories.push(category);
                modal.dismiss();
              },
              error: err => {
                this.toastService.show("Hubo un error al intentar añadir la categoría", "bg-danger");
                console.error(err);
              }
            })
          );
        }
      )
    );

  }
}
