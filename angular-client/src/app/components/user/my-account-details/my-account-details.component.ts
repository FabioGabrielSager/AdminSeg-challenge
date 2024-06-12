import {Component, inject, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ToastService} from "../../../services/toast.service";
import {UserService} from "../../../services/user.service";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";
import {UserDataDto} from "../../../models/user/userDataDto";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {AlertComponent} from "../../common/alert/alert.component";
import {passwordMatchValidator} from "../../../validators/passwordMatchValidator";
import {ChangePasswordFormComponent} from "../change-password-form/change-password-form.component";

@Component({
  selector: 'app-my-account-details',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './my-account-details.component.html',
  styleUrl: './my-account-details.component.css'
})
export class MyAccountDetailsComponent implements OnInit, OnDestroy {
  private toastService: ToastService = inject(ToastService);
  private modalService: NgbModal = inject(NgbModal);
  private userService: UserService = inject(UserService);
  private router: Router = inject(Router);
  private subs: Subscription = new Subscription();

  userForm: FormGroup;
  isUsernamePicked: boolean = false;
  isEmailPicked: boolean = false;

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      username: ["", Validators.required],
    });
  }

  ngOnInit(): void {
    this.subs.add(
      this.userService.getCurrentUserData().subscribe({
        next: value => {
          this.userForm.controls["email"].setValue(value.email);
          this.userForm.controls["username"].setValue(value.username);
        },
        error: err => {
          this.toastService.show("Hubo un error al intentar recuperar los datos del usuario",
            "bg-danger");
          console.error(err);
        }
      })
    );

    this.subs.add(
      this.userForm.controls['username'].valueChanges.subscribe(
        () => {
          if (this.isUsernamePicked) {
            this.isUsernamePicked = false;
          }
        }
      )
    );
    this.subs.add(
      this.userForm.controls['email'].valueChanges.subscribe(
        () => {
          if (this.isEmailPicked) {
            this.isEmailPicked = false;
          }
        }
      )
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onChangePassword() {
    this.modalService.open(ChangePasswordFormComponent, {centered: true, size: "lg"});
  }

  onDeleteAccount() {
    const modal: NgbModalRef = this.modalService.open(AlertComponent, {centered: true, size: "sm"});
    modal.componentInstance.isAConfirm = true;
    modal.componentInstance.title = "Eliminar cuenta";
    modal.componentInstance.bodyString = {textParagraphs: ["Seguro que quieres eliminar tu cuenta?"]};
    modal.componentInstance.confirmBehavior = () => {
      this.subs.add(
        this.userService.deleteCurrentUserAccount().subscribe({
          next: () => {
            this.toastService.show("Cuenta eliminada con éxito.", "bg-success");
            this.router.navigate(["home"]);
          },
          error: err => {
            this.toastService.show("Hubo un error al intentar eliminar la cuenta.", "bg-danger");
            console.error(err);
          }
        })
      );
    }
  }

  onModifyFormSubmit() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const modal: NgbModalRef = this.modalService.open(AlertComponent, {centered: true, size: "sm"});
    modal.componentInstance.isAConfirm = true;
    modal.componentInstance.title = "Modificar cuenta";
    modal.componentInstance.bodyString = {textParagraphs: [
      "Para guardar estos cambios deberás re-ingresar a la aplicación.", "¿Deseas continuar?"
      ]};
    modal.componentInstance.confirmBehavior = () => {
      const userModifiedData: UserDataDto = {
        email: this.userForm.controls["email"].value,
        username: this.userForm.controls["username"].value
      } as UserDataDto;

      this.subs.add(this.userService.modifyCurrentUser(userModifiedData).subscribe({
        next: () => {
          this.toastService.show("Cuenta modificada con éxito.", "bg-success");
          this.userService.logout();
          this.router.navigate(["/login"]);
        },
        error: err => {
          if (err.status === 400) {
            if (String(err.error.error.message).includes("Username already exists")) {
              this.isUsernamePicked = true;
            }
            if (String(err.error.error.message).includes("Email already exists")) {
              this.isEmailPicked = true;
            }
          } else {
            this.toastService.show("Hubo un error al intentar crear la cuenta.", "bg-danger")
          }
          console.error(err);
        }
      }));
    }
  }
}
