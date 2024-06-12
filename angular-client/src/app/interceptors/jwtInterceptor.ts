import {HttpInterceptorFn, HttpResponse} from '@angular/common/http';
import {tap} from "rxjs";
import {ToastService} from "../services/toast.service";
import {inject} from "@angular/core";
import {UserService} from "../services/user.service";

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const userService: UserService = inject(UserService);

  let token: string | null = userService.$currentUserLoginOnToken.value;

  if(token) {
    req = req.clone({headers: req.headers.append('Authorization', 'Bearer ' + token)})
  }

  return next(req);
};
