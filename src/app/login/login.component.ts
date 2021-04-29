import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LoggerService } from '../logger.service';
import { LoginService } from '../login.service';
import { User } from '../models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @Input() currentUser: User = {
    username: '',
    firstname: '',
    lastname: '',
    email: '',
    permissions: 1
  }
  @Output() currentUserChange = new EventEmitter<User>();

  userName: string = "";
  password: string = "";
  passwordNotOk: any = false;

  isLoginPage: boolean = true;

  newUser: any = {
    username: '',
    firstname: '',
    lastname: '',
    email: '',
    permissions: 1
  }

  constructor(
    private logger: LoggerService,
    private _login: LoginService) { }

  ngOnInit(): void {
  }

  login() {
    this.logger.log("", "Login attempt" + this.userName);
    this._login.loginUser(this.userName).subscribe((data: User) => {
      this.logger.log("", data);
      if (data.lastname == this.password) {
        this.passwordNotOk = false;
        this.currentUser = data;
      }
      else {
        this.passwordNotOk = true;
        setTimeout(() => {
          this.passwordNotOk = false;
        }, 3000);
      }
      this.logger.log("", this.currentUser.username);
      this.currentUserChange.emit(this.currentUser);
      localStorage.setItem("loggedin", JSON.stringify(this.currentUser));
      return data;
    });
  }

  createUser() {
    this.logger.log("", "In Create");
    if (!this.newUser.firstname || !this.newUser.lastname || !this.newUser.username || !this.newUser.email) {
      this.logger.log("", "Please fill in all data")
    }
    else {
      this.logger.log("", JSON.stringify(this.newUser));
      this._login.createUser(this.newUser).subscribe(data => {
        this.logger.log("", data);
        this.currentUser = this.newUser;
        this.userName = this.currentUser.username;
        this.password = this.currentUser.lastname;
        this.login();
      });
    }
  }

  getUserName() {
    this.logger.log("", this.userName);
    return this.userName;
  }


  isPasswordRigt(pass: string) {
    this.logger.log("", "Checking");
    return (pass == this.password);
  }

  switchToRegister(): void {
    this.isLoginPage = false;
  }

  backToLogin(): void {
    this.isLoginPage = true;
  }
}
