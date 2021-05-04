import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoggerService } from '../logger.service';
import { ForumService } from '../forum.service';
import { Discussion, Comment, User} from '../models/models';
import { AuthService } from '../auth.service';
import { UserService } from "../user.service";


@Component({
  selector: 'app-discussion',
  templateUrl: './discussion.component.html',
  styleUrls: ['./discussion.component.scss']
})
export class DiscussionComponent implements OnInit {

  discussionID: string = "";
  discussion: Discussion;

  discussionTopics: string[];
  currentTopics = [];
  subject: string;
  topics = [];
  selectedDiscussionOption = "Plot";
  displayWarning = false;

  displayMessageForm = true;
  displayReplyForm = false;

  username: string; //username 
  userid: string;

  displayFollow:boolean = true;

  displaySpoilers: boolean = false;
  pageComments: Comment[] = [];
  pageNum: number = 1;
  numOfComments = 0;
  sortingOrder: string = "timeD";
  parentId: string;
  comments: Comment[];


  newComment: any = {
    discussionid: "",
    userid: "",
    text: "",
    isspoiler: false,
    parentcommentid: null
  };

  //for sorting buttons 
  likesBtn: boolean = false;
  createdBtn: boolean = false;
  movieTitle: string;

  constructor(
    private _user: UserService,
    private auth: AuthService,
    private logger: LoggerService,
    private _forum: ForumService, private router: ActivatedRoute) { }

  ngOnInit(): void {
    this.auth.authModel$.subscribe(reply =>{
      this.userid = reply.userid;
      this.username = reply.username
    })
    
    this.discussionID = this.router.snapshot.params.id;
    this.newComment.discussionid = this.router.snapshot.params.id;
    //this.displayInput();
    console.log(this.username)
    this.getComments();
    this._forum.getCurrentDiscussion(this.discussionID).subscribe(data => {
      this.logger.log("", data);
      console.log(data)
      this.discussion = data;
      
      this.subject = this.discussion.subject;
    });

    this._forum.getDiscussionComments(this.discussionID).subscribe(data => {
      this.comments = data;
      this.getParentSize();
    });
    this.getUserFollowedDis()
    this._forum.getTopics().subscribe(data => {
      console.log(data);
      this.topics = data;
    });
  }

  // Function to get paginated comments 
  async getComments() {
    this.pageComments = [];
    setTimeout(() => {
      this._forum.getDiscussionCommentsPage(this.discussionID, this.pageNum, this.sortingOrder).subscribe(data => {
        console.log("Get comments")
        console.log(data);
        this.pageComments = data;
        this.currentTopics = [];
        this.getCurrentTopicNames();
      });
    }, 1000);
  }

  //Post comment (parent comment)
  postComment() {
    if (this.isEmpty(this.newComment.text)) {
      this.logger.log("", "Please enter a comment");
    } else {
      this.newComment.userid = this.userid;
      this._forum.postComment(this.newComment).subscribe(data => this.logger.log("", data));
      this.getComments();
      const form = document.getElementById("postComment") as HTMLFormElement;
      form.reset();
    }
    this.logger.log("", this.newComment);
  }

  //Function that will show the reply form and hide the new comment form
  showReplyForm(commentparentid:string){
    this.displayReplyForm = true;
    this.displayMessageForm = false;
    this.parentId = commentparentid;
    console.log("Reply to: " + commentparentid);
    console.log("This parent id" + this.parentId);
  }

  //This function will add a reply to a comment and then
  //Redisplay the nested comments
  postReply() {
    console.log("Post reply" + this.parentId);
    if (this.isEmpty(this.newComment.text)) {
      console.log("Please enter a comment");
    } else {
      this.newComment.userid = this.userid; 
      this.newComment.parentcommentid = this.parentId;
      this._forum.postComment(this.newComment).subscribe(data => console.log(data));
      this.getComments();
    }
    console.log(this.newComment);
  }

  //Function that will add a like to a comment
  addLike(commentid: string){
    var userid = this.userid;
    this._forum.addLike(commentid, userid).subscribe(data => {
      console.log(data);
      this.getComments();
    });
  }

  //Will hide the reply form and display the new comment form
  cancelReply() {
    this.displayReplyForm = false;
    this.displayMessageForm = true;
    console.log("cancel")
  }

  // Sorting functions 
  // sort comments based on creation time in Ascending order
  sortByCreationA() {
    if(this.createdBtn){
      this.createdBtn = false;
    }else{
      this.createdBtn = true;
    }
    this.sortingOrder = "timeA";
    this.pageNum = 1;
    this.getComments();
  }
  //sort comments based on creation time in Descending order
  sortByCreationB() {
    if(this.createdBtn){
      this.createdBtn = false;
    }else{
      this.createdBtn = true;
    }
    this.sortingOrder = "timeD";
    this.pageNum = 1;
    this.getComments();
  }
  //sort comments based on number of like in Ascending order
  sortByLikeAsc() {
    if(this.likesBtn){
      this.likesBtn = false;
    }else{
      this.likesBtn = true;
    }
    this.sortingOrder = "likesA";
    this.pageNum = 1;
    this.getComments();
  }
  //sort comments based on number of like in Descending order
  sortByLikeDesc() {
    if(this.likesBtn){
      this.likesBtn = false;
    }else{
      this.likesBtn = true;
    }
    this.sortingOrder = "likesD";
    this.pageNum = 1;
    this.getComments();
  }
  //sort comments based on number of comments in Descending order
  sortByCommentD() {
    this.sortingOrder = "comments";
    this.pageNum = 1;
    this.getComments();
  }

  //get next comments page
  onNext() {
    this.pageComments = [];
    this.pageNum++;
    this.getComments();
  }
  //get previous comments page
  onPrev() {
    this.pageComments = [];
    this.pageNum--;
    this.getComments();
  }

  //Function that will calculate the number of comments
  //based on the number of parent comments
  getParentSize() {
    this.comments.forEach(pc => {
      if (pc.parentCommentid == null) {
        this.numOfComments++;
      }
    });

    console.log(this.numOfComments);
  }

  // displayInput() {
  //   if (localStorage.getItem("loggedin")) {
  //     this.username = localStorage.getItem("loggedin");
  //     this.newComment.username = JSON.parse(this.username).username;
  //     this.logger.log("", "User Logged In");
  //   } else {
  //     this.logger.log("", "Hide inputs");
  //   }
  // }

  getDicussionID() {
    this.logger.log("", "Dicussion ID " + this.discussionID);
    return this.discussionID;
  }

  //Function to display spoilers
  showSpoilers() {
    this.displaySpoilers = true;
    this.logger.log("", this.displaySpoilers);
  }

  spoilersShown() {
    return this.displaySpoilers;
  }

  isEmpty(testSTR: string) {
    return (testSTR == "");
  }

  //Function will take the topic ids in the current discussion
  //and convert them into topic names to be displayed to the user
  getCurrentTopicNames() {
    this.discussionTopics.forEach(dt => {
      this.topics.forEach(t => {
        if (dt == t.topicId) {
          console.log(dt);
          console.log(t.topicName);
          this.currentTopics.push(t.topicName);
        }
      });
    });
  }

  //Function will check if the selected topic is already a topic of the
  //current discussion, if so display a warning, if not call service to add topic
  //to discussion and display updated topics
  addNewTopic() {
    var newTopic = this.selectedDiscussionOption;
    console.log(this.currentTopics.includes(newTopic));
    if (this.currentTopics.includes(newTopic)) {
      this.displayWarning = true;
    }
    else {
      this.displayWarning = false;
      let id = "";
      this.topics.forEach(t => {
        if (newTopic == t.topicName) {
          id = t.topicId;
        }
      });

      console.log("Add topic to dis");
      console.log("new topic id: " + id);
      console.log(this.discussionID);
      this._forum.addTopicToDiscussion(this.discussionID, id).subscribe(data => {
        console.log(data);
        if (data == true) {
          this.currentTopics.push(newTopic);
        }
      })
    }

  }

  followDiscussion(){
    this._forum.followDiscussion(this.discussionID, this.userid).subscribe(data =>{
      console.log(data);
      this.displayFollow = false;
    })
  }

  getUserFollowedDis(){
    this._forum.getUserFollowedDiscussion(this.userid).subscribe(data => {
      data.forEach(dis => {
        if(dis.discussionId == this.discussionID){
          this.displayFollow = false;
        }
      });
    })
  }
}