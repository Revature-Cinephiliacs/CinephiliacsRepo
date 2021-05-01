import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { AppComponent } from './app.component';
import { User, Review, Discussion, Comment } from './models/models';
import { LoggerService } from './logger.service';
import { UrlService } from './url.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  currentUser: string = "";
  askingUser: string = "";
  connection: string = "";

  usersUrl: string = "";
  movieUrl: string = "";
  forumsUrl: string = "";
  reviewsUrl: string = "";

  constructor(private http: HttpClient,
    private logger: LoggerService,
    private urlService: UrlService) {
    this.usersUrl = urlService.UserAPIUrl;
    this.movieUrl = urlService.MovieAPIUrl;
    this.forumsUrl = urlService.ForumAPIUrl;
    this.reviewsUrl = urlService.ReviewsAPIUrl;
  }

  //Funtion that call User MSA to get userinfo by sending userID
  getUser(userid: string): Promise<any> {
    return this.http.get(this.usersUrl + `/${userid}`).toPromise();
  }

  //Functio that call User MSA to get all users
  getAlUser(){
    return this.http.get<User[]>(this.usersUrl + "user/users")
  }

  //Function that call User MSA to check if user is admin or not
  isAdmin(userid: string): Promise<any> {
    return this.http.get(this.usersUrl + `user/isadmin`).toPromise();
  }

  //Function that call User MSA to updae user infromation.
  postUpdateUser(username: string, updatedUser: User) {
    return this.http.post<User>(this.usersUrl + "user/update/" + username, updatedUser);
  }

  // Function that call User MSA to post/creat new user
  postUser(user: User){
    return this.http.post<User>(this.usersUrl + "user/", user);
  }

  //Function to get user's age
  getUerAge(userId: string){
    return this.http.get(this.usersUrl + "/user/age" + userId)
  }

  //Function to Add a new follower->followee relationship for a user
  followUser(follower: string, followee: string){
    return this.http.post<User>(this.usersUrl + "user/" + follower + followee, null);
  }

  // Function to get list of all the users someone is following from their userid
  getFollowedUserList(userId: string){
    return this.http.get(this.usersUrl + "/user/followlist" + userId);
  }

  getURL() {
    return this.usersUrl;
  }

  getConnection() {
    this.logger.log("", this.connection);
    return this.connection;
  }

  getCurrentUser() {
    this.logger.log("", this.currentUser);
    return this.currentUser;
  }

  getAskingUser() {
    this.logger.log("", this.askingUser);
    return this.askingUser;
  }
}
