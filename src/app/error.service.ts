import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  public error$ = new Subject<CustomError>();
  public errorList: CustomError[] = [];
  public MAX_ERRORS = 3;

  constructor() {
    this.localSetup();
  }

  localSetup() {
    this.error$.subscribe(error => {
      this.errorList.push(error);
      setTimeout(() => {
        this.errorList = this.errorList.filter(e => e != error);
      }, 4000);
    });
  }

  addError(errormsg: string) {
    if (this.errorList.length >= this.MAX_ERRORS) {
      this.errorList.pop();
    }
    this.error$.next(new CustomError(errormsg));
  }

}

export class CustomError {
  constructor(msg: string) {
    this.errorMessage = msg;
  }
  errorMessage: string;
}

