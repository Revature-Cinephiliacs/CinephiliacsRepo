import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UrlService } from './url.service';
import { Movie, PostReview, TagVote } from './models/models';
import { Review } from './models/models';

@Injectable({
  providedIn: 'root'
})
export class MoviepageService {
  movieBaseURL: string = "";
  constructor(private http: HttpClient, private urlService: UrlService) {
    this.movieBaseURL = urlService.MovieAPIUrl + "movie";
    // this.movieBaseURL = "https://localhost:5003/movie";// for testing
  }

  //Function that will call the Movie Microservice API movie/movieid end point
  //to return a movie's details
  getMovieDetails(movieid: string): Observable<Movie>
  {
    return this.http.get<Movie>( this.movieBaseURL + "/" + movieid);
  }

  //Function that will call the Movie Microservice API follow endpoint
  //that will get movies user is following
  getUserFollowingMovies(userid: string)
  {
    return this.http.get( this.movieBaseURL + "/follow/" + userid);
  }

  // Function that calls the Movie Microservice API isFollowing endpoint
  // Checks if user is already following this movie
  getUserFollowingMovie(movieid: string)
  {
    return this.http.get( this.movieBaseURL + "/isfollowing/" + movieid);
  }

  //Function that will call the Movie Microservice API follow/movieid/userid endpoint
  //to add the movie to the user's movie following list
  addMovieToFollowing(movieid: string)
  {
    return this.http.put( this.movieBaseURL + "/follow/" +  movieid, null);
  }

  //Removes a movie from a following
  removeMovieFromFollowing(movieid: string, userid: string)
  {
    return this.http.delete (this.movieBaseURL + "/follow/" +  movieid);
  }

  //Function to update a given movie
  updateMovie(movieid: string, movie: Movie)
  {
    return this.http.put( this.movieBaseURL + "/" + movieid, movie);
  }

  //Append a given movie
  appendMovie(movieid: string, movie: Movie)
  {
    return this.http.patch( this.movieBaseURL + "/" + movieid, movie);
  }

  //Delete a movie
  deleteMovie(movieid: string)
  {
    return this.http.delete( this.movieBaseURL + "/" +  movieid);
  }

  //Search for a list of movies from given filter (create filter)
  searchMovies(filter: any)
  {
    return this.http.post( this.movieBaseURL + "/search", filter);
  }

  //create a movie
  createMovie(movie: Movie)
  {
    return this.http.post ( this.movieBaseURL, movie);
  }

  //add a vote for a movie tag (create tagging model)
  voteForTag(taggingDTO : TagVote)
  {
    return this.http.post ( this.movieBaseURL + "/tags", taggingDTO);
  }

  //Get all movie tags
  getMovieTags()
  {
    return this.http.get( this.movieBaseURL + "/tags");
  }

  //Bans a specified tag
  banMovieTag(tagname: string)
  {
    return this.http.put( this.movieBaseURL + "/tag/ban/" + tagname, null);
  }

  //Unbans a tag
  unbanMovieTage(tagname: string)
  {
    return this.http.delete ( this.movieBaseURL + "/tag/ban/" + tagname);
  }

  //Gets a list of Related Movies given a movie id
  getRelatedMovies(movieid: string):Observable<Movie[]>
  {
    return this.http.get<Movie[]> (this.movieBaseURL + "/recommended/" + movieid);
  }

  //Gets a list of user recommended movies
  getUserRecommendedMovies(): Observable<Movie[]>
  {
    return this.http.get<Movie[]> (this.movieBaseURL + "/recommendedByUserId");
  }

}
