import { Component, Input, OnInit } from '@angular/core';
import { User, Review, Discussion, Comment, NewUser, UserNotification, Movie } from '../models/models';
import { LoginService } from '../login.service';
import { HttpService } from '../http.service';
import { LoggerService } from '../logger.service';
import { AuthService } from '../auth.service';
import { UserService } from '../user.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ForumService } from '../forum.service';
import { ReviewService } from '../review.service';
import { DiscussionService } from '../discussion.service';
import { MoviepageService } from '../moviepage.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  currentUser: NewUser = new NewUser();
  editedUser: NewUser = new NewUser();

  // Checks for updating user info
  userIsEditable: boolean = false;
  userIsUpdating: boolean = false;

  isNewUser: boolean = false;

  moreRecMovies: boolean = false;

  // Check whether or not things are loading
  moviesAreLoaded: boolean = false;
  reviewsAreLoaded: boolean = false;
  followedDiscussionsAreLoaded: boolean = false;
  notificationsAreLoaded: boolean = false;
  discussionsAreLoaded: boolean = false;
  commentsAreLoaded: boolean = false;
  recommendationsAreLoaded: boolean = false;

  // Get user created elements
  userMovieNames: string[] = [];
  userMovies: any[] = [];
  userShownReviews: Review[] = [];
  userReviews: Review[] = [];
  user5Reviews: Review[] = [];
  userShownDiscussions: Discussion[] = [];
  userDiscussions: Discussion[] = [];
  user5Discussions: Discussion[] = [];
  userShownFollowedDiscussions: Discussion[] = [];
  userFollowedDiscussions: Discussion[] = [];
  user5FollowedDiscussions: Discussion[] = [];
  userShownComments: Comment[] = [];
  userComments: Comment[] = [];
  user5Comments: Comment[] = [];
  userShownNotifications: UserNotification[] = [];
  userNotifications: UserNotification[] = [];
  user5Notifications: UserNotification[] = [];
  userRecommendedMovies: Movie[];

  constructor(
    private logger: LoggerService,
    private _http: HttpService,
    private userService: UserService,
    private auth: AuthService,
    private discussionService: DiscussionService,
    private reviewService: ReviewService,
    private movieService: MoviepageService
  ) { }

  // Set up edited user info form
  newfirstNameControl: FormControl;
  newlastNameControl: FormControl;
  newusernameControl: FormControl;
  newdateofbirthControl: FormControl;

  createFormControls() {
    this.newfirstNameControl = new FormControl('', Validators.required);
    this.newlastNameControl = new FormControl('', Validators.required);
    this.newusernameControl = new FormControl('', Validators.required);
    this.newdateofbirthControl = new FormControl('', Validators.required);
  }

  newUserForm: FormGroup;

  createForm() {
    this.newUserForm = new FormGroup({
      newusernameControl: new FormControl('', Validators.required),
      newfirstNameControl: new FormControl('', Validators.required),
      newlastNameControl: new FormControl('', Validators.required),
      newdateofbirthControl: new FormControl('', Validators.required)
    });
  }

  // If a user is new, prompt them to enter their info
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
    // Check if a user is a new user
    this.auth.isANewUser$.subscribe(isnew => {
      if (isnew) {
        this.createForm();
        this.createFormControls();
        this.isNewUser = isnew;
        this.editedUser.permissions = 1;
        this.currentUser.permissions = 1;
      }
      this.logger.log("new user? ", this.isNewUser);
    });

    // Get user info
    this.auth.userProfile$.subscribe(reply => {
      this.logger.log("userProfile$ user", reply);
      if (reply != null || reply != undefined) {
        this.currentUser = new NewUser();
        this.currentUser.email = reply.email;
        this.currentUser.userid = reply.sub;
        this.editedUser = new NewUser();
        this.editedUser.email = reply.email;
        this.editedUser.userid = reply.sub;
        this.auth.authModel$.subscribe(reply => {
          if (reply == null)
            return;
          this.logger.log("authModel$ user", reply);
          this.currentUser = reply;
          this.editedUser = reply;
          if (this.isANewUser(reply)) {
            this.isNewUser = true;
            this.userIsEditable = true;
          } else {
            this.getAllUserData()
            this.currentUser = reply;
            this.editedUser = reply;
          }
          this.logger.log("is new user?", this.isNewUser);
        });
      }
    });
    //todo: change to current user calls
  }

  // Get info from the User API
  getAllUserData() {
    this.userService.getAUserFollowedMovies(this.currentUser.userid).then(data => {
      this.userMovieNames = data;
      // Check if a user follows any movies
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

    // Check if a user has added any discussions
    this.userService.getAUserDiscussions(this.currentUser.userid).then(data => {
      if (data != null) {
        this.logger.log("discussions user", data);
        this.userDiscussions = data;
        this.userShownDiscussions = this.userDiscussions.slice(0, 5);
        this.logger.log("current all discussions", this.userDiscussions);
      }
      this.discussionsAreLoaded = true;
    });

    // Check if a user has added any comments
    this.userService.getAUserComments(this.currentUser.userid).then(data => {
      if (data != null) {
        this.logger.log("comments user", data);
        this.userComments = data;
        this.userShownComments = this.userComments.slice(0, 5);
      }
      this.commentsAreLoaded = true;
    });

    // Check if a user has added any reviews
    this.userService.getAUserReviews(this.currentUser.userid).then(data => {
      if (data != null) {
        this.logger.log("reviews user", data);
        this.userReviews = data;
        this.userShownReviews = this.userReviews.slice(0, 5);
      }
      this.reviewsAreLoaded = true;
    });

    // Get all discussions followed by user
    this.userService.getAUserFollowedDiscussions(this.currentUser.userid).then(data => {
      if (data != null) {
        this.logger.log("followed discussions user", data);
        this.userFollowedDiscussions = data;
        this.userShownFollowedDiscussions = this.userFollowedDiscussions.slice(0, 5);
      }
      this.followedDiscussionsAreLoaded = true;
    });

    // service: c = comments (user, discussion), d = disuccsion (user, movie), r = review (user, movie)
    this.userService.getUserNotifications(this.currentUser.userid).then(notifs => {
      this.logger.log("notifications", notifs);
      let temp1 = {};
      let temp2 = {};
      let temp3 = {};
      if (notifs != null) {
        this.userNotifications = notifs;
        let commentNotifications = this.userNotifications.filter(n => n.fromService == 'c').map(n => n.otherId);
        this.discussionService.getCommentsByIds(commentNotifications).then(c => {
          this.logger.log("comments", c);
          if (c != null && c != undefined) {
            this.userNotifications.forEach(n => {
              temp1 = c.filter(c => c.commentid == n.otherId)[0];
              if (temp1 != null)
                n.item = temp1
            });
            this.userShownNotifications = this.userNotifications.slice(0, 5);
          }
          this.logger.log("new notifications", this.userNotifications);
        });
        let reviewNotifications = this.userNotifications.filter(n => n.fromService == 'r').map(n => n.otherId);
        this.reviewService.getReviewbyIds(reviewNotifications).then(r => {
          this.logger.log("reviews", r);
          if (r != null && r != undefined) {
            this.userNotifications.forEach(n => {
              temp2 = r.filter(r => r.reviewid == n.otherId)[0];
              if (temp2 != null)
                n.item = temp2;
            });
            this.userShownNotifications = this.userNotifications.slice(0, 5);
          }
          this.logger.log("new notifications", this.userNotifications);
        });
        let discussionNotifications = this.userNotifications.filter(n => n.fromService == 'd').map(n => n.otherId);
        this.discussionService.getDiscussionsByIds(discussionNotifications).then(d => {
          this.logger.log("discussions", d);
          if (d != null && d != undefined) {
            this.userNotifications.forEach(n => {
              temp3 = d.filter(d => d.discussionId == n.otherId)[0];
              if (temp3 != null)
                n.item = temp3;
            });
            this.userShownNotifications = this.userNotifications.slice(0, 5);
          }
          this.logger.log("new notifications", this.userNotifications);
        });
      }
      this.notificationsAreLoaded = true;
    });

    //get recommended movies 
    this.movieService.getUserRecommendedMovies().subscribe(data => {
      this.logger.log("Recommended Movies", data);
      this.userRecommendedMovies = data.slice(0, 4);
      if (data.length > 5) {
        this.moreRecMovies = true;
      }

      console.log(this.userRecommendedMovies)
      this.recommendationsAreLoaded = true;
    })
  }

  // Check whether or not movies are loaded
  moviesLoaded() {
    this.moviesAreLoaded = true;
    return this.moviesAreLoaded;
  }

  // Check whether or not reviews are loaded
  reviewsLoaded() {
    this.reviewsAreLoaded = true;
    return this.reviewsAreLoaded;
  }

  // Check whether or not discussions are loaded
  dicussionsLoaded() {
    this.discussionsAreLoaded = true;
    return this.discussionsAreLoaded
  }

  // Check whether or not comments are loaded
  commentsLoaded() {
    this.commentsAreLoaded = true;
    return this.commentsAreLoaded;
  }

  // Check whether or not recommended movies are loaded
  recsLoaded() {
    this.recommendationsAreLoaded = true;
    return this.recommendationsAreLoaded;
  }

  /**
   * Show more discussions
   */
  moreDiscussions: boolean = false;
  showMoreDiscussions() {
    this.moreDiscussions = !this.moreDiscussions;
    if (this.moreDiscussions) {
      this.userShownDiscussions = this.userDiscussions;
    }
    else {
      this.userShownDiscussions = this.userDiscussions.slice(0, 5);
    }
  }

  /**
   * false to not show buttons true to show them
   */
  showDiscussionsButtons(): boolean {
    return this.userDiscussions.length > 5;
  }

  /**
   * Show more Comments
   */
  moreComments: boolean = false;
  showMoreComments() {
    this.moreComments = !this.moreComments;
    if (this.moreComments) {
      this.userShownComments = this.userComments;
    }
    else {
      this.userShownComments = this.userComments.slice(0, 5);
    }
  }

  /**
   * false to not show buttons true to show them
   */
  showCommentsButtons(): boolean {
    return this.userComments.length > 5;
  }

  /**
   * Show more Reviews
   */
  moreReviews: boolean = false;
  showMoreReviews() {
    this.moreReviews = !this.moreReviews;
    if (this.moreReviews) {
      this.userShownReviews = this.userReviews;
    }
    else {
      this.userShownReviews = this.userReviews.slice(0, 5);
    }
  }

  /**
   * false to not show buttons true to show them
   */
  showReviewsButtons(): boolean {
    return this.userReviews.length > 5;
  }

  /**
   * Show more Notifications
   */
  moreNotifications: boolean = false;
  showMoreNotifications() {
    this.moreNotifications = !this.moreNotifications;
    if (this.moreNotifications) {
      this.userShownNotifications = this.userNotifications;
    }
    else {
      this.userShownNotifications = this.userNotifications.slice(0, 5);
    }
  }

  /**
   * false to not show buttons true to show them
   */
  showNotificationsButtons(): boolean {
    return this.userNotifications.length > 5;
  }

  /**
   * show more/less followed discussions
   */
  moreFollowedDiscussions: boolean = false;
  showMoreFollowedDiscussions() {
    this.moreFollowedDiscussions = !this.moreFollowedDiscussions;
    if (this.moreFollowedDiscussions) {
      this.userShownFollowedDiscussions = this.userFollowedDiscussions;
    }
    else {
      this.userShownFollowedDiscussions = this.userFollowedDiscussions.slice(0, 5);
    }
  }

  /**
   * false to not show buttons true to show them
   */
  showFollowedDiscussionButtons(): boolean {
    return this.userFollowedDiscussions.length > 5;
  }

  /**
   * Delete the notification
   * @param not 
   */
  deleteNotification(not: UserNotification) {
    this.userService.deleteNotification(not.notificationId).then(r => {
      this.logger.log("deleted?", r);
      this.userNotifications = this.userNotifications.filter(n => n.notificationId != not.notificationId);
      if (this.moreNotifications) {
        this.userShownNotifications = this.userNotifications;
      }
      else {
        this.userShownNotifications = this.userNotifications.slice(0, 5);
      }
    }).catch(err => {
      this.logger.log("error in deleting comment", err);
    });
  }

  deleteAllNotifications() {
    this.userService.deleteAllNotifications().then(r => {
      this.userNotifications = this.userNotifications.filter(n => false);
    });
  }

  /**
   * Update the user data
   * @param newuser 
   */
  updateUser(newuser: boolean = false): void {
    if (this.userIsEditable || newuser) {
      this.userIsUpdating = true;
      this.userIsEditable = false;
      this.logger.log("new user??/", newuser);
      this.logger.log("creating user", this.editedUser);
      if (newuser) {
        this.userService.createUser(this.editedUser).then(reply => {
          this.logger.log("new user reply", reply);
          this.userService.getUser().then(reply => {
            this.logger.log("new user", reply);
            this.currentUser = reply;
            this.isNewUser = false;
          }).catch(err => {
            this.logger.error("in getting getting new user", err);
          });
          this.userIsUpdating = false;
        }).catch(err => {
          this.logger.error("in creating a new user", err);
          this.userIsUpdating = false;
        });
      } else {
        this.logger.log("updating the user", this.editedUser);
        this.userService.postUpdateUser(this.currentUser.userid, this.editedUser).toPromise().then(response => {
          // Once the update request has processed, use an API call to get the updated user information
          this.userService.getUser().then(reply => {
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

  // Do not store new user info
  cancelUpdate(): void {
    this.editedUser.firstname = this.currentUser.firstname;
    this.editedUser.lastname = this.currentUser.lastname;
    this.editedUser.email = this.currentUser.email;
    this.editedUser.dateofbirth = this.currentUser.dateofbirth;
    this.userIsEditable = false;
  }

  // Check if the creator of a notification has been deleted
  isCreatorNull(not: UserNotification) {
    return not.creatorId == null;
  }

  // Allow user to edit info
  editUser(): void {
    if (!this.userIsUpdating) {
      this.userIsEditable = true;
    }
  }

  // Allow user to log out
  authLogout() {
    this.auth.logout();
  }

}
