import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { LoggerService } from '../logger.service';
import { NewUser, User } from '../models/models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  currentUser: NewUser = new NewUser();

  constructor(
    private logger: LoggerService,
    public auth: AuthService,
  ) { }

  ngOnInit(): void {
    this.auth.authModel$.subscribe(reply => {
      this.logger.log("current user in home", reply);
      this.currentUser = reply;
    });
  }
}
