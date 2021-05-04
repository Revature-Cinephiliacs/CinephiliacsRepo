import { analyzeAndValidateNgModules, ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router'
import { HttpService } from '../http.service';
import { LoggerService } from '../logger.service';
import { Movie } from '../models/models';
import { MoviepageService } from '../moviepage.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  movies: any = [];
  searches: string;
  selectedFilter: string;
  defaultFilter = "Title";
  searchFilterOptions = ["Title", "Tags", "Actors", "Directors", "Genre", "Language", "Rating", "Any"];
  searchTerms: string[];
  movies2: any;
  searches2: any;
  searchTerm: any;
  pageNum: any;
  nextPg: any;
  prevPg: any;

  detailedSearching = false;
  regularSearching = true;
  titleSearching = true;
  movieidlist: string[] = [];
  resultMovies: Movie[] = [];

  searchForm!: FormGroup;
  detailForm!: FormGroup;

  constructor(
    private logger: LoggerService,
    private router: ActivatedRoute, private _http: HttpService,
    private routerer: Router,
    private movieService: MoviepageService) { }

  ngOnInit(): void {
    // initialize the search form
    this.searchForm = new FormGroup({
      search: new FormControl('', Validators.minLength(2)),
      selectedFilter: new FormControl(null, Validators.minLength(2))
    });
    this.detailForm = new FormGroup({
      tagFilter: new FormControl(''),
      actorFilter: new FormControl(''),
      directorFilter: new FormControl(''),
      genreFilter: new FormControl(''),
      languageFilter: new FormControl(''),
      ratingFilter: new FormControl(''),

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

  getFilters() {
    this.titleSearching = false;
    this.logger.log("selected filter", this.searchForm.get('selectedFilter').value);
    let filterType = this.searchForm.get('selectedFilter').value;
    this.searchTerm = this.searchForm.get('search').value;
    let termholder = this.stringSplit(this.searchTerm);
    var filterbody = {}
    if (filterType == null) {
      filterType = this.defaultFilter;
    }

    //switch case for filters
    switch (filterType) {
      //If filter is set to title
      case this.searchFilterOptions[0]:
        this.titleSearching = true;
        if (this.searchForm.get('search')!.value != "") {
          let searchParam = JSON.stringify(this.searchForm.get('search')!.value).substring(1, JSON.stringify(this.searchForm.get('search')!.value).length - 1);
          this.routerer.navigate(["/list/" + searchParam + "/1"]);
        }
        break;
      //If filter is set to tags
      case this.searchFilterOptions[1]:
        termholder.forEach(t => {
          let temp = [t];
          filterbody = {
            tag: temp
          }
          this.getSearchResults(filterbody);
        });
        break;
      //If filter is set to Actors
      case this.searchFilterOptions[2]:
        termholder.forEach(t => {
          let temp = [t];
          filterbody = {
            actor: temp
          }
          this.getSearchResults(filterbody);
        });
        break;
      //If filter is set to Directors
      case this.searchFilterOptions[3]:
        termholder.forEach(t => {
          let temp = [t];
          filterbody = {
            director: temp
          }
          this.getSearchResults(filterbody);
        });
        break;
      //If filter is set to Genre
      case this.searchFilterOptions[4]:
        termholder.forEach(t => {
          let temp = [t];
          filterbody = {
            genre: temp
          }
          this.getSearchResults(filterbody);
        });
        break;
      //If filter is set to Languages
      case this.searchFilterOptions[5]:
        termholder.forEach(t => {
          let temp = [t];
          filterbody = {
            language: temp
          }
          this.getSearchResults(filterbody);
        });
        break;
      //If filter is set to Rating
      case this.searchFilterOptions[6]:
        termholder.forEach(t => {
          let temp = [t];
          filterbody = {
            rating: temp
          }
          this.getSearchResults(filterbody);
        });
        break;
      //If filter is set to Any
      case this.searchFilterOptions[7]:
        filterbody = {
          any: termholder
        }
        break;
    }
  }

  //used to split search string by multiple delimiters and then remove quotes
  stringSplit(searchItem: any) {
    let searchInput = searchItem;
    this.searchTerms = searchInput.match(/(?:[^\s"]+|"[^"]*")+/g);
    let termholder = [];
    this.searchTerms.forEach(s => {
      s = s.replace(/['"]+/g, '');
      termholder.push(s);
    });

    return termholder;
  }

  //calls get filters when search is submitted
  onSubmit() {
    this.getFilters();
    this.logger.log("final results", this.movieidlist);
    this.searches = null;
    this.searches2 = [];
  }

  //call movie api for search filter
  getSearchResults(formbody: any) {
    this.movieService.searchMovies(formbody).subscribe((data: string[]) => {
      this.logger.log("Search Results", data);
      data.forEach(d => {
        this.movieService.getMovieDetails(d).subscribe(data => {
          this.logger.log("Movie detail", data);
          this.resultMovies.push(data);
        });
      });
    })
  }

  //toggle detailed search view
  detailedState() {
    this.detailedSearching = true;
    this.regularSearching = false;
  }
  //toggle detailed search view
  regularState() {
    this.detailedSearching = false;
    this.regularSearching = true;
  }

  //detailed search
  detailedSearch() {
    var detailedSearchBody = {};

    let tags = this.detailForm.get('tagFilter').value;
    let actors = this.detailForm.get('actorFilter').value;
    let directors = this.detailForm.get('directorFilter').value;
    let genres = this.detailForm.get('genreFilter').value;
    let languages = this.detailForm.get('languageFilter').value;
    let rating = this.detailForm.get('ratingFilter').value;

    if (tags != "") {
      let termholder = this.stringSplit(tags);
      detailedSearchBody['tag'] = termholder;
    }
    if (actors != "") {
      let termholder = this.stringSplit(actors);
      detailedSearchBody['actor'] = termholder;
    }
    if (directors != "") {
      let termholder = this.stringSplit(directors);
      detailedSearchBody['director'] = termholder;
    }
    if (genres != "") {
      let termholder = this.stringSplit(genres);
      detailedSearchBody['genre'] = termholder;
    }
    if (languages != "") {
      let termholder = this.stringSplit(languages);
      detailedSearchBody['language'] = termholder;
    }
    if (rating != "") {
      let termholder = this.stringSplit(rating);
      detailedSearchBody['rating'] = termholder;
    }

    console.log(detailedSearchBody);
    this.getSearchResults(detailedSearchBody);
  }

}
