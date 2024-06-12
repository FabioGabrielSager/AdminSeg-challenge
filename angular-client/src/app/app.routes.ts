import {Routes} from '@angular/router';
import {LoginComponent} from "./components/user/login/login.component";
import {CreateAccountComponent} from "./components/user/create-account/create-account.component";
import {ProductsMenuComponent} from "./components/products/products-menu/products-menu.component";
import {MyProductsComponent} from "./components/products/my-products/my-products.component";
import {ProductFormComponent} from "./components/products/product-form/product-form.component";
import {MyProductDetailsComponent} from "./components/products/my-product-details/my-product-details.component";
import {authGuard} from "./guards/auth/auth.guard";
import {SearchProductComponent} from "./components/products/search-product/search-product.component";
import {CreateProductComponent} from "./components/products/create-product/create-product.component";
import {MyAccountDetailsComponent} from "./components/user/my-account-details/my-account-details.component";
import {CategoryListComponent} from "./components/categories/category-list/category-list.component";
import {isAdminGuard} from "./guards/auth/is-admin.guard";


export const routes: Routes = [
  { path: 'home', component: SearchProductComponent },
  { path: 'login', component: LoginComponent },
  { path: 'create/account', component: CreateAccountComponent },
  { path: 'myaccount', component: MyAccountDetailsComponent, canActivate: [authGuard] },
  {
    path: 'product',
    canActivate: [authGuard],
    children: [
      { path: 'menu', component: ProductsMenuComponent },
      { path: 'create', component: CreateProductComponent },
      { path: 'myproducts', canActivate: [authGuard],
        children: [
          {path: '', component: MyProductsComponent},
          {path: ':id', component: MyProductDetailsComponent}
        ]
      }
    ]
  },
  {
    path: 'category',
    canActivate: [authGuard, isAdminGuard],
    children: [
      { path: '', component: CategoryListComponent }
    ]
  },
  { path: '', redirectTo: 'home', pathMatch: 'full'}
];
