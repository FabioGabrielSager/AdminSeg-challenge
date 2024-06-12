import {Component, inject, OnInit} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {NavbarComponent, NavBarItem} from "./components/common/navbar/navbar.component";
import {ToastContainerComponent} from "./components/common/toast-container/toast-container.component";
import {ProductFinderComponent} from "./components/products/product-finder/product-finder.component";
import {SearchProductComponent} from "./components/products/search-product/search-product.component";
import {UserService} from "./services/user.service";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {AlertComponent} from "./components/common/alert/alert.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, ToastContainerComponent, ProductFinderComponent, SearchProductComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'angular-client';
  navbarItems: NavBarItem[] = [];
  private userService: UserService = inject(UserService);
  private modalService: NgbModal = inject(NgbModal);
  private router: Router = inject(Router);

  constructor() {
    this.navbarItems = [
      {
        title: "Ingresar",
        routerLink: "/login",
        href: "",
        onClick: () => {
        },
      }
    ];
  }

  ngOnInit(): void {
    this.userService.$currentUserLoginOn.subscribe(value => {
      this.navbarItems = [];
      if(value) {
        if(this.userService.$currentUserLoginOnRole.value === "ROLE_ADMIN") {
          this.navbarItems = [
            {
              title: "Categorías",
              routerLink: "category",
              href: "",
              onClick: () => {
              },
            },
          ]
        }

        this.navbarItems.push(
          {
            title: "Cuenta",
            routerLink: "myaccount",
            href: "",
            onClick: () => {
            },
          },
          {
            title: "Productos",
            routerLink: "",
            href: "",
            onClick: () => {
              this.router.navigate(["product", "menu"]);
            },
          },
          {
            title: "Salir",
            routerLink: "",
            href: "",
            onClick: () => {
              const modal: NgbModalRef = this.modalService.open(AlertComponent, {centered: true, size: "sm"});
              modal.componentInstance.isAConfirm = true;
              modal.componentInstance.title = "Salir";
              modal.componentInstance.bodyString = {textParagraphs: ["Seguro que quieres salir?"]};
              modal.componentInstance.confirmBehavior = () => {
                this.userService.logout().subscribe(() => this.router.navigate(["/home"]))
              }
            },
          }
        );
      } else {
        this.navbarItems = [
          {
            title: "Ingresar",
            routerLink: "/login",
            href: "",
            onClick: () => {
            },
          }
        ];
      }
    });
  }
}
