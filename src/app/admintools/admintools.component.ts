import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import {ReportedItem } from "../models/models";
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'app-admintools',
  templateUrl: './admintools.component.html',
  styleUrls: ['./admintools.component.scss']
})
export class AdmintoolsComponent implements OnInit {

  form: FormGroup;
  tickets: ReportedItem[];
  
  constructor(private fb: FormBuilder,private admin: AdminService) {}

  ngOnInit(): void {
    this.admin.getReports().then(result =>{
      this.tickets.push(result);
    });
    this.form = this.fb.group({
      UserName: [''],
      Rights: ['']
    });
  }

  submitUserChanges() {
    if(this.form.value.UserName != ''){
      console.log(this.form.value);
      if(this.form.value.Rights = "admin"){
        //Add AdminRights
      }else if(this.form.value.Rights = "moderator"){
        //Add ModeratorRights
      }
    }
  }



}
