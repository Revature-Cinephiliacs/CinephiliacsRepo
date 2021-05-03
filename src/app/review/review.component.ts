import { Component, Input, OnInit } from '@angular/core';
import { Moment } from "moment";
import { LoggerService } from '../logger.service';
import { ReviewService } from '../review.service';
import { HttpService } from '../http.service';
import { AuthService} from '../auth.service';
import { Movie, NewUser, PostDiscussion, PostReview, ReportedItem, ReportType, Review } from '../models/models';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../admin.service';
import * as moment from 'moment';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {
  @Input() movieid: string;
  
  reviews: Review[] = [];
  allReviews: Review[] = [];
  filteredReviews: Review[] = [];
  reviewPage: number = 1;
  reviewSortOrder: string = "timedsc";
  reviewMessage = "This movie has not been reviewed";
  submitReviewStatus = false;
  submitReviewMessage = "Review not submitted";

  timeSortState: number = 0;
  timeSortString: string = "Newest";
  ratingSortState: number = 0;
  ratingSortString: string = "Rating \u21D5";
  ratingActive: boolean = false;
  timeActive: boolean = true;
  reviewsBusy: boolean = false;
  lastPage: boolean = false;
  reviewScoreSum: number = 0;
  reviewScore: number = 0;

  userId: string;
  username: string;
  authModel: NewUser;

  selectedFilter: string;
  filters: string[] =[
    "Show All",
    "1 Star",
    "2 Stars",
    "3 Stars",
    "4 Stars",
    "5 Stars"
  ]

  sumbitReview: PostReview = {
    imdbid: "",
    usernameid: "0",
    score: 0,
    review: ""
  }

  constructor(
    private logger: LoggerService,
    private router: ActivatedRoute, private _http: HttpService,
    private authService: AuthService,
    private reviewService: ReviewService,
    private adminToolService: AdminService
  ) { }

  ngOnInit(): void {
    this.authService.authModel$.subscribe(reply => {
      this.logger.log("authmodel", reply);
      this.authModel = reply;
      this.logger.log("this review authmodel", this.authModel)
    });
    this.loadReviews(this.reviewPage);
  }

  //Function that will get a page of movie reviews
  loadReviews(page: number)
  {
    this.reviewService.getMovieReviewsPage(this.movieid, page, this.reviewSortOrder)
      .subscribe((data: Review[]) => {
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

  //filter ratings
  filterByRating(ratingOption:string)
  {
    console.log(ratingOption);
    switch(ratingOption) {
      case "1 Star": {
        console.log("Filter 1 star reviews");
        this.getMovieScoreReviews(1);
        break;
      }
      case "2 Stars": {
        console.log("Filter 2 star reviews");
        this.getMovieScoreReviews(2);
        break;
      }
      case "3 Stars": {
        console.log("Filter 3 star reviews");
        this.getMovieScoreReviews(3);
        break;
      }
      case "4 Stars": {
        console.log("Filter 4 star reviews");
        this.getMovieScoreReviews(4);
        break;
      }
      case "5 Stars": {
        console.log("Filter 5 star reviews");
        this.getMovieScoreReviews(5);
        break;
      }
      case "Show All": {
        console.log("Show All reviews");
        this.reviewPage = 1;
        this.loadReviews(this.reviewPage);
        break;
      }
    }
  }

  //Go through reviews to filter based on a given rating
  getMovieScoreReviews(rating: number)
  {
    this.reviews = [];
    this.reviewService.getMovieScoreReview(this.movieid, rating)
      .subscribe((data: Review[]) =>
      {
        console.log("Get score reviews")
        console.log(data)
        if(data != null)
        {
          this.reviews = data;
          
        }
      }), error => {
        console.log("error")
        this.reviewMessage = "No reviews matching that rating";
      };
  }

  //Flag a review
  flagReview(review: Review)
  {
    let reportItem: ReportedItem = {
      ReportEntityType: ReportType.Review,
      ReportDescription: "Flagged Review",
      ReportEnitityId: this.userId,
      ReportTime: moment(),
      Item: review
    }

    this.adminToolService.ReportItem(reportItem).then(data => {
      console.log(data)
    })
  }

  //Function to post a movie review
  postReview() {
    // if (this.sumbitReview.score == 0 || this.sumbitReview.review == "") {
    //   this.logger.log("", "Review Not Sumbitted");
    // } else if (this.sumbitReview.review.length >= 250) {
    //   alert("Reviews should be less than 250 Characters")
    // } else {
    //   this.reviewService.postMovieReview(this.sumbitReview).subscribe(data => this.logger.log("", data));
    //   this.lastPage = false;
    //   this.reloadReviews(true);
    // }
    // this.logger.log("", this.sumbitReview);
    console.log(this.authModel.username)
  }
}
