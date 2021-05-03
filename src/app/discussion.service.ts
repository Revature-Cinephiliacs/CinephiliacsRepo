import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Discussion } from './models/models';
import { UrlService } from './url.service';

@Injectable({
  providedIn: 'root'
})
export class DiscussionService {

  discussionBaseUrl: string = "";

  constructor(private http: HttpClient, private urlService: UrlService) {
    this.discussionBaseUrl = urlService.ForumAPIUrl + "forum/discussion";
  }

  getMovieDiscussions(movieId: string): Promise<Discussion[]> {
    return this.http.get<Discussion[]>(this.discussionBaseUrl + `s/${movieId}`).toPromise();
  }

  /**
   * Get sorted discussions by movieid and a page
   * @param movieId 
   * @param page 
   * @param sortingOrder 
   * @returns 
   */
  getDiscussionPage(movieId: String, page: number, sortingOrder: string) {
    return this.http.get(this.discussionBaseUrl + "discussions/" + movieId + "/" + page + "/" + sortingOrder);
  }
}
