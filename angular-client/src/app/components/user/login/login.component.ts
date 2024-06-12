import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {UserService} from "../../../services/user.service";
import {Subscription} from "rxjs";
import {FormsModule} from "@angular/forms";
import {NavbarComponent} from "../../common/navbar/navbar.component";
import {SearchProductComponent} from "../../products/search-product/search-product.component";
import {ToastService} from "../../../services/toast.service";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    NavbarComponent,
    SearchProductComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnDestroy {
  private router: Router = inject(Router);
  private userService: UserService = inject(UserService);
  private toastService: ToastService = inject(ToastService);
  private sub: Subscription = new Subscription();

  username: string = "";
  password: string = "";

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  onLogin() {
    this.sub = this.userService.login(this.username, this.password).subscribe({
      next: () => this.router.navigate(["home"]),
      error: err => {
        if (err.status == 401) {
          this.toastService.show("Usuario y/o contraseña errónea", "bg-danger");
        } else {
          this.toastService.show("Hubo un error al intentar iniciar sesión", "bg-danger");
          console.error(err);
        }
      }
    })
  }
}
