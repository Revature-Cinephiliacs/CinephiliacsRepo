import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoggerService } from '../logger.service';
import { ForumService } from '../forum.service';
import { Discussion, Comment, User } from '../models/models';
import { AuthService } from '../auth.service';
import { UserService } from "../user.service";
import { AdminService } from '../admin.service';


@Component({
  selector: 'app-discussion',
  templateUrl: './discussion.component.html',
  styleUrls: ['./discussion.component.scss']
})
export class DiscussionComponent implements OnInit {

  // Discussion info
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

  displayFollow: boolean = true;

  displaySpoilers: boolean = false;
  pageComments: Comment[] = [];
  pageNum: number = 1;
  numOfComments = 0;
  sortingOrder: string = "comments";
  parentId: string;
  comments: Comment[];

  //for sorting buttons 
  commentsSortState: number = 1;
  likesSortState: number = 0;
  createdSortState: number = 0;
  sortComment: boolean = true;
  sortLike: boolean = false;
  sortTime: boolean = false;
  likesSortDirection: string = "\u21D5";
  createdSortDirection: string = "\u21D5";

  newComment: any = {
    discussionid: "",
    userid: "",
    text: "",
    isspoiler: false,
    parentcommentid: null
  };

  movieTitle: string;

  constructor(
    private _user: UserService,
    private auth: AuthService,
    private logger: LoggerService,
    private _forum: ForumService,
    private _admin: AdminService,
    private router: ActivatedRoute) { }

  isLoggedIn: boolean = false;
  ngOnInit(): void {
    // Check if user is logged in
    this.auth.authModel$.subscribe(reply => {
      if (reply != null && reply != undefined) {
        this.userid = reply.userid;
        this.username = reply.username;
        this.isLoggedIn = true;
      }
      else {
        this.isLoggedIn = false;
      }
    })
    this.auth.isAdmin$.subscribe(iad => {
      if (iad) {
        console.log("isadmin");
      }
    }
    );

    // Load discussion info
    this.discussionID = this.router.snapshot.params.id;
    this.newComment.discussionid = this.router.snapshot.params.id;

    this.getComments();
    this._forum.getCurrentDiscussion(this.discussionID).subscribe(data => {
      this.logger.log("", data);

      this.discussion = data;

      this.subject = this.discussion.subject;
    });

    // load discussion comments
    this._forum.getDiscussionComments(this.discussionID).subscribe(data => {
      this.comments = data;
      this.getParentSize();
    });

    // Check if user follows the discussion
    this.getUserFollowedDis()
    this._forum.getTopics().subscribe(data => {
      this.topics = data;
    });
  }

  // Function to get paginated comments 
  async getComments() {
    this.pageComments = [];
    this._forum.getDiscussionCommentsPage(this.discussionID, this.pageNum, this.sortingOrder).subscribe(data => {
      this.pageComments = data;
      this.currentTopics = [];
      this.getCurrentTopicNames();
    });
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
  showReplyForm(commentparentid: string) {
    this.displayReplyForm = true;
    this.displayMessageForm = false;
    this.parentId = commentparentid;
  }

  //This function will add a reply to a comment and then
  //Redisplay the nested comments
  postReply() {
    if (this.isEmpty(this.newComment.text)) {
    } else {
      this.newComment.userid = this.userid;
      this.newComment.parentcommentid = this.parentId;
      this._forum.postComment(this.newComment).subscribe(data => { });
      this.getComments();
    }
  }

  //Function that will add a like to a comment
  addLike(commentid: string) {
    var userid = this.userid;
    this._forum.addLike(commentid, userid).subscribe(data => {
      this.getComments();
    });
  }

  //Will hide the reply form and display the new comment form
  cancelReply() {
    this.displayReplyForm = false;
    this.displayMessageForm = true;
  }

  // Sorting functions 
  // sort comments based on creation time in Ascending order
  sortByCreation() {
    switch (this.createdSortState) {
      case 0:
        this.createdSortState = 1;
        this.likesSortState = 0;
        this.commentsSortState = 0;
        this.sortingOrder = "timeD";
        this.createdSortDirection = "\u21D3";
        this.getComments();
        break;
      case 1:
        this.createdSortState = 2;
        this.sortingOrder = "timeA";
        this.createdSortDirection = "\u21D1";
        this.getComments();
        break;
      case 2:
        this.createdSortState = 1;
        this.sortingOrder = "timeD";
        this.createdSortDirection = "\u21D3";
        this.getComments();
        break;
    }
    this.sortLike = false;
    this.sortComment = false;
    this.sortTime = true;

    this.likesSortDirection = "\u21D5";
  }

  //sort comments based on number of like in  
  sortByLikes() {
    switch (this.likesSortState) {
      case 0:
        this.likesSortState = 1;
        this.createdSortState = 0;
        this.commentsSortState = 0;
        this.sortingOrder = "likeD";
        this.likesSortDirection = "\u21D3";
        this.getComments();
        break;
      case 1:
        this.likesSortState = 2;
        this.sortingOrder = "likesA";
        this.likesSortDirection = "\u21D1";
        this.getComments();
        break;
      case 2:
        this.likesSortState = 1;
        this.sortingOrder = "likesD";
        this.likesSortDirection = "\u21D3";
        this.getComments();
        break;
    }
    this.sortTime = false;
    this.sortComment = false;
    this.sortLike = true;

    this.createdSortDirection = "\u21D5";
  }

  //sort comments based on number of comments in Descending order
  sortByComment() {
    this.sortingOrder = "comments";
    this.commentsSortState = 1;
    this.sortComment = true;
    this.sortLike = false;
    this.sortTime = false;

    this.likesSortDirection = "\u21D5";
    this.createdSortDirection = "\u21D5";
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

  // Get discussion id for this page
  getDicussionID() {
    this.logger.log("", "Dicussion ID " + this.discussionID);
    return this.discussionID;
  }

  //Function to display spoilers
  showSpoilers() {
    this.displaySpoilers = true;
    this.logger.log("", this.displaySpoilers);
  }

  // checks whether or not a user has chosen to show spoilers
  spoilersShown() {
    return this.displaySpoilers;
  }

  // checks if a string is blank
  isEmpty(testSTR: string) {
    return (testSTR == "");
  }

  //Function will take the topic ids in the current discussion
  //and convert them into topic names to be displayed to the user
  getCurrentTopicNames() {
    this.discussionTopics.forEach(dt => {
      this.topics.forEach(t => {
        if (dt == t.topicId) {

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


      this._forum.addTopicToDiscussion(this.discussionID, id).subscribe(data => {
        if (data == true) {
          this.currentTopics.push(newTopic);
        }
      })
    }

  }

  // Allows user to follow discussion
  followDiscussion() {
    this._forum.followDiscussion(this.discussionID, this.userid).subscribe(data => {
      console.log(data);
      this.displayFollow = false;
    })
  }

  // Checks whether or not the user is following this discussion
  getUserFollowedDis() {
    this._forum.getUserFollowedDiscussion(this.userid).subscribe(data => {
      data.forEach(dis => {
        if (dis.discussionId == this.discussionID) {
          this.displayFollow = false;
        }
      });
    })
  }

  reportComment(commentToReport) {

  }
}