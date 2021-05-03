import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { AuthService } from './auth.service';
import { LoggerService } from './logger.service';
import { CustomError, ErrorService } from './error.service';

describe('AppComponent', () => {
  let auth: AuthService;
  let errors: ErrorService;
  let logger: LoggerService;
  let component: AppComponent = new AppComponent( auth,  errors, logger);
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AuthService,
        AppComponent
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'my-app'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('my-app');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.logo').textContent).toContain('Cinephiliacs');
  });

  it('Should return num', () => {
    expect(component.testCode(3)).toBe(3);
  });


});
