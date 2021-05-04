import { Component, OnInit } from '@angular/core';
import {ForumService } from '../forum.service';
import { ActivatedRoute } from '@angular/router';
import { MoviepageService } from '../moviepage.service'
import { Discussion, Movie, Topic } from '../models/models'

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
  sortingOrder: string = "recent"   //Default sorting order will be based recent activities

  constructor(private _forum: ForumService, 
    private _movie: MoviepageService,
    private router:  ActivatedRoute) { }
  movieID:string = "";
  selectedFilter: string;

  //for sorting buttons 
  commentsBtn: boolean = false;
  likesBtn: boolean = false;
  createdBth: boolean = false;
  movieTitle: string;

  displayPostDiscussion: boolean = false;
  submitDiscussion: any = {
    movieid: this.router.snapshot.params.id,
    topic:"",
    userid: "",
    subject:"",
    
  }
  ngOnInit(): void {
    // Load movie info from ID in url
    this.movieID =  this.router.snapshot.params.id;
    this._movie.getMovieDetails(this.movieID).subscribe(data => { this.movieTitle = data.title })
    this._forum.getDiscussion(this.movieID).subscribe(data =>{ 
      this.discussions = data;
      this.numOfDiscussion = this.discussions.length
      this.discussions = []})

      this._forum.getTopics().subscribe(data => {
        console.log(data);
        this.topics = data;
      });
  }

  //Function that will get a list of discussions associated with the
  //snapshot movie id
  async getDiscussions() {
    this.discussions = [];
    setTimeout(() => {
      this._forum.getDiscussionPage(this.movieID, this.pageNum, this.sortingOrder).subscribe(data => {
        console.log(data);
        this.discussions = data;
        this.discussions.forEach(dis => {
            dis.discussionTopics.forEach(tid => {
              this.topics.forEach(t => {
                if(tid.discussionId == t.topicId){

                }
              });
            });
        });
        
        console.log(this.discussions);   
      });
    }, 1000);
  }

   //get next discussion page
   onNext(){
    
    this.pageNum++;
    this.getDiscussions();
  }
  //get previous duscussuin page
  onPrev(){
    
    this.pageNum--;
    this.getDiscussions();
  }

    //Function that will take in a search string and then filter
  //the dicussions to show matching results
 filterlist: Discussion[] = [];
 searchDiscussion(){
  let input, filter;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  console.log(filter)
  this.discussions = this.discussions.filter(obj => {
    return !!JSON.stringify(Object.values(obj)).match(new RegExp(filter, 'i'));
  });
 }

  //Function that will get a list of discussions for a movie
  //sorted in ascending order based on number of comments
  async sortDiscussionsByCommentsAsc() {
    if(this.commentsBtn){
      this.commentsBtn = false;
    }else{
      this.commentsBtn = true;
    }
    this.sortingOrder = "commentsA";
    this.getDiscussions()
    
  }

  //Function that will get a list of discussions for a movie
  //sorted in descending order based on number of comments
  async sortDiscussionsByCommentsDesc() {
    if(this.commentsBtn){
      this.commentsBtn = false;
    }else{
      this.commentsBtn = true;
    }
    this.sortingOrder = "commentsD";
    this.getDiscussions();
  }

  //Finction to get the paginated list of Discussion sorted by Creation time in Ascending order
  sortByCreationA(){
    if(this.createdBth){
      this.createdBth = false;
    }else{
      this.createdBth = true;
    }
    this.sortingOrder = "timeA";
    this.getDiscussions();
  }
  
  //Finction to get the paginated list of Discussion sorted by Creation time in Descending order
  sortByCreationB(){
    if(this.createdBth){
      this.createdBth = false;
    }else{
      this.createdBth = true;
    }
    this.sortingOrder = "timeD";
    this.getDiscussions();
  }

  //Finction to get the paginated list of Discussion sorted by recent activities in Descending order
  sortByRecent(){
    this.sortingOrder = "recent";
    this.getDiscussions();
  }

  //Finction to get the paginated list of Discussion sorted by num of likes in Descending order
  sortByLikeD(){
    if(this.likesBtn){
      this.likesBtn = false;
    }else{
      this.likesBtn = true;
    }
    this.sortingOrder = "likeD";
    this.getDiscussions();
  }
  
  //Finction to get the paginated list of Discussion sorted by num of likes in Ascending order
  sortByLikeA(){
    if(this.likesBtn){
      this.likesBtn = false;
    }else{
      this.likesBtn = true;
    }
    this.sortingOrder = "likeA";
    this.getDiscussions();
  }

  //Function that will add a new discussion to a movie
  //Will validate input
  postDiscussion(){
    if(this.submitDiscussion.topic == "" || this.submitDiscussion.subject == "")
    {
      console.log("didn't submit discussion");
    }else if(this.submitDiscussion.subject.length >= 250){
      alert("Discussion should be less than 250 Characters")
    }else{

      this._forum.submitDiscussion(this.submitDiscussion).subscribe(data => {
        console.log(data); 
        this.displayPostDiscussion = false;
      });
      //this.showDiscussion();
    }
    console.log(this.submitDiscussion);
  }

  //Function to change discussion as selected filter
  onChangeFilter(){
    console.log(this.selectedFilter);
    setTimeout(() => {
      this._forum.filterDiscussionByTopic(this.selectedFilter).subscribe(data => {
        console.log(data);
        this.discussions = data;
      })
    })
  }

}
