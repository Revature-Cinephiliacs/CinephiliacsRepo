import { Component, OnInit } from '@angular/core';
import { Review, Discussion, Comment, NewUser } from '../models';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';

import { HttpService } from '../http.service';
import { LoggerService } from '../logger.service';
import {UserService} from '../user.service'
import { MoviepageService} from '../moviepage.service';
import {ReviewService} from '../review.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  userName: string = "";

  moviesAreLoaded: boolean = false;
  reviewsAreLoaded: boolean = false;
  discussionsAreLoaded: boolean = false;
  commentsAreLoaded: boolean = false;

  authModel: NewUser;

  userMovieNames: string[] = [];
  userMovies: any[] = [];
  userReviews: Review[] = [];
  userDiscussions: Discussion[] = [];
  userComments: Comment[] = [];

  displaySpoilers: any = false;
  userID: string = '';
  constructor(
    private auth: AuthService,
    private _review: ReviewService,
    private _movie: MoviepageService,
    private logger: LoggerService,
    private router: ActivatedRoute, private _http: HttpService, private _user: UserService,) { }

  ngOnInit(): void {

    this.userName = this.router.snapshot.params.username;

    this.auth.authModel$.subscribe(reply => {
      this.logger.log("authmodel", reply);
      this.authModel = reply;
      this.userID = reply.userid;
    });

    this._movie.getUserFollowingMovies(this.userID).subscribe(data => {
      this.userMovieNames = data;
      console.log(data);
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



    this._user.getUserDiscussions(this.userID).subscribe(data => {
      if (data != null) {
        this.userDiscussions = data;
        
      }
      this.discussionsAreLoaded = true;
    });

    this._user.getUserComments(this.userID).subscribe(data => {
      if (data != null) {
        this.userComments = data;
      }
      this.commentsAreLoaded = true;
    });

    this._review.getUserReviews(this.userID).subscribe(data => {
      if (data != null) {
        this.userReviews = data;
      }
      this.reviewsAreLoaded = true;
    });
  }

  moviesLoaded() {
    this.moviesAreLoaded = true;
    this.logger.log("", "movies are loaded");
  }

  reviewsLoaded() {
    this.reviewsAreLoaded = true;
    this.logger.log("", "reviews are loaded");
  }

  discussionsLoaded() {
    this.discussionsAreLoaded = true;
    this.logger.log("", "discussionsAreLoaded");
  }

  commentsLoaded() {
    this.commentsAreLoaded = true;
    this.logger.log("", "commentsAreLoaded");
  }

  getUsername() {
    this.logger.log("", "username" + this.userName);
    return this.userName;
  }

  showSpoilers() {
    this.displaySpoilers = true;
    this.logger.log("", this.displaySpoilers);
  }

  spoilersShown() {
    return this.displaySpoilers;
  }

}
