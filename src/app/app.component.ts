import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { AuthService } from './auth.service';

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
  authModel: any;
  // use this to determine if user is an admin
  isUserAdmin: boolean;
  // use this to determine if user is logged in

  constructor(public auth: AuthService) { }

  ngOnInit(): void {
    this.headerSearch = new FormGroup({
      headSearch: new FormControl('', Validators.minLength(2))
    });
    this.auth.userProfile$.subscribe(reply => {
      console.log("user profile");
      console.log(reply);
      console.log("user profile");
    });
    this.auth.authModel$.subscribe(reply => {
      console.log("app component reply");
      console.log(reply);
      console.log("app component reply");
      this.authModel = reply;
    });
    this.auth.isAdmin$.subscribe(reply => {
      console.log("app component is admin?");
      console.log(reply);
      this.isUserAdmin = reply;
    });
  }

  reloadPage() {
    console.log("reload?");
    window.location.reload();
  }

  onSubmit() {
    if (this.headerSearch.get('headSearch')!.value != "") {
      let searchParam = JSON.stringify(this.headerSearch.get('headSearch')!.value).substring(1, JSON.stringify(this.headerSearch.get('headSearch')!.value).length - 1);
      window.location.href = "/list/" + searchParam + "/1";
    }
  }

  testLogin() {
    this.auth.login();
  }

  testLogout() {
    this.auth.logout();
  }

  testCode(num: Number) {
    return num;
  }
}
