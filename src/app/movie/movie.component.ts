import { Component, Input, OnInit } from '@angular/core';
import { Route, ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../http.service';
import { LoggerService } from '../logger.service';
import { AuthService } from '../auth.service';
import { Movie, NewUser, PostDiscussion, PostReview, Review } from '../models/models';
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

  userId: string;
  username: string;
  userModel: any;

  relatedMovies: Movie[] = [];

  submitDiscussion: PostDiscussion = {
    movieid: this.router.snapshot.params.id,
    topic: "",
    userid: "",
    subject: ""
  }

  constructor(
    private logger: LoggerService,
    private router: ActivatedRoute, private _http: HttpService,
    private authService: AuthService,
    private movieService: MoviepageService,
    private routerer: Router,
    private reviewService: ReviewService) { }

  ngOnInit(): void {
    this.authService.authModel$.subscribe(reply => {
      this.userModel = reply;
    })

    this.logger.log("", this.router.snapshot.params);

    //will get the details of the movie from the IMDB API
    this.movieID = this.router.snapshot.params.id;

    this.movieService.getMovieDetails(this.movieID).subscribe(data => {
      this.selectedMovie = data;
      this.logger.log("Movie details", this.selectedMovie);
    });

    // Check if user is already following movie
    this.movieService.getUserFollowingMovie(this.movieID).subscribe((isFollowing: boolean) => {
      this.logger.log("Is Following", isFollowing);
      this.movieFollowed = isFollowing;
    });

    //Get related movies
    this.getRelatedMovies();

  }

  //Function for a user to follow a given movie
  followMovie() {
    if (this.userModel) {
      this.movieService.addMovieToFollowing(this.movieID).subscribe(data => {
        this.movieFollowed = true;
      });
    }
  }

  unfollowMovie() {
    if (this.userModel) {
      this.movieService.removeMovieFromFollowing(this.movieID, this.userId).subscribe(data => {
        this.movieFollowed = false;
      })
    }
  }

  //Get a list of related movies for the current movie displayed
  getRelatedMovies() {
    this.movieService.getRelatedMovies(this.movieID).subscribe(data => {
      this.logger.log("Get Related Movies", data);
      data.forEach(m => {
        if (m != null) {
          this.relatedMovies.push(m);
        }
      });
    });
  }

  //Redirects to movie component with a different movie id
  redirect(movieID: string) {
    this.movieID = movieID;
    //this.routerer.navigate(["/movie/" + this.movieID]);
    window.location.href = "/movie/" + this.movieID;
  }


}
