import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { UrlService } from './url.service';
import { Review } from './models/models';
import { PostReview } from './models/models';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  reviewBaseURL: string = "";

  constructor(private http: HttpClient, private urlService: UrlService) {
    this.reviewBaseURL = urlService.ReviewsAPIUrl + "review/";
  }

  getReviewbyIds(ids: string[]) {
    return this.http.post<Review[]>(this.reviewBaseURL + 'reportedReviews', ids).toPromise();
  }

  //Gets a list of reviews for a given userid
  getUserReviews(userid: string) {
    return this.http.get<Review[]>(this.reviewBaseURL + "ByUserId/" + userid);
  }

  //Get a list of all reviews for a movie id
  getAllMovieReviews(movieid: string) {
    return this.http.get<Review[]>(this.reviewBaseURL + movieid);
  }

  //Set the page size for reviews
  setReviewPageSize(pagesize: number) {
    return this.http.post(this.reviewBaseURL + "page/" + pagesize, null);
  }

  //Adds a new movie review to given movie
  postMovieReview(review: PostReview) {
    return this.http.post(this.reviewBaseURL + "reviewDto", review);
  }

  //Update user's review
  updateUserReview(reviewId: string, review: Review) {
    return this.http.patch(this.reviewBaseURL + "update/" + reviewId, review);
  }

  //Delete a review from a given movie
  deleteMovieReview(reviewId: string) {
    return this.http.delete(this.reviewBaseURL + "delete/" + reviewId);
  }

  //Will return a list of all the reviews based on score rating
  getScoreReview(score: string) {
    return this.http.get(this.reviewBaseURL + "/byRating/" + score);
  }

  //Will return a list of all reviews based on score rating for a given movie
  getMovieScoreReview(movieid: string, score: number) {
    return this.http.get("http://20.189.30.176/byRating/" + movieid + "/" + score);
  }

  //get a list of reported reviews
  getReportedReviews(idlist: string[]) {
    return this.http.post(this.reviewBaseURL + "reportedReviews", idlist);
  }

  //Function that will call the Review Microservice API review page endpoint
  //to get a page of reviews
  getMovieReviewsPage(movieId: String, page: number, sortOrder: string) {
    return this.http.get<Review[]>(this.reviewBaseURL + movieId + "/" + page + "/" + sortOrder);
  }
}
