import { Component } from '@angular/core';
import {NavbarComponent, NavBarItem} from "../common/navbar/navbar.component";
import {SearchProductComponent} from "../products/search-product/search-product.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NavbarComponent,
    SearchProductComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  navbarItems: NavBarItem[] = [];

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
}
