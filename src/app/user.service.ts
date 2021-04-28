import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { AppComponent } from './app.component';
import { User, Review, Discussion, Comment } from './models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseURL: string = "http://20.45.2.119/user";

  constructor(private http: HttpClient) { }

  getUser(userid: string): Promise<any> {
    return this.http.get(this.baseURL + `/${userid}`).toPromise();
  }

  isAdmin(userid: string): Promise<any> {
    return this.http.get(this.baseURL + `/${userid}/isadmin`).toPromise();
  }


}
