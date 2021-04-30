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

  getUser(userid: string): Promise<any> {
    return this.http.get(this.usersUrl + `/${userid}`).toPromise();
  }

  isAdmin(userid: string): Promise<any> {
    return this.http.get(this.usersUrl + `/isadmin`).toPromise();
  }

  postUpdateUser(username: string, updatedUser: User) {
    return this.http.post<User>(this.usersUrl + "user/update/" + username, updatedUser);
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

//---------------------Review API ------------------------
  postReview(sumbitReview: any) {
    return this.http.post(this.reviewsUrl + "movie/review", sumbitReview);
  }

  getUserReviews(userId: string) {
    return this.http.get<Review[]>(this.reviewsUrl + "reviews/ByUserId/" + userId);
  }

  //---------------------Forum API ------------------------
  getTopics() {
    return this.http.get(this.forumsUrl + "forum/topics");
  }

  getUserDiscussions(userId: string) {
    return this.http.get<Discussion[]>(this.forumsUrl + "forum/discussions/" + userId);
  }

  getUserComments(userId: string) {
    return this.http.get<Comment[]>(this.forumsUrl + "forum/comments/" + userId);
  }

  postComment(newComment: any) {
    return this.http.post(this.forumsUrl + "forum/comment", newComment);
  }

  submitDiscussion(discussion: any) {
    return this.http.post(this.forumsUrl + "forum/discussion", discussion);
  }


  //---------------------MOVIE API ------------------------
  followMovie(follower: string, follMovie: string) {
    return this.http.put(this.movieUrl + "movie/follow" + follMovie + "/"  + follower, null);
  }

  getUserMovies(userId: string) {
    return this.http.get<string[]>(this.movieUrl + "movie/follow/" + userId);
  }

  postMovieId(movieID: string) {
    return this.http.post(this.movieUrl + "movie/" + movieID, null);
  }

  getReviews(movieId: String) {
    return this.http.get(this.movieUrl + "movie/reviews/" + movieId);
  }

  getReviewsPage(movieId: String, page: number, sortOrder: string) {
    return this.http.get<Review[]>(this.movieUrl + "movie/reviews/" + movieId + "/" + page + "/" + sortOrder);
  }

}
