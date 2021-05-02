import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormControlName, FormGroup } from '@angular/forms';
import { AuthService } from '../auth.service';
import { LoggerService } from '../logger.service';
import { NewUser } from '../models';

@Component({
  selector: 'app-get-started-box',
  templateUrl: './get-started-box.component.html',
  styleUrls: ['./get-started-box.component.scss']
})
export class GetStartedBoxComponent implements OnInit {
  movieSearch: string;
  forumSearch!: FormGroup;
  currentUser: NewUser = undefined;
  isLoggedIn: boolean = false;

  constructor(public auth: AuthService,
    private logger: LoggerService,
  ) { }

  ngOnInit(): void {
    this.auth.authModel$.subscribe(reply => {
      this.logger.log("get started user", reply);
      this.currentUser = reply;
      this.isLoggedIn = this.auth.loggedIn;
    })
    this.forumSearch = new FormGroup({
      getStartedBoxSearch: new FormControl(),
    })
  }

  onSubmit() {
    if (this.forumSearch.get('getStartedBoxSearch')!.value != "") {
      let searchParam = JSON.stringify(
        this.forumSearch.get('getStartedBoxSearch')!.value
      ).substring(1, JSON.stringify(
        this.forumSearch.get('getStartedBoxSearch')!.value
      ).length - 1);
      window.location.href = "/list/" + searchParam + "/1";
    }
  }

  authLogin() {
    this.auth.login();
  }

}