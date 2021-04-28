import { HttpClient } from '@angular/common/http';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../http.service';
import { LoggerService } from '../logger.service';
import { LoginService } from '../login.service';
import { Review } from '../models';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.scss']
})
export class MovieComponent implements OnInit {

  reviewScoreSum: number = 0;
  reviewScore: number = 0;
  selectedMovie: any;
  movieID: any;
  discussions: any;
  reviews: Review[] = [];
  input: any;
  user: any;
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

  sumbitReview: any = {
    rating: 0,
    movieid: this.router.snapshot.params.id,
    username: 0,
    text: ""
  }

  submitDiscussion: any = {
    movieid: this.router.snapshot.params.id,
    topic: "",
    username: "",
    subject: ""
  }

  topics: any;

  constructor(
    private logger: LoggerService,
    private router: ActivatedRoute, private _http: HttpService, private _login: LoginService) { }

  ngOnInit(): void {
    this.logger.log("", this.router.snapshot.params);
    this.inputFields();
    this._login.getTopics().subscribe(data => {
      this.logger.log("", data);
      this.topics = data;
    });

    //will get the details of the movie from the IMDB API
    this.movieID = this.router.snapshot.params.id;
    this._http.getMovie(this.movieID).subscribe(data => {
      this.selectedMovie = data;
      this.logger.log("", "this is movies now just so you know");
      this.logger.log("", this.selectedMovie);
    });

    //Will get the discussions for the movie
    this.showDiscussion();

    //Movie Reviews
    this.loadReviews(this.reviewPage);
    if (this.user) {
      this._login.getUserMovies(JSON.parse(this.user).username).subscribe((usersMovieNames: string[]) => {
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
    this._login.postMovieId(this.movieID).subscribe(data => this.logger.log("", "submitted"));
  }

  loadReviews(page: number) {
    this._login.getReviewsPage(this.movieID, page, this.reviewSortOrder)
      .subscribe((data: Review[]) => {
        if (data.length == 0) {
          this.lastPage = true;
          this.reviewPage = page - 1;
        }
        else {
          data.forEach((review: Review) => {
            this.logger.log("", review);
            this.reviews.push(review);
            this.reviewScoreSum += Number(review.rating);
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

  loadNextPage() {
    if (!this.lastPage && !this.reviewsBusy) {
      this.reviewsBusy = true;
      this.lastPage = true;
      this.reviewPage += 1;
      this.loadReviews(this.reviewPage);
    }
  }

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

  changeReviewSortOrder(sortOrder: string) {
    if (sortOrder == "ratingasc" || sortOrder == "ratingdsc"
      || sortOrder == "timeasc" || sortOrder == "timedsc") {
      this.reviews = [];
      this.reviewScoreSum = 0;
      this.reviewSortOrder = sortOrder;
      this.reloadReviews(false);
    }
  }

  reloadReviews(loadNew: boolean) {
    if (loadNew) {
      this.reviews = [];
      this.reviewPage += 1;
    }
    for (let pageCounter: number = 1; pageCounter <= this.reviewPage; pageCounter++) {
      setTimeout(() => { this.loadReviews(pageCounter); }, 300 * pageCounter);
    }
  }

  async showDiscussion() {
    setTimeout(() => {
      this._login.getDiscussion(this.movieID).subscribe(data => {
        this.logger.log("", data);
        this.discussions = data;
      });
    }, 2000);
  }

  followMovie() {
    if (this.user) {
      this._login.followMovie(JSON.parse(this.user).username, this.movieID).subscribe(data => {
        this.movieFollowed = true;
      });
    }
  }

  postDiscussion() {
    if (this.submitDiscussion.topic == "" || this.submitDiscussion.subject == "") {
      this.logger.log("", "didn't submit discussion");
    } else if (this.submitDiscussion.subject.length >= 250) {
      alert("Discussion should be less than 250 Characters")
    } else {

      this._login.submitDiscussion(this.submitDiscussion).subscribe(data => this.logger.log("", data));
      this.showDiscussion();
    }
    this.logger.log("", this.submitDiscussion);
  }

  postReview() {
    if (this.sumbitReview.rating == 0 || this.sumbitReview.text == "") {
      this.logger.log("", "Review Not Sumbitted");
    } else if (this.sumbitReview.text.length >= 250) {
      alert("Reviews should be less than 250 Characters")
    } else {
      this._login.postReview(this.sumbitReview).subscribe(data => this.logger.log("", data));
      this.lastPage = false;
      this.reloadReviews(true);
    }
    this.logger.log("", this.sumbitReview);
  }

  inputFields() {
    if (localStorage.getItem("loggedin")) {
      this.logger.log("", "userset");
      this.user = localStorage.getItem("loggedin")

      this.logger.log("", JSON.parse(this.user).username + "USER");
      this.logger.log("", this.user);
      this.submitDiscussion.username = JSON.parse(this.user).username;
      this.sumbitReview.username = JSON.parse(this.user).username;
      this.logger.log("", this.sumbitReview);

    } else {

      this.logger.log("", "no User");
    }
  }
}
