import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router'
import { HttpService } from '../http.service';
import { LoggerService } from '../logger.service';
import { Movie } from '../models/models';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  movies: any = [];
  searches: string;

  movies2: any;
  searches2: any;
  searchTerm: any;
  pageNum: any;
  nextPg: any;
  prevPg: any;

  searchForm!: FormGroup;

  constructor(
    private logger: LoggerService,
    private router: ActivatedRoute, private _http: HttpService) { }

  ngOnInit(): void {
    // initialize the search form
    this.searchForm = new FormGroup({
      search: new FormControl('', Validators.minLength(2))
    });

    // Display results for the search terms
    this.logger.log("", this.router.snapshot.params);
    this.searchTerm = this.router.snapshot.params.search;
    this.pageNum = (this.router.snapshot.params.page - 1) * 2 + 1;
    // Check if there is a next page
    if (this.pageNum < 75) {
      this.nextPg = parseInt(this.router.snapshot.params.page) + 1;
    }
    // Check if there is a previous page
    if (this.pageNum > 1) {
      this.prevPg = this.router.snapshot.params.page - 1;
    }
    // Get the first page of search results from the third party API
    this._http.getMovies(this.searchTerm, this.pageNum).subscribe(data => {
      this.movies = data;
      this.searches = this.movies.Search;
      this.logger.log("", "this is movies now just so you know");
      this.logger.log("", this.movies.Search);

    });
    // Get the second page of search results from the third party API
    this._http.getMovies(this.searchTerm, (this.pageNum + 1)).subscribe(data => {
      this.movies2 = data;

      this.searches2 = this.movies2.Search;
      this.logger.log("", "this is movies now just so you know");
      this.logger.log("", this.movies2);
    });

  }
  myNumber: number = 0;
  myStrings: string = '';
  function1(): void {
    this.myNumber++;
  }
  function2(s1: string, s2: string): void {
    this.myStrings = s1 + s2;
  }
  function3(myString: string): string {
    return myString + myString;
  }

  // Go to next page
  increasePage() {
    this.pageNum++;
    return this.pageNum;
  }

  // Go to previous page
  decreasePage() {
    this.pageNum--;
    return this.pageNum;
  }

  // Store previous page number
  getPreviousPageNum() {
    this.prevPg = this.pageNum - 1;
    this.logger.log("", this.prevPg);
    return this.prevPg;
  }

  // Store next page number
  getNextPageNum() {
    this.nextPg = this.pageNum + 1;
    this.logger.log("", this.nextPg);
    return this.nextPg;
  }

  // Store current page number
  getPageNum() {
    this.logger.log("", "PageNum" + this.pageNum);
    return this.pageNum;
  }

  // Store current search term
  getSearchTerm() {
    this.logger.log("", "Search Term" + this.searchTerm);
    return this.searchTerm;
  }

  // Go to new search if user submits search form on top of page
  onSubmit() {
    if (this.searchForm.get('search')!.value != "") {
      let searchParam = JSON.stringify(this.searchForm.get('search')!.value).substring(1, JSON.stringify(this.searchForm.get('search')!.value).length - 1);
      window.location.href = "/list/" + searchParam + "/1";
    }
  }

}
