import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { AppComponent } from './app.component';
import { User, Review, Discussion, Comment } from './models';
import { LoggerService } from './logger.service';
import { UrlService } from './url.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // baseURL: string = "https://localhost:5001/user";
  baseURL: string = "";
  

  currentUser: string = "";
  askingUser: string = "";
  connection: string = "";

  constructor(private http: HttpClient,
    private logger: LoggerService,
    private urlService: UrlService) {
    this.baseURL = urlService.UserAPIUrl + "user";
  }

  getUser(userid: string): Promise<any> {
    return this.http.get(this.baseURL + `/${userid}`).toPromise();
  }

  isAdmin(userid: string): Promise<any> {
    return this.http.get(this.baseURL + `/isadmin`).toPromise();
  }

  getURL() {
    return this.baseURL;
  }

  getTopics() {
    return this.http.get(this.baseURL + "forum/topics");
  }


  getDiscussion(movieId: String) {
    return this.http.get(this.baseURL + "forum/discussions/" + movieId);
  }

  getReviews(movieId: String) {
    return this.http.get(this.baseURL + "movie/reviews/" + movieId);
  }

  getReviewsPage(movieId: String, page: number, sortOrder: string) {
    return this.http.get<Review[]>(this.baseURL + "movie/reviews/" + movieId + "/" + page + "/" + sortOrder);
  }

  submitDiscussion(discussion: any) {
    return this.http.post(this.baseURL + "forum/discussion", discussion);
  }

  postMovieId(movieID: string) {
    return this.http.post(this.baseURL + "movie/" + movieID, null);
  }

  postReview(sumbitReview: any) {
    return this.http.post(this.baseURL + "movie/review", sumbitReview);
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

  getUserReviews(username: string) {
    return this.http.get<Review[]>(this.baseURL + "user/reviews/" + username);
  }

  getUserDiscussions(username: string) {
    return this.http.get<Discussion[]>(this.baseURL + "user/discussions/" + username);
  }

  getUserMovies(username: string) {
    return this.http.get<string[]>(this.baseURL + "user/movies/" + username);
  }

  getUserComments(username: string) {
    return this.http.get<Comment[]>(this.baseURL + "user/comments/" + username);
  }

  postUpdateUser(username: string, updatedUser: User) {
    return this.http.post<User>(this.baseURL + "user/update/" + username, updatedUser);
  }

  postComment(newComment: any) {
    return this.http.post(this.baseURL + "Forum/comment", newComment);
  }
  
  followMovie(follower: string, follMovie: string) {
    return this.http.post(this.baseURL + "user/movie/" + follower + "/" + follMovie, null);
  }

}
