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
  // FrontendUrl: string = "http://20.94.137.143/";
  FrontendUrl: string = "https://cinephiliacsapp.azurewebsites.net/";
  RecommendationsAPIUrl: string = "http://20.189.28.203/";
  GroupsAPIUrl: string = "http://20.45.0.67/";
  ReviewsAPIUrl: string = "http://20.189.30.176/";

  constructor() { }
}
