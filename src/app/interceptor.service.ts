// from: https://medium.com/swlh/using-auth0-to-secure-your-angular-application-and-access-your-asp-net-core-api-1947b9389f4f
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})

// injects the token automatically in the request and passes it along
// only injects the request if user is currenly loggedin
export class InterceptorService implements HttpInterceptor {
  loggedIn: boolean;

  constructor(private auth: AuthService, private logger: LoggerService) {
    auth.getTokenSilently$().subscribe((reply) => {
      this.logger.log("in interceptor", reply);
      this.loggedIn = reply != null && reply != undefined;
    });
  }

  // runs on every request being made
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.loggedIn) {
      this.logger.log("loggedin into interceptor", "");
      return this.auth.getTokenSilently$().pipe(
        mergeMap(token => {
          const tokenReq = req.clone({
            setHeaders: { Authorization: `Bearer ${token}` }
          });
          return next.handle(tokenReq);
        }),
        catchError(err => {
          this.logger.error("injector error", "");
          return throwError(err);
        })
      );
    } else {
      this.logger.log("not loggedin into interceptor", "");
      return next.handle(req);
    }
  }
}