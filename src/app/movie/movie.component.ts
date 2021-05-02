import { HttpClient } from '@angular/common/http';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../http.service';
import { LoggerService } from '../logger.service';
import { AuthService} from '../auth.service';
import { Movie, PostDiscussion, PostReview, Review } from '../models';
import { MoviepageService } from '../moviepage.service';
import { ReviewService } from '../review.service';

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

  userId: string;
  username: string;

  submitDiscussion: PostDiscussion = {
    movieid: this.router.snapshot.params.id,
    topic: "",
    userid: "",
    subject: ""
  }

  topics: any;
  

  constructor(
    private logger: LoggerService,
    private router: ActivatedRoute, private _http: HttpService,
    private authService: AuthService,
    private movieService: MoviepageService,
    private reviewService: ReviewService) { }

  ngOnInit(): void 
  {
    this.userId = localStorage.getItem("userid");
    this.username = localStorage.getItem("username");
    this.logger.log("", this.router.snapshot.params);
    //this.inputFields();
    this.movieService.getMovieTags().subscribe(data => {
      this.logger.log("", data);
      this.topics = data;
    });

    //will get the details of the movie from the IMDB API
    this.movieID = this.router.snapshot.params.id;
    this.movieService.getMovieDetails(this.movieID).subscribe(data => {
      this.selectedMovie = data;
      this.logger.log("", "this is getting movie details");
      this.logger.log("", this.selectedMovie);
    })

    //Will get the discussions for the movie
    this.showDiscussion();

    if (this.userId) {
      this.movieService.getUserFollowingMovies(this.userId).subscribe((usersMovieNames: string[]) => {
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
  }

  //Function that will get a list of discussions for a given movie (waiting for forum service)
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
      this.movieService.addMovieToFollowing( this.movieID, this.userId).subscribe(data => {
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

  // inputFields() {
  //   if (localStorage.getItem("loggedin")) {
  //     this.logger.log("", "userset");
  //     // this.user = localStorage.getItem("loggedin")
  //     this.userId = "";
  //     // this.logger.log("", JSON.parse(this.user).username + "USER");
  //     // this.logger.log("", this.user);
  //     this.submitDiscussion.userid = this.userId;
  //     this.sumbitReview.usernameid = this.username;
  //     this.logger.log("", this.sumbitReview);

  //   } else {

  //     this.logger.log("", "no User");
  //   }
  // }

}
