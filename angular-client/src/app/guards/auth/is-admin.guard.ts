import {CanActivateFn, Router} from '@angular/router';
import {UserService} from "../../services/user.service";
import {inject} from "@angular/core";
import {map} from "rxjs";

export const isAdminGuard: CanActivateFn = (route, state) => {
  const userService: UserService = inject(UserService);
  const router: Router = inject(Router);

  return userService.isAdmin()
    .pipe(
      map(value => value ? true : router.parseUrl("/home")
      )
    );
};
