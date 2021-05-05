import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { Comment, Discussion, NewUser, PostReview, ReportedItem, ReportType, TicketItem } from "../models/models";
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import * as moment from 'moment';
import { LoggerService } from '../logger.service';
import { UserService } from '../user.service';
import { AuthService } from '../auth.service';
import { ReviewService } from '../review.service';
import { DiscussionService } from '../discussion.service';

@Component({
  selector: 'app-admintools',
  templateUrl: './admintools.component.html',
  styleUrls: ['./admintools.component.scss']
})
export class AdmintoolsComponent implements OnInit {


  tickets: TicketItem[];
  collapsedItem: boolean[];

  users: NewUser[];
  selecteduser: NewUser;


  usertochange: any;
  changeUser: any;


  constructor(private fb: FormBuilder,
    private auth: AuthService,
    private admin: AdminService,
    private logger: LoggerService,
    private reviewService: ReviewService,
    private discussionService: DiscussionService,
    private userService: UserService) { }

  ngOnInit(): void {
    this.auth.isAdmin$.subscribe(iad => {
      if (iad) {
        this.admin.getReports().toPromise().then(result => {
          this.tickets = result;
          this.logger.log("tickets before", this.tickets);
          this.tickets.forEach(t => {
            t.item = JSON.parse("" + t.item);
          });

          this.collapsedItem = Array(this.tickets.length).fill(false);
          this.logger.log("tickets are", this.tickets);
          console.log(this.tickets);
        }).catch(err => {
          this.logger.error("in retrieving tickets", err);
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

  isCollapsed(ticket: TicketItem): boolean {
    let index = this.tickets.indexOf(ticket);
    return this.collapsedItem[index];
  }


  toggleItem(ticket: TicketItem) {
    let index = this.tickets.indexOf(ticket);
    this.collapsedItem[index] = !this.collapsedItem[index];
  }

  archiveTicket(ticketNumber: TicketItem) {
    this.logger.log("ticket archive", ticketNumber);
    this.admin.archiveTicket(ticketNumber.ticketId).then(r => {
      this.tickets = this.tickets.filter(t => t.itemId != ticketNumber.itemId);
    });
  }

  deleteTicket(ticket: TicketItem) {
    switch (ticket.affectedService) {
      case "Comment":
        this.discussionService.deleteComment(ticket.itemId).then(reply => {
          this.admin.archiveTicket(ticket.ticketId).then(reply => {
            this.logger.log("archived", reply);
            this.tickets = this.tickets.filter(t => t.itemId != ticket.itemId);
          });
        });
        break;
      case "Review":
        this.reviewService.deleteReview(ticket.itemId).then(reply => {
          this.admin.archiveTicket(ticket.ticketId).then(reply => {
            this.logger.log("archived", reply);
            this.tickets = this.tickets.filter(t => t.itemId != ticket.itemId);
          });
        });
        break;
      case "Discussion":
        this.discussionService.deleteDiscussion(ticket.itemId).then(reply => {
          this.admin.archiveTicket(ticket.ticketId).then(reply => {
            this.logger.log("archived", reply);
            this.tickets = this.tickets.filter(t => t.itemId != ticket.itemId);
          });
        });
        break;

      default:
        break;
    }
  }

  addAdmin() {
    this.admin.addAdmin(this.usertochange);
  }
  removeAdmin() {
    this.admin.removeAdmin(this.usertochange);
  }
}
