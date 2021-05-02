import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetStartedBoxComponent } from './get-started-box.component';

describe('GetStartedBoxComponent', () => {
  let component: GetStartedBoxComponent;
  let fixture: ComponentFixture<GetStartedBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetStartedBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GetStartedBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
