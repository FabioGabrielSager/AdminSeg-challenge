import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, catchError, map, Observable, of, tap} from "rxjs";
import {SuccessfulAuthResponse} from "../models/auth/successfulAuthResponse";
import {RegisterUserRequest} from "../models/auth/registerUserRequest";
import {UserDataDto} from "../models/user/userDataDto";
import {ChangePasswordRequest} from "../models/user/changePasswordRequest";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private httpClient: HttpClient = inject(HttpClient);
  private baseUrl = "http://localhost:8000/api";
  $currentUserLoginOn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  $currentUserLoginOnToken: BehaviorSubject<string> = new BehaviorSubject<string>("");
  $currentUserLoginOnRole: BehaviorSubject<string> = new BehaviorSubject<string>("");

  constructor() {
    this.$currentUserLoginOn = new BehaviorSubject<boolean>(sessionStorage.getItem("token") != null);
    this.$currentUserLoginOnToken = new BehaviorSubject<string>(sessionStorage.getItem("token") || "");
    this.$currentUserLoginOnRole = new BehaviorSubject<string>(sessionStorage.getItem("role") || "");
  }

  registerUser(request: RegisterUserRequest): Observable<SuccessfulAuthResponse> {
    return this.httpClient.post<SuccessfulAuthResponse>(this.baseUrl + "/user/register", request)
      .pipe(
        tap(authResponse => {
          sessionStorage.setItem('token', authResponse.token);
          sessionStorage.setItem('role', authResponse.roles[0]);
          this.$currentUserLoginOnToken.next(authResponse.token);
          this.$currentUserLoginOnRole.next(authResponse.roles[0]);
          this.$currentUserLoginOn.next(true);
        })
      );
  }

  login(username: string, password: string): Observable<SuccessfulAuthResponse> {
    const headers = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded"
    });
    const body = `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;

    return this.httpClient.post<SuccessfulAuthResponse>(
      this.baseUrl + "/secure/login_check",
      body,
      {headers}).pipe(
      tap(authResponse => {
        sessionStorage.setItem('token', authResponse.token);
        sessionStorage.setItem('role', authResponse.roles[0]);
        this.$currentUserLoginOnToken.next(authResponse.token);
        this.$currentUserLoginOnRole.next(authResponse.roles[0]);
        this.$currentUserLoginOn.next(true);
      })
    );
  }

  logout(): Observable<any> {
    return this.httpClient.post<any>(this.baseUrl + "/logout", {})
      .pipe(
        tap(authResponse => {
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('role');
          this.$currentUserLoginOn.next(false);
          this.$currentUserLoginOnToken.next("");
          this.$currentUserLoginOnRole.next("");
        })
      );
  }

  isAuthenticated(): Observable<boolean> {
    return this.httpClient.get<{ authenticated: boolean }>(this.baseUrl + "/secure/user/is-authenticated",
      {withCredentials: true})
      .pipe(
        map(value => value.authenticated),
        catchError((err) => of(false)),
        tap(value => {
          if(!value) {
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('role');
            this.$currentUserLoginOn.next(false);
            this.$currentUserLoginOnToken.next("");
            this.$currentUserLoginOnRole.next("");
          }
        })
      );
  }

  isAdmin(): Observable<boolean> {
    return this.httpClient.get<{ isAdmin: boolean }>(this.baseUrl + "/secure/user/is-admin",
      {withCredentials: true})
      .pipe(
        map(value => value.isAdmin),
        catchError(() => of(false)),
        tap(value => {
          if(!value) {
            sessionStorage.setItem("role", "ROLE_USER");
            this.$currentUserLoginOnRole.next("ROLE_USER");
          } else {
            sessionStorage.setItem("role", "ROLE_ADMIN");
            this.$currentUserLoginOnRole.next("ROLE_ADMIN");
          }
        })
      );
  }

  getCurrentUserData(): Observable<UserDataDto> {
    return this.httpClient.get<UserDataDto>(this.baseUrl + "/secure/user/");
  }

  modifyCurrentUser(modifiedUserData: UserDataDto) {
    return this.httpClient.patch<UserDataDto>(this.baseUrl + "/secure/user/modify", modifiedUserData);
  }

  changePassword(changePasswordRequest: ChangePasswordRequest) {
    return this.httpClient.patch<ChangePasswordRequest>(this.baseUrl + "/secure/user/password/change", changePasswordRequest);
  }

  deleteCurrentUserAccount() {
    return this.httpClient.delete(this.baseUrl + "/secure/user/delete")
      .pipe(
        tap(() => {
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('role');
          this.$currentUserLoginOn.next(false);
          this.$currentUserLoginOnToken.next("");
          this.$currentUserLoginOnRole.next("");
        })
      );
  }
}
