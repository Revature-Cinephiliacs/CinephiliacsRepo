import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { LoggerService } from '../logger.service';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.scss']
})
export class AllUsersComponent implements OnInit {

  users: any;
  constructor(private http: HttpClient,
    private logger: LoggerService,
  ) { }

  ngOnInit(): void {
    this.http.get("https://cinephiliacsapi.azurewebsites.net/user/users").subscribe(data => {
      this.logger.log("", data);
      this.users = data;
    });
  }

}
