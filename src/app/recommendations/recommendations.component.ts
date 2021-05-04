import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { LoggerService } from '../logger.service';
import { Movie, NewUser } from '../models/models';
import { MoviepageService } from '../moviepage.service';

@Component({
  selector: 'app-recommendations',
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.scss']
})
export class RecommendationsComponent implements OnInit {
  
  userModel: any;
  recommendedMovies: Movie[];
  userid: string;

  constructor(
    private logger: LoggerService,
    private router: ActivatedRoute,
    private movieService: MoviepageService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.userProfile$.subscribe(reply => {
      this.logger.log("recs user profile", reply);
      this.userModel = reply;
    });

    this.getUserRecommendedMovies();
  }

  getUserRecommendedMovies()
  {
    console.log("GET RECS")
    let userid = this.userModel.sub;
    this.movieService.getUserRecommendedMovies().subscribe(data => {
      this.logger.log("Recommended Movies", data);
    })
  }

  

}
