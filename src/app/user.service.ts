import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { AppComponent } from './app.component';
import { User, Review, Discussion, Comment, NewUser, Movie } from './models';
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
  getUser(): Promise<any> {
    return this.http.get(this.usersUrl + `user/userinfo`).toPromise();
  }

  //Functio that call User MSA to get all users
  getAlUser() {
    return this.http.get<User[]>(this.usersUrl + "user/users")
  }

  //Function that call User MSA to check if user is admin or not
  isAdmin(userid: string): Promise<any> {
    return this.http.get(this.usersUrl + `user/isadmin`).toPromise();
  }

  //Function that call User MSA to updae user infromation.
  postUpdateUser(userid: string, updatedUser: NewUser) {
    return this.http.post<User>(this.usersUrl + "user/update/" + userid, updatedUser);
  }

  /**
   * Function that call User MSA to post/create new user
   * @param user 
   * @returns 
   */
  createUser(user: NewUser): Promise<NewUser> {
    return this.http.post<NewUser>(this.usersUrl + "user/", user).toPromise();
  }

  /**
   * Get the reviews for a user by userid
   * @param userid 
   * @returns 
   */
  getAUserReviews(userid: string): Promise<Review[]> {
    return this.http.get<Review[]>(this.reviewsUrl + "Review/ByUserId/" + userid).toPromise();
  }

  /**
   * Get discussions for a user by userid
   * @param userid 
   * @returns 
   */
  getAUserDiscussions(userid: string): Promise<Discussion[]> {
    return this.http.get<Discussion[]>(this.forumsUrl + "Forum/userdiscussion/" + userid).toPromise();
  }

  /**
   * Get comments for a user by userid
   * @param userid 
   * @returns 
   */
  getAUserComments(userid: string): Promise<Comment[]> {
    return this.http.get<Comment[]>(this.forumsUrl + "Forum/usercomments/" + userid).toPromise();
  }


  /**
   * Get comments for a user by userid
   * @param userid 
   * @returns 
   */
  getAUserFollowedMovies(userid: string): Promise<string[]> {
    return this.http.get<string[]>(this.movieUrl + "Movie/follow/" + userid).toPromise();
  }

  //Function to get user's age
  getUerAge(userId: string) {
    return this.http.get(this.usersUrl + "/user/age" + userId)
  }

  //Function to Add a new follower->followee relationship for a user
  followUser(follower: string, followee: string) {
    return this.http.post<User>(this.usersUrl + "user/" + follower + followee, null);
  }

  // Function to get list of all the users someone is following from their userid
  getFollowedUserList(userId: string) {
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
