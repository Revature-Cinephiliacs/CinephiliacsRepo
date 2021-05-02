import { Injectable } from '@angular/core';
import { UrlService } from './url.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { User, Review, Discussion, Comment } from './models';

@Injectable({
  providedIn: 'root'
})
export class ForumService {
  
  forumsUrl: string = "";
  constructor(private http: HttpClient,
    private urlService: UrlService) {
    this.forumsUrl = urlService.ForumAPIUrl;
   }

  getDiscussion(movieId: String) {
    return this.http.get<Discussion[]>(this.forumsUrl + "forum/discussion/" + movieId);
  }

  //Function that will make a call to the Forum API discussions/movieid endpoint
  //to retrieve a list of discussions associated with given movie id
  getDiscussionPage(movieId: String, page: number, sortingOrder: string){
    return this.http.get<Discussion[]>( this.forumsUrl + "forum/discussions/"+movieId+"/"+page+"/"+sortingOrder);
  }

    //Function that will make a call to the Forum API discussion/discussionid endpoint
  //to retrieve a discussion with the given discussionid
  getCurrentDiscussion(discussionID: string){
    return this.http.get<Discussion>( this.forumsUrl + "forum/discussion/" + discussionID);
  }

  getTopics() {
    return this.http.get<string[]>(this.forumsUrl + "forum/topics");
  }

    //Function that will make a call to the Forum API endpoint to add a given topic to a given discussion
    addTopicToDiscussion(discussionid: string, topicid: string)
    {
      return this.http.post( this.forumsUrl + "forum/discussion/topic/" + discussionid + "/" + topicid, null);
    }

  //Function that will make a call to the Forum API endpoint to filter discussion by topic
  filterDiscussionByTopic(topicid: string){
    return this.http.get<Discussion[]>( this.forumsUrl + "discussions/topic/" + topicid);
  }

  getUserDiscussions(userId: string) {
    return this.http.get<Discussion[]>(this.forumsUrl + "forum/discussions/" + userId);
  }

  getUserComments(userId: string) {
    return this.http.get<Comment[]>(this.forumsUrl + "forum/comments/" + userId);
  }

  //Function that will make a call to the Forum API comments/discussionid endpoint
  //to retrieve a list of comments associated with given discussionid
  getDiscussionCommentsPage(discussionID:string, page: number, sortingOrder: string){
    return this.http.get<Comment[]>( this.forumsUrl + "forum/comments/" + discussionID+ "/" + page + "/" + sortingOrder);
  }

    //Function that will make a call to the Forum API comments/discussionid endpoint
  //to retrieve a list of comments associated with given discussionid
  getDiscussionComments(discussionID:string) {
    return this.http.get<Comment[]>( this.forumsUrl + "forum/comments/" + discussionID);
  }
  

  postComment(newComment: any) {
    return this.http.post(this.forumsUrl + "forum/comment", newComment);
  }

  submitDiscussion(discussion: any) {
    return this.http.post(this.forumsUrl + "forum/discussion", discussion);
  }
}
