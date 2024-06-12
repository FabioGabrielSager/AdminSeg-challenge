import {Component, inject, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {passwordMatchValidator} from "../../../validators/passwordMatchValidator";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {UserService} from "../../../services/user.service";
import {ChangePasswordRequest} from "../../../models/user/changePasswordRequest";
import {ToastService} from "../../../services/toast.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-change-password-form',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './change-password-form.component.html',
  styleUrl: './change-password-form.component.css'
})
export class ChangePasswordFormComponent implements OnDestroy {
  private userService: UserService = inject(UserService);
  private toastService: ToastService = inject(ToastService);
  private subs: Subscription = new Subscription();
  activeModal: NgbActiveModal = inject(NgbActiveModal);
  changePasswordForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.changePasswordForm = this.fb.group({
      oldPassword: ["", Validators.required],
      password: ["", Validators.required],
      confirmPassword: ["", Validators.required],
    }, {validators: passwordMatchValidator});
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onSubmit() {
    if (this.changePasswordForm.invalid) {
      this.changePasswordForm.markAllAsTouched();
      return;
    }

    const changePasswordRequest = new ChangePasswordRequest(
      this.changePasswordForm.controls["oldPassword"].value,
      this.changePasswordForm.controls["password"].value
    );

    this.subs.add(
      this.userService.changePassword(changePasswordRequest).subscribe({
        next: () => {
          this.toastService.show("Contraseña modificada con éxito", "bg-success");
          this.activeModal.dismiss();
        },
        error: err => {
          if(err.status === 401) {
            this.toastService.show("Contraseña incorrecta.", "bg-danger");
          } else {
            this.toastService.show("Hubo un error al intentar modificar la contraseña.", "bg-danger");
          }
          console.error(err);
        }
      })
    );
  }
}
