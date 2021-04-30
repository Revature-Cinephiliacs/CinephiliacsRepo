import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { UrlService } from './url.service';
import { Observable } from 'rxjs';
import { Movie, PostReview } from './models'
import { Review } from './models'
import { PostDiscussion } from './models'
import { htmlPrefilter } from 'jquery';

@Injectable({
  providedIn: 'root'
})
export class MoviepageService {
  movieBaseURL: string = "";
  reviewBaseURL: string = "";
  forumBaseURL: string = "";

  constructor(private http: HttpClient, private urlService: UrlService) { 
    this.movieBaseURL = urlService.MovieAPIUrl + "movie/";
    this.reviewBaseURL = urlService.ReviewsAPIUrl + "review/";
    this.forumBaseURL = urlService.ForumAPIUrl + "forum/";
  }

  //Function that will call the Movie Microservice API movie/movieid end point
  //to return a movie's details
  getMovieDetails(movieid: string): Observable<Movie>
  {
    return this.http.get<Movie>( this.movieBaseURL + movieid);
  }

  //Function that will call the Movie Microservice API follow endpoint
  //that will get movies user is following
  getUserFollowingMovies(userid: string)
  {
    return this.http.get( this.movieBaseURL + "follow/" + userid);
  }

  //Function that will call the Movie Microservice API follow/movieid/userid endpoint
  //to add the movie to the user's movie following list
  addMovieToFollowing(movieid: string, userid: string)
  {
    return this.http.put( this.movieBaseURL + movieid + "/" + userid, null);
  }

  //Function will call the Forum Microservice API discussion/movieid endpoint
  //to return movie discussions
  getMovieDiscussion(moveid: string)
  {
    return this.http.get( this.forumBaseURL + "discussions/"+ moveid);
  }

  //Function will call the Forum Microservice to post a discussion to a 
  //given movie
  postDiscussion(discussion: PostDiscussion)
  {
    return this.http.post( this.forumBaseURL + "discussion", discussion);
  }

  //Function will call Forum Microservice topic endpoint to get a list of topics
  getTopics()
  {
    return this.http.get( this.forumBaseURL + "topics");
  }
}
