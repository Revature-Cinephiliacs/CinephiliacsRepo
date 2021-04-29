import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoggerService } from './logger.service';


@Injectable({
  providedIn: 'root'
})
export class HttpService {

  connectionString: string = "https://movie-database-imdb-alternative.p.rapidapi.com";
  apiKey: string = "f6d24cec46msh55a535ae1cf36d0p1bf4bcjsnd49b624447d2";

  constructor(private http: HttpClient,
    private logger: LoggerService,
  ) {

  }

  getMovies(searchTerm: string, pageNum: number) {
    return this.http.get("https://movie-database-imdb-alternative.p.rapidapi.com/?rapidapi-key=f6d24cec46msh55a535ae1cf36d0p1bf4bcjsnd49b624447d2&s=" + searchTerm + "&r=json&page=" + pageNum);
    //return this.http.get('https://api.openbrewerydb.org/breweries')
    //COME ON WORK
  }

  getMovie(id: string) {
    return this.http.get("https://movie-database-imdb-alternative.p.rapidapi.com?rapidapi-key=f6d24cec46msh55a535ae1cf36d0p1bf4bcjsnd49b624447d2&i=" + id + "&r=json");
  }

  getConnection() {
    this.logger.log("", this.connectionString);
    return this.connectionString;
  }

  getAPIKey() {
    this.logger.log("", this.connectionString);
    return this.apiKey;
  }





}
