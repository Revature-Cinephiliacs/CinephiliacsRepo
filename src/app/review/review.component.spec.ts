import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewComponent } from './review.component';

describe('ReviewComponent', () => {
  let component: ReviewComponent;
  let fixture: ComponentFixture<ReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("Last page should equal to true", () =>
  {
    component.lastPage=false;
    component.loadNextPage();
    expect(component.lastPage).toBe(true);
  })

  it("TimeSortNext",() => {
    component.reviewsBusy = false;
    component.timeSortState = 0;
    component.timeSortNext();
    expect(component.timeSortState).toBe(1);
  })

  it("TimeSortNext 2",() => {
    component.reviewsBusy = false;
    component.timeSortState = 1;
    component.timeSortNext();
    expect(component.timeSortState).toBe(2);
  })

  it("TimeSortNext 3",() => {
    component.reviewsBusy = false;
    component.timeSortState = 2;
    component.timeSortNext();
    expect(component.timeSortState).toBe(1);
  })

  it("rating sort next case 0", () =>
  {
    component.reviewsBusy = false;
    component.ratingSortState = 0;
    component.ratingSortNext();
    expect(component.ratingSortState = 1);
  })

  it("rating sort next case 1", () =>
  {
    component.reviewsBusy = false;
    component.ratingSortState = 1;
    component.ratingSortNext();
    expect(component.ratingSortState = 2);
  })

  it("rating sort next case 2", () =>
  {
    component.reviewsBusy = false;
    component.ratingSortState = 2;
    component.ratingSortNext();
    expect(component.ratingSortState = 1);
  });
  
});
