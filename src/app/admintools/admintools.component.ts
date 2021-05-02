import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import {ReportedItem ,User } from "../models";
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { AuthService } from '../auth.service';
import { UserService } from '../user.service';


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

  changeUser: User;
  
  constructor(private auth: AuthService, private fb: FormBuilder,private admin: AdminService,private userServ: UserService) {}

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

  async submitUserChanges(username,rights) {
    if(this.form.value.UserName != ''){
      console.log(this.form.value);
      await this.userServ.getUser(username).then(result=> this.changeUser = result);
      if(this.form.value.Rights = "admin"){
        //Add AdminRights
        this.admin.addPermisions(username,"manage:awebsite");
      }else if(this.form.value.Rights = "moderator"){
        //Add ModeratorRights
        this.admin.addPermisions(username,"manage:awebsite");
      }
    }
  }

  async submitRemoveChanges(username,rights){
    if(this.removeform.value.UserName != ''){
      console.log(this.form.value);
      await this.userServ.getUser(username).then(result=> this.changeUser = result);
      if(this.form.value.Rights = "admin"){
        //remove AdminRights
        this.admin.removePermisions(username,"manage:awebsite");
      }else if(this.form.value.Rights = "moderator"){
        //remove ModeratorRights
        this.admin.removePermisions(username,"manage:awebsite");
      }
    }
  }



}
