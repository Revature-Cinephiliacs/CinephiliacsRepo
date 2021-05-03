import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Comment, ReportedItem, ReportType } from './models';
import { UrlService } from './url.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  adminUrl: string = "";
  forumsUrl: string = "";
  reviewsUrl: string = "";

  constructor(private http: HttpClient, private urlService: UrlService) {
    this.adminUrl = urlService.AdminToolsAPIUrl;
    this.forumsUrl = urlService.ForumAPIUrl;
    this.reviewsUrl = urlService.ReviewsAPIUrl;
  }

  /**
   * Get all reports from admin tools
   * @returns 
   */
  getReports(): Promise<ReportedItem[]> {
    return this.http.get<ReportedItem[]>(this.adminUrl + "Tickets").toPromise();
  }

  /**
   * Report any item in a model of a ReportedItem
   * @param item 
   * @returns 
   */
  ReportItem(item: ReportedItem): Promise<any> {
    return this.http.post<any>(this.adminUrl + "Reports", item).toPromise();
  }

  /**
   * delete a comment
   * @param commentId 
   * @returns
   */
  deleteComment(commentId: string) {
    return this.http.delete<any>(this.forumsUrl + `forum/comment/${commentId}`).toPromise();
  }

  /**
   * delete a discussion
   * @param discussionId 
   * @returns 
   */
  deleteDiscussion(discussionId: string) {
    return this.http.delete<any>(this.forumsUrl + `forum/discussion/${discussionId}`).toPromise();
  }

  /**
   * delete a review
   * @param reviewId 
   * @returns 
   */
  deleteReview(reviewId: string) {
    return this.http.delete<any>(this.reviewsUrl + `Review/delete/${reviewId}`).toPromise();
  }

  /**
   * Transform the list of combined Reported Items
   * @param reportedItemsList 
   * @returns 
   */
  GetFromReportedItems(reportedItemsList: ReportedItem[]) {
    return {
      "comments": reportedItemsList.filter(item => { item.ReportEntityType == ReportType.Comment }),
      "discussions": reportedItemsList.filter(item => { item.ReportEntityType == ReportType.Discussion }),
      "reviews": reportedItemsList.filter(item => { item.ReportEntityType == ReportType.Review }),
    }
  }

}
