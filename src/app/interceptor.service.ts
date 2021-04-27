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

@Injectable({
  providedIn: 'root'
})

// injects the token automatically in the request and passes it along
// only injects the request if user is currenly loggedin
export class InterceptorService implements HttpInterceptor {
  loggedIn: boolean;

  constructor(private auth: AuthService) {
    auth.userProfile$.subscribe((reply) => {
      console.log("in interceptor: " + reply);
      console.log(reply);

      this.loggedIn = reply;
    });
  }

  // runs on every request being made
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.loggedIn) {
      console.log("yes logged in in interceptor");
      return this.auth.getTokenSilently$().pipe(
        mergeMap(token => {
          const tokenReq = req.clone({
            setHeaders: { Authorization: `Bearer ${token}` }
          });
          return next.handle(tokenReq);
        }),
        catchError(err => {
          console.log("injector error");
          return throwError(err);
        })
      );
    } else {
      console.log("not logged in in interceptor");
      return next.handle(req);
    }
  }
}