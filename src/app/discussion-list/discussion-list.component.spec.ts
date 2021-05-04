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

  it('DiscussionList-creationSortNext Should alter CreatedBtn', () =>{
    component.createdSort = false;
    component.creationSortNext();
    expect(component.createdSort).toBe(true);
  })
  it('DiscussionList-likeSortNext Should alter likesBtn', () =>{
    component.likesSort = false;
    component.likeSortNext();
    expect(component.likesSort).toBe(true);
  })

  it('DiscussionList-onNext Should increment pageNum', ( ) =>{
    component.pageNum = 1;
    component.onNext();
    expect(component.pageNum).toBe(2);
  })
  it('DiscussionList-onPrev Should decrement pageNum', ( ) =>{
    component.pageNum = 2;
    component.onPrev();
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
