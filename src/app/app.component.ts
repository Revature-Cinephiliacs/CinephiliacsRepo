import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { CustomError, ErrorService } from './error.service';
import { LoggerService } from './logger.service';
import { NewUser } from './models/models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'my-app';
  test: string = '';

  headerSearch!: FormGroup;

  // use this to know who the user is
  authModel: NewUser;
  // use this to determine if user is an admin
  isUserAdmin: boolean;
  // use this to determine if user is logged in

  constructor(public auth: AuthService,
    public errService: ErrorService,
    private logger: LoggerService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    // Initialize search in header
    this.headerSearch = new FormGroup({
      headSearch: new FormControl('', Validators.minLength(2))
    });
    // Initialize user profile link in header
    this.auth.userProfile$.subscribe(reply => {
      this.logger.log("userprofile", reply);
    });
    // Initialize admin link in header
    this.auth.authModel$.subscribe(reply => {
      this.logger.log("authmodel", reply);
      this.authModel = reply;
    });
    // Check if user is admin
    this.auth.isAdmin$.subscribe(reply => {
      this.logger.log("is admin", reply);
      this.isUserAdmin = reply;
    });
  }

  // Reaload the page
  // reloadPage() {
  //   this.logger.log("reloading", "");
  //   window.location.reload();
  // }

  // If a user submits a search term in the header, go to the search page
  onSubmit() {
    if (this.headerSearch.get('headSearch')!.value != "") {
      let searchParam = JSON.stringify(this.headerSearch.get('headSearch')!.value).substring(1, JSON.stringify(this.headerSearch.get('headSearch')!.value).length - 1);
      this.router.navigate(["/list/" + searchParam + "/1"]);
    }
  }

  // Test login
  testLogin() {
    this.auth.login();
  }

  // Test logout
  testLogout() {
    this.auth.logout();
  }

  // Test code
  testCode(num: Number) {
    return num;
  }
}
