import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Comment, ReportedItem, ReportType, TicketItem } from './models/models';
import { UrlService } from './url.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  adminUrl: string = "";
  forumsUrl: string = "";
  reviewsUrl: string = "";
  userUrl: string = "";

  constructor(private http: HttpClient, private urlService: UrlService) {
    this.adminUrl = urlService.AdminToolsAPIUrl;
    this.forumsUrl = urlService.ForumAPIUrl;
    this.reviewsUrl = urlService.ReviewsAPIUrl;
    this.userUrl = urlService.UserAPIUrl;
  }

  /**
   * Get all reports from admin tools
   * @returns 
   */
  getReports() {
    return this.http.get<TicketItem[]>(this.adminUrl + "Tickets");
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



  addAdmin(userId) {
    this.http.post(this.userUrl + 'user/role/admin/' + userId, null).subscribe(reply => reply);
    console.log(userId + "Added to admin");
  }

  removeAdmin(userId) {
    this.http.delete(this.userUrl + 'user/role/admin/' + userId, null).subscribe(reply => reply);
  }

  archiveTicket(ticketId: string) {

    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.post(this.adminUrl + 'reports/archive/' + ticketId, "").toPromise();
  }



}
