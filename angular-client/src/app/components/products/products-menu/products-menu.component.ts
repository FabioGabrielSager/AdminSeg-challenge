import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-product-menu',
  standalone: true,
    imports: [
        RouterLink
    ],
  templateUrl: './products-menu.component.html',
  styleUrl: './products-menu.component.css'
})
export class ProductsMenuComponent {

}
