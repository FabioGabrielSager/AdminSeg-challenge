export class RegisterUserRequest {
  private username = "";
  private email = "";
  private password: string = "";

  constructor(username: string, email: string, password: string) {
    this.username = username;
    this.email = email;
    this.password = password;
  }
}
