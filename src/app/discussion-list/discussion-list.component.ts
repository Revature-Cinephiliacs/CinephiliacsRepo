import { Component, OnInit } from '@angular/core';
import {ForumService } from '../forum.service';
import { ActivatedRoute } from '@angular/router';
import { Discussion } from '../models'

@Component({
  selector: 'app-discussion-list',
  templateUrl: './discussion-list.component.html',
  styleUrls: ['./discussion-list.component.scss']
})
export class DiscussionListComponent implements OnInit {

  discussions: Discussion[] = [];
  numOfDiscussion: number = 0;
  pageNum: number = 1;
  topics: string[];
  sortingOrder: string = "recent"   //Default sorting order will be based recent activities

  constructor(private _forum: ForumService, 
    private router:  ActivatedRoute) { }
  movieID:string = "";
  ngOnInit(): void {
    this.movieID =  this.router.snapshot.params.id;

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
  setTable(){
    
    let input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[0];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }       
    }
  }

  //Function that will get a list of discussions for a movie
  //sorted in ascending order based on number of comments
  async sortDiscussionsByCommentsAsc() {
    this.sortingOrder = "commentsA";
    this.getDiscussions()
    
  }

  //Function that will get a list of discussions for a movie
  //sorted in descending order based on number of comments
  async sortDiscussionsByCommentsDesc() {
    this.sortingOrder = "commentsD";
    this.getDiscussions();
  }

  //Finction to get the paginated list of Discussion sorted by Creation time in Ascending order
  sortByCreationA(){
    this.sortingOrder = "timeA";
    this.getDiscussions();
  }
  
  //Finction to get the paginated list of Discussion sorted by Creation time in Descending order
  sortByCreationB(){
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
    this.sortingOrder = "likeD";
    this.getDiscussions();
  }
  
  //Finction to get the paginated list of Discussion sorted by num of likes in Ascending order
  sortByLikeA(){
    this.sortingOrder = "likeA";
    this.getDiscussions();
  }

  async filterByTopic(topicid: string)
  {
    console.log(topicid)
    setTimeout(() => {
      this._forum.filterDiscussionByTopic(topicid).subscribe(data => {
        console.log(data);
        this.discussions = data;
      })
    })
  }


}
