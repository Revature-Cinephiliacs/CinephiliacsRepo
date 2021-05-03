import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DiscussionListComponent } from './discussion-list.component';

describe('DiscussionListComponent', () => {
  let component: DiscussionListComponent;
  let fixture: ComponentFixture<DiscussionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiscussionListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscussionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('DiscussionList-SortByCreationTimeA Should alter CreatedBtn', () =>{
    component.createdBth = true;
    component.sortByCreationA();
    expect(component.createdBth).toBe(false);
  })
  it('DiscussionList-sortByLikeA Should alter likesBtn', () =>{
    component.likesBtn = true;
    component.sortByLikeA();
    expect(component.likesBtn).toBe(false);
  })

  it('DiscussionList-onNext Should increment pageNum', ( ) =>{
    component.pageNum = 1;
    component.onNext();
    expect(component.pageNum).toBe(2);
  })
  it('DiscussionList-onPerv Should decrement pageNum', ( ) =>{
    component.pageNum = 2;
    component.onNext();
    expect(component.pageNum).toBe(1);
  })

  it('On Init test', () => {
    component.ngOnInit();
    expect(component.getDiscussions).toHaveBeenCalled;
  });

  it('should contain Discussions', () =>{
    const a: HTMLElement = fixture.nativeElement.querySelector('h3');
    expect(a.textContent).toContain("Discussions");
  })


});
