import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { AppComponent } from './app.component';
import { User, Review, Discussion, Comment } from './models';
import { UrlService } from './url.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // baseURL: string = "https://localhost:5001/user";
  baseURL: string = "";

  constructor(private http: HttpClient, private urlService: UrlService) {
    this.baseURL = urlService.UserAPIUrl + "user";
  }

  getUser(userid: string): Promise<any> {
    return this.http.get(this.baseURL + `/${userid}`).toPromise();
  }

  isAdmin(userid: string): Promise<any> {
    return this.http.get(this.baseURL + `/isadmin`).toPromise();
  }
}
