import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { UrlService } from './url.service';
import { Review } from './models';
import { PostReview } from './models';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  reviewBaseURL: string = "";
  constructor(private http: HttpClient, private urlService: UrlService) { 
    this.reviewBaseURL = urlService.ReviewsAPIUrl + "review/";
  }

  //Gets a list of reviews for a given userid
  getUserReviews(userid: string)
  {
    return this.http.get<Review[]>( this.reviewBaseURL + "ByUserId/" + userid);
  }
  //Function that will call the Review Microservice API review page endpoint
  //to get a page of reviews
  getMovieReviewsPage(movieId: String, page: number, sortOrder: string){
    return this.http.get<Review[]>( this.reviewBaseURL + movieId + "/" + page + "/" + sortOrder);
  }

  //Function that will call the Review Microservice API to add a review
  //to a given movie
  postReview(review: PostReview)
  {
    return this.http.post( this.reviewBaseURL + "reviewDto", review);
  }


}
