import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoggerService } from '../logger.service';
import { ForumService } from '../forum.service';
import { Discussion, Comment } from '../models/models';

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

  user: string; //username 

  displaySpoilers: boolean = false;
  pageComments: Comment[] = [];
  pageNum: number = 1;
  numOfComments = 0;
  sortingOrder: string = "timeD";
  parentId: string;
  comments: Comment[];

  newComment: any = {
    discussionid: 0,
    userid: "",
    text: "",
    isspoiler: false,
    parentcommentid: null
  };

  constructor(
    private logger: LoggerService,
    private _forum: ForumService, private router: ActivatedRoute) { }

  ngOnInit(): void {

    this.discussionID = this.router.snapshot.params.id;
    this.newComment.discussionid = this.router.snapshot.params.id;
    this.displayInput();
    this.getComments();
    this._forum.getCurrentDiscussion(this.discussionID).subscribe(data => {
      this.logger.log("", data);
      this.discussion = data;
      this.subject = this.discussion.subject;
    });

    this._forum.getDiscussionComments(this.discussionID).subscribe(data => {
      this.comments = data;
      this.getParentSize();
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
      this._forum.postComment(this.newComment).subscribe(data => this.logger.log("", data));
      this.getComments();
    }
    this.logger.log("", this.newComment);
  }

  //This function will add a reply to a comment and then
  //Redisplay the nested comments
  postReply() {
    console.log("Post reply" + this.parentId);
    if (this.isEmpty(this.newComment.text)) {
      console.log("Please enter a comment");
    } else {
      this.newComment.userid = this.user; // just for testing purpose, need to remove it later.
      this.newComment.parentcommentid = this.parentId;
      this._forum.postComment(this.newComment).subscribe(data => console.log(data));
      this.getComments();
    }
    console.log(this.newComment);
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
    this.sortingOrder = "timeA";
    this.pageNum = 1;
    this.getComments();
  }
  //sort comments based on creation time in Descending order
  sortByCreationB() {
    this.sortingOrder = "timeD";
    this.pageNum = 1;
    this.getComments();
  }
  //sort comments based on number of like in Ascending order
  sortByLikeAsc() {
    this.sortingOrder = "likesA";
    this.pageNum = 1;
    this.getComments();
  }
  //sort comments based on number of like in Descending order
  sortByLikeDesc() {
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

  displayInput() {
    if (localStorage.getItem("loggedin")) {
      this.user = localStorage.getItem("loggedin");
      this.newComment.username = JSON.parse(this.user).username;
      this.logger.log("", "User Logged In");
    } else {
      this.logger.log("", "Hide inputs");
    }
  }

  getDicussionID() {
    this.logger.log("", "Dicussion ID " + this.discussionID);
    return this.discussionID;
  }


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

}