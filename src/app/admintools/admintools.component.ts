import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { Comment, Discussion, NewUser, PostReview, ReportedItem, ReportType } from "../models/models";
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import * as moment from 'moment';
import { LoggerService } from '../logger.service';
import { UserService } from '../user.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-admintools',
  templateUrl: './admintools.component.html',
  styleUrls: ['./admintools.component.scss']
})
export class AdmintoolsComponent implements OnInit {


  tickets: ReportedItem[];
  collapsedItem: boolean[];

  users: NewUser[];
  selecteduser: NewUser;


  usertochange: any;
  changeUser: any;


  constructor(private fb: FormBuilder,
    private auth: AuthService,
    private admin: AdminService, private logger: LoggerService,
    private userService: UserService) { }

  ngOnInit(): void {
    this.auth.isAdmin$.subscribe(iad => {
      if (iad) {
        this.admin.getReports().toPromise().then(result => {
          this.tickets = result;
          this.collapsedItem = Array(this.tickets.length).fill(false);
          console.log(this.tickets);
        }).catch(err => {
          this.logger.error("in retrieving tickets", err);
          this.fillTestTickets();
          this.collapsedItem = Array(this.tickets.length).fill(false);
        });

        this.userService.getAlUser().toPromise().then(result => {
          this.users = result;
          this.logger.log("Users", this.users);
        }).catch(error => {
          this.logger.error("error in retreaving customers", error);
          this.fillUsers();
        });
      }
    });

  }


  fillTestTickets() {
    this.tickets = [
      this.createTicket("some descriptionsome description some description some description some description some description some description some description ", ReportType.Comment),
      this.createTicket("some description some description some description some description some description some description some description ", ReportType.Review),
      this.createTicket("some description some description some description some description some description ", ReportType.Discussion),
    ];
  }

  fillUsers() {
    this.users = [
      this.createUser("01"),
      this.createUser("02"),
      this.createUser("03"),
    ]
    console.log(this.users);
  }

  createUser(userID: string): NewUser {
    let user = new NewUser();
    user.username = "TestUser" + userID;
    user.userid = userID;
    return user;
  }
  createTicket(desc: string, type: ReportType): ReportedItem {
    let ticket = new ReportedItem();
    ticket.ReportId = "a";
    ticket.ReportDescription = desc;
    ticket.ReportEntityType = type;
    ticket.ReportTime = moment(new Date());
    ticket.Item = this.createItem(type);
    return ticket;
  }

  createItem(type: ReportType): any {
    switch (type) {
      case ReportType.Comment:
        let c = new Comment();
        c.text = "comment description comment description comment description comment description";
        return c;
      case ReportType.Discussion:
        let d = new Discussion();
        d.subject = "sasdfa sasdfa sdf asdfasdasdf";
        break;
      case ReportType.Review:
        let r = new PostReview();
        r.review = "review description review description review description review description review description";
        return r;
      default:
        break;
    }
  }

  isCollapsed(ticket: ReportedItem): boolean {
    let index = this.tickets.indexOf(ticket);
    return this.collapsedItem[index];
  }


  toggleItem(ticket: ReportedItem) {
    let index = this.tickets.indexOf(ticket);
    this.collapsedItem[index] = !this.collapsedItem[index];
  }

  archiveTicket(ticketNumber){
    this.admin.archiveTicket(ticketNumber);
  }


  addAdmin() {
    this.admin.addAdmin(this.usertochange);
  }
  removeAdmin() {
    this.admin.removeAdmin(this.usertochange);
  }
}
