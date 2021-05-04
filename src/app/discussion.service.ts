import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Comment } from './models';
import { Discussion } from './models/models';
import { UrlService } from './url.service';

@Injectable({
  providedIn: 'root'
})
export class DiscussionService {

  discussionBaseUrl: string = "";
  commentBaseUrl: string = "";

  constructor(private http: HttpClient, private urlService: UrlService) {
    this.discussionBaseUrl = urlService.ForumAPIUrl + "forum/discussion";
    this.commentBaseUrl = urlService.ForumAPIUrl + "forum/comment";
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

  getDiscussionsByIds(ids: string[]) {
    return this.http.post<Discussion[]>(this.discussionBaseUrl + '/reports', ids).toPromise();
  }

  getCommentsByIds(ids: string[]) {
    return this.http.post<Comment[]>(this.commentBaseUrl + '/reports', ids).toPromise();
  }
}
