import { Component, Input, OnInit } from '@angular/core';
import { User, Review, Discussion, Comment } from '../models';
import { LoginService } from '../login.service';
import { UserService } from '../user.service';
import { HttpService } from '../http.service';
import { LoggerService } from '../logger.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  @Input() currentUser: User = {
    username: '',
    firstname: '',
    lastname: '',
    email: '',
    permissions: 1
  }

  editedUser: User = {
    username: '',
    firstname: '',
    lastname: '',
    email: '',
    permissions: 1
  }

  userIsEditable: boolean = false;
  userIsUpdating: boolean = false;

  moviesAreLoaded: boolean = false;
  reviewsAreLoaded: boolean = false;
  discussionsAreLoaded: boolean = false;
  commentsAreLoaded: boolean = false;

  userMovieNames: string[] = [];
  userMovies: any[] = [];
  userReviews: Review[] = [];
  userDiscussions: Discussion[] = [];
  userComments: Comment[] = [];

  constructor(
    private logger: LoggerService,
    private _http: HttpService,
    private _login: LoginService,
     private _user: UserService) { }

  ngOnInit(): void {

    this.editedUser.username = this.currentUser.username;
    this.editedUser.firstname = this.currentUser.firstname;
    this.editedUser.lastname = this.currentUser.lastname;
    this.editedUser.email = this.currentUser.email;

    this._user.getUserMovies(this.currentUser.username).subscribe(data => {
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

    this._user.getUserDiscussions(this.currentUser.username).subscribe(data => {
      if (data != null) {
        this.userDiscussions = data;
      }
      this.discussionsAreLoaded = true;
    });

    this._user.getUserComments(this.currentUser.username).subscribe(data => {
      if (data != null) {
        this.userComments = data;
      }
      this.commentsAreLoaded = true;
    });

    this._user.getUserReviews(this.currentUser.username).subscribe(data => {
      if (data != null) {
        this.userReviews = data;
      }
      this.reviewsAreLoaded = true;
    });
  }

  moviesLoaded() {
    this.logger.log("", this.moviesAreLoaded);
    this.moviesAreLoaded = true;
    return this.moviesAreLoaded;
  }
  reviewsLoaded() {
    this.logger.log("", this.reviewsAreLoaded);
    this.reviewsAreLoaded = true;
    return this.reviewsAreLoaded;
  }
  dicussionsLoaded() {
    this.logger.log("", this.discussionsAreLoaded);
    this.discussionsAreLoaded = true;
    return this.discussionsAreLoaded
  }

  commentsLoaded() {
    this.logger.log("", this.commentsAreLoaded);
    this.commentsAreLoaded = true;
    return this.commentsAreLoaded;
  }


  updateUser(): void {
    if (this.userIsEditable) {
      this.userIsUpdating = true;
      this.userIsEditable = false;
      this._user.postUpdateUser(this.currentUser.username, this.editedUser).subscribe(response => {
        // Once the update request has processed, use an API call to get the updated user information
        this._login.loginUser(this.currentUser.username).subscribe((data: User) => {
          this.currentUser.firstname = data.firstname;
          this.currentUser.lastname = data.lastname;
          this.currentUser.email = data.email;
          localStorage.setItem("loggedin", JSON.stringify(this.currentUser));
        });
        this.userIsUpdating = false;
      });
    }
  }

  cancelUpdate(): void {
    this.editedUser.firstname = this.currentUser.firstname;
    this.editedUser.lastname = this.currentUser.lastname;
    this.editedUser.email = this.currentUser.email;
    this.userIsEditable = false;
  }

  editUser(): void {
    if (!this.userIsUpdating) {
      this.userIsEditable = true;
    }
  }
}
