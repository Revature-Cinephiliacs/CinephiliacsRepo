import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { LoggerService } from '../logger.service';
import { User } from '../models/models'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  currentUser: User = {
    username: '',
    firstname: '',
    lastname: '',
    email: '',
    permissions: 1
  }

  constructor(
    private logger: LoggerService,

  ) { }

  ngOnInit(): void {

    let userData = localStorage.getItem("loggedin");
    if (userData != null) {
      this.currentUser = JSON.parse(userData);
    }
  }

  getCurrentUser() {
    this.logger.log("", this.currentUser);
    return this.currentUser.username;
  }
  getName() {
    this.logger.log("", this.currentUser.firstname);
    return this.currentUser.firstname;
  }
  getEmail() {
    this.logger.log("", this.currentUser.email);
    return this.currentUser.email;
  }
  getPermissions() {
    this.logger.log("", this.currentUser.permissions);
    return this.currentUser.permissions;
  }

  logout() {
    this.currentUser.username = "";
    this.currentUser.firstname = "";
    this.currentUser.lastname = "";
    this.currentUser.email = "";
    localStorage.clear();
  }


}
