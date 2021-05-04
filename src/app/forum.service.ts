import { Injectable } from '@angular/core';
import { UrlService } from './url.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { User, Review, Discussion, Comment, Topic, newDiscussion } from './models/models';

@Injectable({
  providedIn: 'root'
})
export class ForumService {
  
  forumsUrl: string = "https://localhost:5001/";
  constructor(private http: HttpClient,
    private urlService: UrlService) {
    this.forumsUrl = urlService.ForumAPIUrl;
   }

  getDiscussion(movieId: String) {
    return this.http.get<Discussion[]>(this.forumsUrl + "forum/discussions/" + movieId);
  }

  //Function that will make a call to the Forum API discussions/movieid endpoint
  //to retrieve a list of discussions associated with given movie id
  getDiscussionPage(movieId: String, page: number, sortingOrder: string){
    console.log(sortingOrder)
    return this.http.get<Discussion[]>( this.forumsUrl + "forum/discussions/"+movieId+"/"+page+"/"+sortingOrder);
  }

    //Function that will make a call to the Forum API discussion/discussionid endpoint
  //to retrieve a discussion with the given discussionid
  getCurrentDiscussion(discussionID: string){
    return this.http.get<Discussion>( this.forumsUrl + "forum/discussion/" + discussionID);
  }

  //Function that will modify comment like comment/like/{commentid}/{userid}
  addLike(commentid: string, userid:string){
    return this.http.post( this.forumsUrl + "forum/comment/like/" + commentid + "/" + userid, null);
  }

  getTopics() {
    return this.http.get<Topic[]>(this.forumsUrl + "forum/topics");
  }

    //Function that will make a call to the Forum API endpoint to add a given topic to a given discussion
    addTopicToDiscussion(discussionid: string, topicid: string)
    {
      return this.http.post( this.forumsUrl + "forum/discussion/topic/" + discussionid + "/" + topicid, null);
    }

  //Function that will make a call to the Forum API endpoint to filter discussion by topic
  filterDiscussionByTopic(topicid: string){
    return this.http.get<Discussion[]>( this.forumsUrl + "forum/discussions/topic/" + topicid);
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
  
  //Function that calls Forum API to Post following a discussion of a user  
  followDiscussion(discussionid: string, userid: string){
    return this.http.post(this.forumsUrl + "forum/discussions/follow/" + discussionid + "/" + userid, null);
  }

  getUserFollowedDiscussion(userid: string){
    return this.http.get<Discussion[]>( this.forumsUrl + "forum/discussions/follow/" + userid);
  }

  postComment(newComment: any) {
    return this.http.post(this.forumsUrl + "forum/comment", newComment);
  }

  submitDiscussion(discussion: newDiscussion) {
    console.log(discussion)
    return this.http.post(this.forumsUrl + "forum/discussion", discussion);
  }
}
