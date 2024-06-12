import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {passwordMatchValidator} from "../../../validators/passwordMatchValidator";
import {UserService} from "../../../services/user.service";
import {Subscription} from "rxjs";
import {RegisterUserRequest} from "../../../models/auth/registerUserRequest";
import {Router} from "@angular/router";
import {ToastService} from "../../../services/toast.service";
import {NavbarComponent} from "../../common/navbar/navbar.component";

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NavbarComponent
  ],
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.css'
})
export class CreateAccountComponent implements OnInit, OnDestroy {
  private toastService: ToastService = inject(ToastService);
  private userService: UserService = inject(UserService);
  private router: Router = inject(Router);
  private sub: Subscription = new Subscription();
  userForm: FormGroup;
  isUsernamePicked: boolean = false;
  isEmailPicked: boolean = false;

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, {validators: passwordMatchValidator});
  }

  ngOnInit(): void {
        this.sub.add(
          this.userForm.controls['username'].valueChanges.subscribe(
            () => {
              if(this.isUsernamePicked) {
                this.isUsernamePicked = false;
              }
            }
          )
        );
        this.sub.add(
          this.userForm.controls['email'].valueChanges.subscribe(
            () => {
              if(this.isEmailPicked) {
                this.isEmailPicked = false;
              }
            }
          )
        );
    }

  ngOnDestroy(): void {
        this.sub.unsubscribe();
  }

  onSubmit() {
    if(this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const registrationRequest = new RegisterUserRequest(
      this.userForm.controls['username'].value,
      this.userForm.controls['email'].value,
      this.userForm.controls['password'].value,
    );

    this.sub.add(this.userService.registerUser(registrationRequest).subscribe({
      next: () => this.router.navigate(["home"]),
      error: err => {
        if(err.status === 400) {
          if(String(err.error.error.message).includes("Username already exists")) {
            this.isUsernamePicked = true;
          }
          if(String(err.error.error.message).includes("Email already exists")) {
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
