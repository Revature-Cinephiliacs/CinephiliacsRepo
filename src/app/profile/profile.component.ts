import { Component, Input, OnInit } from '@angular/core';
import { User, Review, Discussion, Comment, NewUser } from '../models';
import { LoginService } from '../login.service';
import { HttpService } from '../http.service';
import { LoggerService } from '../logger.service';
import { AuthService } from '../auth.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  currentUser: NewUser = new NewUser();
  editedUser: NewUser = new NewUser();

  userIsEditable: boolean = false;
  userIsUpdating: boolean = false;

  isNewUser: boolean = false;

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
    private userService: UserService,
    private auth: AuthService,
  ) { }

  isANewUser(user: NewUser) {
    if ((user == undefined || user == null) ||
      ((user.firstname == null ||
        user.firstname == null) &&
        (user.lastname == null ||
          user.lastname == null) &&
        (user.dateofbirth == null ||
          user.dateofbirth == null) &&
        (user.username == null ||
          user.username == null))
    ) return true;
    return false;
  }

  ngOnInit(): void {
    this.auth.authModel$.subscribe(reply => {
      this.logger.log("profile user", reply);
      if (this.isANewUser(reply)) {
        this.isNewUser = true;
        this.userIsEditable = true;
      }
      this.currentUser = reply;
      this.editedUser = reply;
    });
    //todo: change to current user calls
    this.userService.getAUserFollowedMovies(this.currentUser.userid).then(data => {
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

    this.userService.getAUserDiscussions(this.currentUser.username).then(data => {
      if (data != null) {
        this.userDiscussions = data;
      }
      this.discussionsAreLoaded = true;
    });

    this.userService.getAUserComments(this.currentUser.username).then(data => {
      if (data != null) {
        this.userComments = data;
      }
      this.commentsAreLoaded = true;
    });

    this.userService.getAUserReviews(this.currentUser.username).then(data => {
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
      //todo: update to new api calls
      if (this.isNewUser) {
        this.userService.createUser(this.editedUser).then(reply => {
          this.userService.getUser(this.currentUser.username).then(reply => {
            this.logger.log("new user", reply);
            this.currentUser = reply;
          }).catch(err => {
            this.logger.error("in getting getting new user", err);
          });
          this.userIsUpdating = false;
        }).catch(err => {
          this.logger.error("in creating a new user", err);
          this.userIsUpdating = false;
        });
      } else {
        this.userService.postUpdateUser(this.currentUser.username, this.editedUser).toPromise().then(response => {
          // Once the update request has processed, use an API call to get the updated user information
          this.userService.getUser(this.currentUser.username).then(reply => {
            this.logger.log("updated user", reply);
            this.currentUser = reply;
          }).catch(err => {
            this.logger.error("in getting getting updated user", err);
          });
          this.userIsUpdating = false;
        }).catch(err => {
          this.logger.error("in updating user", err);
          this.userIsUpdating = false;
        });
      }
    }
  }

  cancelUpdate(): void {
    this.editedUser.firstname = this.currentUser.firstname;
    this.editedUser.lastname = this.currentUser.lastname;
    this.editedUser.email = this.currentUser.email;
    this.editedUser.dateofbirth = this.currentUser.dateofbirth;
    this.userIsEditable = false;
  }

  editUser(): void {
    if (!this.userIsUpdating) {
      this.userIsEditable = true;
    }
  }

  authLogout() {
    this.auth.logout();
  }
}
