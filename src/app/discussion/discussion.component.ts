import { getLocaleDateTimeFormat } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../admin.service';
import { LoggerService } from '../logger.service';
import { LoginService } from '../login.service';
import {ReportedItem, ReportType,Comment} from '../models';

import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'app-discussion',
  templateUrl: './discussion.component.html',
  styleUrls: ['./discussion.component.scss']
})
export class DiscussionComponent implements OnInit {

  comments: any;
  disscussionID: string = "";
  discussion: any;
  subject: any;
  displaySpoilers: any = false;
  user: any;

  commentReport: FormGroup;
  discussionReport: FormGroup;
  reportDescription:string = "";


  newReport: ReportedItem;
  newComment: any = {
    discussionid: 0,
    username: "",
    text: "",
    isspoiler: false
  };

  constructor(
    private logger: LoggerService, private admin: AdminService, private fb: FormBuilder,
    private _login: LoginService, private router: ActivatedRoute) { }

  ngOnInit(): void {

    this.disscussionID = this.router.snapshot.params.id;
    this.newComment.discussionid = this.router.snapshot.params.id;
    this.displayInput();
    this.getComments();
    this._login.getCurrentDiscussion(this.disscussionID).subscribe(data => {
      this.logger.log("", data);
      this.discussion = data;
      this.subject = this.discussion.subject;
    });

    this.discussionReport = this.fb.group({
      disReport:['']
    });
    this.commentReport = this.fb.group({
      comReport:['']
    });
  }

  async getComments() {
    setTimeout(() => {
      this._login.getDiscussionComments(this.disscussionID).subscribe(data => {
        this.logger.log("", data);
        this.comments = data;
      });
    }, 1000);
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
    this.logger.log("", "Dicussion ID " + this.disscussionID);
    return this.disscussionID;
  }

  postComment() {
    if (this.isEmpty(this.newComment.text)) {
      this.logger.log("", "Please enter a comment");
    } else {
      this._login.postComment(this.newComment).subscribe(data => this.logger.log("", data));
      this.getComments();
    }
    this.logger.log("", this.newComment);
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

  deleteComment( commentID){
    console.log("Delete Comment" + commentID);
    //this.admin.deleteComment(commentID);
  }

  reportComment(reportedComment,comentRep:string){
    //clear report
    this.newReport ={
    ReportId: null,
     ReportEntityType: ReportType.Comment,
    ReportDescription: "",
    ReportEnitityId: "",
    ReportTime: new Date,
     Item: null
    };
    console.log(reportedComment);
    this.newReport.Item = reportedComment;
    this.newReport.ReportEntityType = ReportType.Comment;
    this.newReport.ReportDescription = comentRep;
    this.newReport.ReportEnitityId = reportedComment.commentid.toString();
    console.log(this.newReport);
    this.admin.ReportItem(this.newReport);
  }

  reportDiscussion(discussionRep){
        //clear report
  this.newReport ={
    ReportId: null,
     ReportEntityType: ReportType.Comment,
    ReportDescription: "",
    ReportEnitityId: "",
    ReportTime: new Date,
     Item: null
    };
    console.log(discussionRep);
    this.newReport.Item = this._login.getDiscussion(this.disscussionID);
    this.newReport.ReportEntityType = ReportType.Discussion;
    this.newReport.ReportDescription = discussionRep;
    this.newReport.ReportEnitityId = this.disscussionID;
    console.log(this.newReport);
    //this.admin.ReportItem(this.newReport);
  }

  deleteDiscussion(){
    this.admin.deleteDiscussion(this.disscussionID);
  }
}