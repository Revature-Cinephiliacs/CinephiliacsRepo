import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  constructor() { }

  log(subject: string, info: any) {
  }

  error(subject: string, info: any) {
  }
}
