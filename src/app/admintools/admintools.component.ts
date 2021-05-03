import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { Comment, Discussion, PostReview, ReportedItem, ReportType } from "../models";
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import * as moment from 'moment';
import { LoggerService } from '../logger.service';

@Component({
  selector: 'app-admintools',
  templateUrl: './admintools.component.html',
  styleUrls: ['./admintools.component.scss']
})
export class AdmintoolsComponent implements OnInit {

  form: FormGroup;
  tickets: ReportedItem[];
  collapsedItem: boolean[];

  constructor(private fb: FormBuilder, private admin: AdminService, private logger: LoggerService) { }

  ngOnInit(): void {
    this.admin.getReports().then(result => {
      this.tickets = result;
      this.collapsedItem = Array(this.tickets.length).fill(false);
    }).catch(err => {
      this.logger.error("in retrieving tickets", err);
      this.fillTestTickets();
      this.collapsedItem = Array(this.tickets.length).fill(false);
    });
    this.form = this.fb.group({
      UserName: [''],
      Rights: ['']
    });
  }

  fillTestTickets() {
    this.tickets = [
      this.createTicket("some descriptionsome description some description some description some description some description some description some description ", ReportType.Comment),
      this.createTicket("some description some description some description some description some description some description some description ", ReportType.Review),
      this.createTicket("some description some description some description some description some description ", ReportType.Discussion),
    ];
  }

  createTicket(desc: string, type: ReportType): ReportedItem {
    let ticket = new ReportedItem();
    ticket.ReportId = Math.random();
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

  submitUserChanges() {
    if (this.form.value.UserName != '') {
      console.log(this.form.value);
      if (this.form.value.Rights = "admin") {
        //Add AdminRights
      } else if (this.form.value.Rights = "moderator") {
        //Add ModeratorRights
      }
    }
  }

  toggleItem(ticket: ReportedItem) {
    let index = this.tickets.indexOf(ticket);
    this.collapsedItem[index] = !this.collapsedItem[index];
  }
}
