import { Component, OnInit } from '@angular/core';
import { Review, Discussion, Comment, NewUser } from '../models/models';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from '../login.service';
import { HttpService } from '../http.service';
import { LoggerService } from '../logger.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  userName: string = "";
  user: NewUser = new NewUser();

  moviesAreLoaded: boolean = false;
  reviewsAreLoaded: boolean = false;
  discussionsAreLoaded: boolean = false;
  commentsAreLoaded: boolean = false;

  userMovieNames: string[] = [];
  userMovies: any[] = [];
  userReviews: Review[] = [];
  userDiscussions: Discussion[] = [];
  userComments: Comment[] = [];

  displaySpoilers: any = false;

  constructor(
    private logger: LoggerService,
    private router: ActivatedRoute,
    private _http: HttpService,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    // Get username from url
    // let userName = this.router.snapshot.params["username"];
    this.userName = this.router.snapshot.params.username;
    this.userService.getUserByUsername(this.userName).then(user => {
      this.user = user;
      this.getUserData();
    });

  }
  getUserData() {

    // Check if user follows any movies
    this.userService.getAUserFollowedMovies(this.user.userid).then(data => {
      this.userMovieNames = data;

      if (this.userMovieNames) {
        this.userMovieNames.forEach(movieName => {
          // Get the Movie information for each favorited movie, for the poster image.
          this._http.getMovie(movieName).subscribe(movieData => {
            this.userMovies.push(movieData);
          });
        });
      }
      this.moviesAreLoaded = true;
    });

    // Check if user has created any discussions
    this.userService.getAUserDiscussions(this.user.userid).then(data => {
      if (data != null) {
        this.userDiscussions = data;
      }
      this.discussionsAreLoaded = true;
    });

    // Check if user has created any comments
    this.userService.getAUserComments(this.user.userid).then(data => {
      if (data != null) {
        this.userComments = data;
      }
      this.commentsAreLoaded = true;
    });

    // Check if user has created any reviews
    this.userService.getAUserReviews(this.user.userid).then(data => {
      if (data != null) {
        this.userReviews = data;
      }
      this.reviewsAreLoaded = true;
    });
  }

  // Check if movies are loaded
  moviesLoaded() {
    this.moviesAreLoaded = true;
    this.logger.log("", "movies are loaded");
  }
  // Check if reviews are loaded
  reviewsLoaded() {
    this.reviewsAreLoaded = true;
    this.logger.log("", "reviews are loaded");
  }
  // Check if discussions are loaded
  discussionsLoaded() {
    this.discussionsAreLoaded = true;
    this.logger.log("", "discussionsAreLoaded");
  }
  // Check if comments are loaded
  commentsLoaded() {
    this.commentsAreLoaded = true;
    this.logger.log("", "commentsAreLoaded");
  }

  // Return username
  getUsername() {
    this.logger.log("", "username" + this.userName);
    return this.userName;
  }

  // Return if current user has displayed spoilers or not
  showSpoilers() {
    this.displaySpoilers = true;
    this.logger.log("", this.displaySpoilers);
  }

  // Check if current user has displayed spoilers or not
  spoilersShown() {
    return this.displaySpoilers;
  }

}
