import { HttpClient } from '@angular/common/http';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../http.service';
import { LoggerService } from '../logger.service';
import { AuthService } from '../auth.service';
import { LoginService } from '../login.service';
import { Movie, NewUser, PostDiscussion, PostReview, Review } from '../models/models';
import { MoviepageService } from '../moviepage.service';
import { ReviewService } from '../review.service';

interface SubmiteReview {
  rating: number,
  movieid: string,
  username: string,
  text: string
}


@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.scss']
})
export class MovieComponent implements OnInit {

  reviewScoreSum: number = 0;
  reviewScore: number = 0;
  selectedMovie: Movie;
  movieID: string;
  discussions: any;
  reviews: Review[] = [];
  input: any;
  movieFollowed: boolean = false;

  reviewPage: number = 1;
  reviewSortOrder: string = "timedsc";

  timeSortState: number = 0;
  timeSortString: string = "Newest";
  ratingSortState: number = 0;
  ratingSortString: string = "Rating \u21D5";
  ratingActive: boolean = false;
  timeActive: boolean = true;
  reviewsBusy: boolean = false;
  lastPage: boolean = false;

  sumbitReview: PostReview = {
    imdbid: this.router.snapshot.params.id,
    usernameid: "0",
    score: 0,
    review: ""
  }

  submitDiscussion: PostDiscussion = {
    movieid: this.router.snapshot.params.id,
    topic: "",
    userid: "",
    subject: ""
  }

  topics: any;
  userId: string;
  username: string;
  authModel: NewUser;

  constructor(
    private logger: LoggerService,
    private router: ActivatedRoute, private _http: HttpService,
    private authService: AuthService,
    private movieService: MoviepageService,
    private reviewService: ReviewService) { }

  ngOnInit(): void {

    this.authService.authModel$.subscribe(reply => {
      this.logger.log("authmodel", reply);
      this.authModel = reply
      this.userId = reply.userid;
      this.username = reply.username;
      this.logger.log("this authmodel", this.authModel)
    });

    this.logger.log("", this.router.snapshot.params);
    this.inputFields();
    this.movieService.getMovieTags().subscribe(data => {
      this.logger.log("", data);
      this.topics = data;
    });

    //will get the details of the movie from the IMDB API
    this.movieID = this.router.snapshot.params.id;
    this.movieService.getMovieDetails(this.movieID).subscribe(data => {
      this.selectedMovie = data;
      console.log(this.selectedMovie);
      console.log("Movie Details");
      console.log(this.selectedMovie.plot);
      this.logger.log("", "this is getting movie details");
      this.logger.log("", this.selectedMovie);
    })

    //Will get the discussions for the movie
    this.showDiscussion();

    //Movie Reviews
    this.loadReviews(this.reviewPage);

    if (this.userId) {
      this.movieService.getUserFollowingMovies(this.userId).subscribe((usersMovieNames: string[]) => {
        console.log("get follow")
        console.log(usersMovieNames)
        if (typeof usersMovieNames.find(m => m == this.movieID) === 'undefined') {
          this.movieFollowed = false;
        }
        else {
          this.movieFollowed = true;
        }
      });
    }
    else {
      this.logger.log("", "user isn't set");
    }

    //saving a reference to the database of movies interacted with
    // this._login.postMovieId(this.movieID).subscribe(data => this.logger.log("", "submitted"));
  }

  //Function that will load reviews in page format for a given movie
  loadReviews(page: number) {
    console.log("Review")
    this.reviewService.getMovieReviewsPage(this.movieID, page, this.reviewSortOrder)
      .subscribe((data: Review[]) => {
        console.log("Review")
        console.log(data)
        if (data.length == 0) {
          this.lastPage = true;
          this.reviewPage = page - 1;
        }
        else {
          data.forEach((review: Review) => {
            this.logger.log("", review);
            this.reviews.push(review);
            this.reviewScoreSum += Number(review.score);
          });
          this.reviewScore = this.reviewScoreSum / this.reviews.length;
          this.logger.log("", this.reviewScore);
          this.reviewsBusy = false;
        }
      }, error => {
        this.lastPage = true;
        this.reviewPage = page - 1;
        this.reviewsBusy = false;
      });
  }

  //Function that will get the next page of reviews
  loadNextPage() {
    if (!this.lastPage && !this.reviewsBusy) {
      this.reviewsBusy = true;
      this.lastPage = true;
      this.reviewPage += 1;
      this.loadReviews(this.reviewPage);
    }
  }

  //Function that will sort reviews by oldest, newest
  timeSortNext() {
    if (!this.reviewsBusy) {
      this.reviewsBusy = true;
      switch (this.timeSortState) {
        case 0:
          this.timeSortState = 1;
          this.timeSortString = "Oldest";
          this.ratingSortState = 0;
          this.ratingSortString = "Rating \u21D5";
          this.changeReviewSortOrder("timeasc");
          break;
        case 1:
          this.timeSortState = 2;
          this.timeSortString = "Newest";
          this.ratingSortState = 0;
          this.ratingSortString = "Rating \u21D5";
          this.changeReviewSortOrder("timedsc");
          break;
        case 2:
          this.timeSortState = 1;
          this.timeSortString = "Oldest";
          this.ratingSortState = 0;
          this.ratingSortString = "Rating \u21D5";
          this.changeReviewSortOrder("timeasc");
          break;
      }
      this.ratingActive = false;
      this.timeActive = true;
    }
  }

  //Function that will sort reviews by ratings
  ratingSortNext() {
    if (!this.reviewsBusy) {
      this.reviewsBusy = true;
      switch (this.ratingSortState) {
        case 0:
          this.ratingSortState = 1;
          this.ratingSortString = "Rating \u21D1";
          this.timeSortState = 0;
          this.timeSortString = "Time \u21D5";
          this.changeReviewSortOrder("ratingasc");
          break;
        case 1:
          this.ratingSortState = 2;
          this.ratingSortString = "Rating \u21D3";
          this.timeSortState = 0;
          this.timeSortString = "Time \u21D5";
          this.changeReviewSortOrder("ratingdsc");
          break;
        case 2:
          this.ratingSortState = 1;
          this.ratingSortString = "Rating \u21D1";
          this.timeSortState = 0;
          this.timeSortString = "Time \u21D5";
          this.changeReviewSortOrder("ratingasc");
          break;
      }
      this.timeActive = false;
      this.ratingActive = true;
    }
  }

  //Function that will change the sort order of reviews
  changeReviewSortOrder(sortOrder: string) {
    if (sortOrder == "ratingasc" || sortOrder == "ratingdsc"
      || sortOrder == "timeasc" || sortOrder == "timedsc") {
      this.reviews = [];
      this.reviewScoreSum = 0;
      this.reviewSortOrder = sortOrder;
      this.reloadReviews(false);
    }
  }

  //Function that will reload reviews
  reloadReviews(loadNew: boolean) {
    if (loadNew) {
      this.reviews = [];
      this.reviewPage += 1;
    }
    for (let pageCounter: number = 1; pageCounter <= this.reviewPage; pageCounter++) {
      setTimeout(() => { this.loadReviews(pageCounter); }, 300 * pageCounter);
    }
  }

  //Function that will get a list of discussions for a given movie
  async showDiscussion() {
    setTimeout(() => {
      // this.movieService.getMovieDiscussion(this.movieID).subscribe(data => {
      //   console.log(data)
      //   this.logger.log("", data);
      //   this.discussions = data;
      // });
    }, 2000);
  }

  //Function for a user to follow a given movie
  followMovie() {
    if (this.userId) {
      this.movieService.addMovieToFollowing(this.movieID, this.userId).subscribe(data => {
        this.movieFollowed = true;
      });
    }
  }

  //Function for a user to post a discussion
  postDiscussion() {
    if (this.submitDiscussion.topic == "" || this.submitDiscussion.subject == "") {
      this.logger.log("", "didn't submit discussion");
    } else if (this.submitDiscussion.subject.length >= 250) {
      alert("Discussion should be less than 250 Characters")
    } else {

      // this.movieService.postDiscussion(this.submitDiscussion).subscribe(data => this.logger.log("", data));
      this.showDiscussion();
    }
    this.logger.log("", this.submitDiscussion);
  }

  postReview() {
    if (this.sumbitReview.score == 0 || this.sumbitReview.review == "") {
      this.logger.log("", "Review Not Sumbitted");
    } else if (this.sumbitReview.review.length >= 250) {
      alert("Reviews should be less than 250 Characters")
    } else {
      this.reviewService.postMovieReview(this.sumbitReview).subscribe(data => this.logger.log("", data));
      this.lastPage = false;
      this.reloadReviews(true);
    }
    this.logger.log("", this.sumbitReview);
  }

  inputFields() {
    if (localStorage.getItem("loggedin")) {
      this.logger.log("", "userset");
      // this.user = localStorage.getItem("loggedin")
      this.userId = "";
      // this.logger.log("", JSON.parse(this.user).username + "USER");
      // this.logger.log("", this.user);
      this.submitDiscussion.userid = this.userId;
      this.sumbitReview.usernameid = this.username;
      this.logger.log("", this.sumbitReview);

    } else {

      this.logger.log("", "no User");
    }
  }

}
