import { environment } from './../environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlService {

  UserAPIUrl: string = "http://20.45.2.119/";
  ForumAPIUrl: string = "http://20.45.6.142/";
  MovieAPIUrl: string = "http://20.94.153.81/";
  AdminToolsAPIUrl: string = "http://20.189.29.112/";
  AuthenticationAPIUrl: string = "http://20.45.0.16/";
  FrontendUrl: string = "http://20.94.137.143/";
  RecommendationsAPIUrl: string = "http://20.189.28.203/";
  GroupsAPIUrl: string = "http://20.45.0.67/";
  ReviewsAPIUrl: string = "http://20.189.30.176/";

  constructor() {
    if (environment.production) {
      this.UserAPIUrl = "http://20.45.2.119/";
      this.ForumAPIUrl = "http://20.45.6.142/";
      this.MovieAPIUrl = "http://20.94.153.81/";
      this.AdminToolsAPIUrl = "http://20.189.29.112/";
      this.AuthenticationAPIUrl = "http://20.45.0.16/";
      this.FrontendUrl = "http://20.94.137.143/";
      this.RecommendationsAPIUrl = "http://20.189.28.203/";
      this.GroupsAPIUrl = "http://20.45.0.67/";
      this.ReviewsAPIUrl = "http://20.189.30.176/";
    } else {
      this.UserAPIUrl = "https://localhost:5001/";
      this.ForumAPIUrl = "https://localhost:5002/";
      this.MovieAPIUrl = "https://localhost:5003/";
      this.AdminToolsAPIUrl = "https://localhost:5004/";
      this.AuthenticationAPIUrl = "https://localhost:5005/";
      this.FrontendUrl = "http://localhost:4200/";
      this.RecommendationsAPIUrl = "https://localhost:5007/";
      this.GroupsAPIUrl = "https://localhost:5008/";
      this.ReviewsAPIUrl = "https://localhost:5009/";
    }
  }
}
