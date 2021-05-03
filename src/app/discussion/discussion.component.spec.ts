

import { DiscussionComponent } from './discussion.component';
import { HttpClientTestingModule  /*,HttpTestingController*/ } from '@angular/common/http/testing';
import { Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {HttpService} from '../http.service'
import { RouterTestingModule } from '@angular/router/testing';
import { LoginService} from '../login.service';

describe('DiscussionComponent', () => {
  let component: DiscussionComponent;
  let fixture: ComponentFixture<DiscussionComponent>;

  beforeEach(async () => {    TestBed.configureTestingModule({
    imports: [
      RouterTestingModule,
      HttpClientTestingModule
    ],
    declarations: [
      DiscussionComponent
    ],
    providers : [
      HttpService,
      LoginService
    ]
  }).compileComponents();
});

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscussionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  

  it('On Init test', () => {
    component.ngOnInit();
    expect(component.getComments).toHaveBeenCalled;
    expect(component.displayInput).toHaveBeenCalled;
  });

  it('spoilers shown', () => {
    component.displaySpoilers = true;
    expect(component.showSpoilers).toBeTruthy();
  });

  it("Should return dicussion ID", () =>{
    component.discussionID = "123";
    expect(component.getDicussionID()).toBe("123");
  })
  
  it('is true', () => {
    component.displaySpoilers = true;
    expect(component.spoilersShown()).toBe(true);
  });

  it('is Empty',() =>{
    expect(component.isEmpty("NotEmpty")).toBe(false);
  })

  it('Discussion-SortByCreationTimeA Should alter CreatedBtn', () =>{
    component.createdBtn = true;
    component.sortByCreationA();
    expect(component.createdBtn).toBe(false);
  })
  it('Discussion-sortByLikeAsc Should alter likesBtn', () =>{
    component.likesBtn = true;
    component.sortByLikeAsc();
    expect(component.likesBtn).toBe(false);
  })

  it('Discussion-onNext Should increment pageNum', ( ) =>{
    component.pageNum = 1;
    component.onNext();
    expect(component.pageNum).toBe(2);
  })

});
