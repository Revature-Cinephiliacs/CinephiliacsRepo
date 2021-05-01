import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import {ReportedItem } from "../models";
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-admintools',
  templateUrl: './admintools.component.html',
  styleUrls: ['./admintools.component.scss']
})
export class AdmintoolsComponent implements OnInit {
  //adds Group Permissions
  form: FormGroup;
  //removes Admin Permissions
  removeform:FormGroup;
  tickets: ReportedItem[];
  userId: string;
  username: string;
  authModel: any;
  
  constructor(private auth: AuthService, private fb: FormBuilder,private admin: AdminService) {}

  ngOnInit(): void {

    this.auth.authModel$.subscribe(reply => {
      console.log();
      
      this.userId = reply.userid;
      this.username = reply.username;
      console.log(this.userId);
      console.log(this.authModel);
    });

    this.auth.isAdmin$.subscribe(response => console.log("Response" + response));
    this.admin.getReports().then(result =>{
      this.tickets.push(result);
    });
    this.form = this.fb.group({
      UserName: [''],
      Rights: ['']
    });
    this.removeform = this.fb.group({
      UserName: [''],
      Rights: ['']
    });
  }

  submitUserChanges(username,rights) {
    if(this.form.value.UserName != ''){
      console.log(this.form.value);
      if(this.form.value.Rights = "admin"){
        //Add AdminRights
      }else if(this.form.value.Rights = "moderator"){
        //Add ModeratorRights
      }
    }
  }

  submitRemoveChanges(username,rights){
    if(this.removeform.value.UserName != ''){
      console.log(this.form.value);
      if(this.form.value.Rights = "admin"){
        //remove AdminRights
      }else if(this.form.value.Rights = "moderator"){
        //remove ModeratorRights
      }
    }
  }



}
