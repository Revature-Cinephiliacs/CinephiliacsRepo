import { Component, OnInit } from '@angular/core';
import { ForumService } from '../forum.service';
import { ActivatedRoute } from '@angular/router';
import { MoviepageService } from '../moviepage.service'
import { Discussion, Movie, Topic, newDiscussion, NewUser } from '../models/models'
import { AuthService } from '../auth.service';
import * as moment from 'moment';

@Component({
  selector: 'app-discussion-list',
  templateUrl: './discussion-list.component.html',
  styleUrls: ['./discussion-list.component.scss']
})
export class DiscussionListComponent implements OnInit {
  discussions: Discussion[] = [];
  
  numOfDiscussion: number = 0;
  pageNum: number = 1;
  topics: Topic[];
  discussionTopics: string[];
  sortingOrder: string = "recentD"   //Default sorting order will be based recent activities

  constructor(private auth: AuthService,
    private _forum: ForumService,
    private _movie: MoviepageService,
    private router: ActivatedRoute) { }
  movieID: string = "";
  selectedFilter: string;

  //for sorting buttons 
  commentsSortState: number = 0;
  likesSortState: number = 0;
  createdSortState: number = 0;
  activitySortState: number = 0;
  commentsSort: boolean = false;
  likesSort: boolean = false;
  createdSort: boolean = false;
  activitySort: boolean = true;
  commentsSortDirection: string = "\u21D5";
  likesSortDirection: string = "\u21D5";
  createdSortDirection: string = "\u21D5";
  activitySortDirection: string = "\u21D3";

  movieTitle: string;
  userid: string;

  displayPostDiscussion: boolean = false;

  submitDiscussion: newDiscussion = {
    movieId: this.router.snapshot.params.id,
    topic: "",
    userId: "",
    subject: "",
    creationTime: null
  }
  isloggedIn: boolean = false;
  ngOnInit(): void {
    this.auth.authModel$.subscribe(reply => {
      if (reply != null && reply != undefined) {
        this.userid = reply.userid;
        this.submitDiscussion.userId = reply.userid;
        this.isloggedIn = true;
      } else {
        this.isloggedIn = false;
      }
    })
    this.movieID = this.router.snapshot.params.id;
    this._movie.getMovieDetails(this.movieID).subscribe(data => { this.movieTitle = data.title })
    this._forum.getDiscussion(this.movieID).subscribe(data =>{ 
      var tempDis
      tempDis = data;
      this.numOfDiscussion = tempDis.length
    })
      this._forum.getTopics().subscribe(data => {
        this.topics = data;
      });
      this.getDiscussions()
  }


  //Function that will get a list of discussions associated with the
  //snapshot movie id
  async getDiscussions() {
    this.discussions = [];
    this._forum.getDiscussionPage(this.movieID, this.pageNum, this.sortingOrder).subscribe(data => {
      this.discussions = data;
    });
  }

  //get next discussion page
  onNext() {

    this.pageNum++;
    this.getDiscussions();
  }
  //get previous duscussuin page
  onPrev() {

    this.pageNum--;
    this.getDiscussions();
  }

  //Function that will take in a search string and then filter
  //the dicussions to show matching results
  filterlist: Discussion[] = [];
  searchDiscussion() {
    let input, filter;
    input = document.getElementById("searchDiscussion");
    filter = input.value.toUpperCase();

    this.filterlist = this.discussions.filter(obj => {
      return !!JSON.stringify(Object.values(obj)).match(new RegExp(filter, 'i'));
    });
  }

  //Function that will get a list of discussions for a movie
  //sorted based on number of comments
  async commentsSortNext() {
    switch (this.commentsSortState) {
      case 0:
        this.commentsSortState = 1;
        this.likesSortState = 0;
        this.createdSortState = 0;
        this.activitySortState = 0;
        this.sortingOrder = "commentsD";
        this.commentsSortDirection = "\u21D3";
        this.getDiscussions();
        break;
      case 1:
        this.commentsSortState = 2;
        this.sortingOrder = "commentsA";
        this.commentsSortDirection = "\u21D1";
        this.getDiscussions();
        break;
      case 2:
        this.commentsSortState = 1;
        this.sortingOrder = "commentsD";
        this.commentsSortDirection = "\u21D3";
        this.getDiscussions();
        break;
    }
    this.likesSort = false;
    this.createdSort = false;
    this.activitySort = false;
    this.commentsSort = true;

    this.likesSortDirection = "\u21D5";
    this.createdSortDirection = "\u21D5";
    this.activitySortDirection = "\u21D5";
  }

  //Function to get the paginated list of Discussion sorted by Creation time
  async creationSortNext() {
    switch (this.createdSortState) {
      case 0:
        this.createdSortState = 1;
        this.likesSortState = 0;
        this.commentsSortState = 0;
        this.activitySortState = 0;
        this.sortingOrder = "timeD";
        this.createdSortDirection = "\u21D3";
        this.getDiscussions();
        break;
      case 1:
        this.createdSortState = 2;
        this.sortingOrder = "timeA";
        this.createdSortDirection = "\u21D1";
        this.getDiscussions();
        break;
      case 2:
        this.createdSortState = 1;
        this.sortingOrder = "timeD";
        this.createdSortDirection = "\u21D3";
        this.getDiscussions();
        break;
    }
    this.likesSort = false;
    this.commentsSort = false;
    this.activitySort = false;
    this.createdSort = true;

    this.likesSortDirection = "\u21D5";
    this.commentsSortDirection = "\u21D5";
    this.activitySortDirection = "\u21D5";
  }

  //Finction to get the paginated list of Discussion sorted by recent activities in Descending order
  sortByRecent() {
    switch (this.activitySortState) {
      case 0:
        this.createdSortState = 0;
        this.likesSortState = 0;
        this.commentsSortState = 0;
        this.activitySortState = 1;
        this.sortingOrder = "recentD";
        this.activitySortDirection = "\u21D3";
        this.getDiscussions();
        break;
      case 1:
        this.activitySortState = 2;
        this.sortingOrder = "recentA";
        this.activitySortDirection = "\u21D1";
        this.getDiscussions();
        break;
      case 2:
        this.activitySortState = 1;
        this.sortingOrder = "recentD";
        this.activitySortDirection = "\u21D3";
        this.getDiscussions();
        break;
    }
    this.likesSort = false;
    this.commentsSort = false;
    this.activitySort = true;
    this.createdSort = false;

    this.likesSortDirection = "\u21D5";
    this.commentsSortDirection = "\u21D5";
    this.createdSortDirection = "\u21D5";
  }

  //Function to get the paginated list of Discussion sorted by num of likes
  async likeSortNext() {
    switch (this.likesSortState) {
      case 0:
        this.likesSortState = 1;
        this.createdSortState = 0;
        this.commentsSortState = 0;
        this.activitySortState = 0;
        this.sortingOrder = "likeD";
        this.likesSortDirection = "\u21D3";
        this.getDiscussions();
        break;
      case 1:
        this.likesSortState = 2;
        this.sortingOrder = "likeA";
        this.likesSortDirection = "\u21D1";
        this.getDiscussions();
        break;
      case 2:
        this.likesSortState = 1;
        this.sortingOrder = "likeD";
        this.likesSortDirection = "\u21D3";
        this.getDiscussions();
        break;
    }
    this.createdSort = false;
    this.commentsSort = false;
    this.activitySort = false;
    this.likesSort = true;

    this.createdSortDirection = "\u21D5";
    this.commentsSortDirection = "\u21D5";
    this.activitySortDirection = "\u21D5";
  }

  //Function that will add a new discussion to a movie
  //Will validate input
  postDiscussion() {
    if (this.submitDiscussion.topic == "" || this.submitDiscussion.subject == "") {
    } else if (this.submitDiscussion.subject.length >= 250) {
      alert("Discussion should be less than 250 Characters")
    } else {
      this.submitDiscussion.creationTime = moment();
      this.submitDiscussion.movieId = this.router.snapshot.params.id;
      this._forum.submitDiscussion(this.submitDiscussion).subscribe(data => {
        this.displayPostDiscussion = false;
        this.getDiscussions();
      });

    }
  }

  //Function to change discussion as selected filter
  onChangeFilter() {

    this._forum.filterDiscussionByTopic(this.selectedFilter).subscribe(data => {
      this.discussions = data;
    })
  }

}
