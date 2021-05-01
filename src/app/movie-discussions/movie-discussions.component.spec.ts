import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieDiscussionsComponent } from './movie-discussions.component';

describe('MovieDiscussionsComponent', () => {
  let component: MovieDiscussionsComponent;
  let fixture: ComponentFixture<MovieDiscussionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MovieDiscussionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MovieDiscussionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
