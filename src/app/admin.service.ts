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

  getReports(): Promise<ReportedItem> {
    return this.http.get<ReportedItem>(this.adminUrl + "Tickets").toPromise();
  }

  ReportItem(item: ReportedItem): Promise<any> {
    return this.http.post<any>(this.adminUrl + "Reports", item).toPromise();
  }

  deleteComment(commentId: string) {
    return this.http.delete<any>(this.forumsUrl + `forum/comment/${commentId}`).toPromise();
  }

  deleteDiscussion(discussionId: string) {
    return this.http.delete<any>(this.forumsUrl + `forum/discussion/${discussionId}`).toPromise();
  }

  deleteReview(reviewId: string) {
    return this.http.delete<any>(this.reviewsUrl + `Review/delete/${reviewId}`).toPromise();
  }

  GetFromReportedItems(reportedItemsList: ReportedItem[]) {
    return {
      "comments": reportedItemsList.filter(item => { item.ReportEntityType == ReportType.Comment }),
      "discussions": reportedItemsList.filter(item => { item.ReportEntityType == ReportType.Discussion }),
      "reviews": reportedItemsList.filter(item => { item.ReportEntityType == ReportType.Review }),
    }
  }

}
