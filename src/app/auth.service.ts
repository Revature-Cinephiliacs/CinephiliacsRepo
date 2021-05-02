// from: https://medium.com/swlh/using-auth0-to-secure-your-angular-application-and-access-your-asp-net-core-api-1947b9389f4f
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import createAuth0Client, { Auth0Client } from '@auth0/auth0-spa-js';
import { BehaviorSubject, combineLatest, from, Observable, of, Subject, throwError } from 'rxjs';
import { catchError, concatMap, shareReplay, tap } from 'rxjs/operators';
import { LoggerService } from './logger.service';
import { LoginService } from './login.service';
import { NewUser } from './models';
import { UrlService } from './url.service';
import { UserService } from './user.service';
// import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // todo: change these to user model
  public authModel$ = new BehaviorSubject<NewUser>(null);
  public authModel = {};
  public isAdmin$ = new BehaviorSubject<boolean>(false);
  public isAdmin = false;
  public isANewUser$ = new BehaviorSubject<boolean>(false);
  public loading$ = new BehaviorSubject<boolean>(true);

  // Create subject and public observable of user profile data
  private userProfileSubject$ = new BehaviorSubject<any>(null);
  userProfile$ = this.userProfileSubject$.asObservable();
  // Create a local property for login status
  loggedIn: boolean = null;
  notLoading: boolean = null;


  // Create an observable of Auth0 instance of client
  auth0Client$ = (from(
    createAuth0Client({
      domain: 'cinephiliacs.us.auth0.com', // the account
      client_id: 'uDzm9BWSa0J3ePufHnwOjxzKWO2hpW5P', // an application
      redirect_uri: "http://localhost:4200", // angular deployment url
      audience: 'https://cinephiliacs-api/' // an API
    })
  ) as Observable<Auth0Client>).pipe(
    shareReplay(1), // Every subscription receives the same shared value
    catchError(err => throwError(err))
  );

  // handling redirecting correctly on authentication client change
  handleRedirectCallback$ = this.auth0Client$.pipe(
    concatMap((client: Auth0Client) => from(client.handleRedirectCallback()))
  );


  // Define observables for SDK methods that return promises by default
  // For each Auth0 SDK method, first ensure the client instance is ready
  // concatMap: Using the client instance, call SDK method; SDK returns a promise
  // from: Convert that resulting promise into an observable
  isAuthenticated$ = this.auth0Client$.pipe(
    concatMap((client: Auth0Client) => from(client.isAuthenticated())),
    tap(res => {
      this.loggedIn = res;
      this.notLoading = true;
      this.logger.log("isAuthenticated loggedin", this.loggedIn);
      this.logger.log("isAuthenticated notloading", this.notLoading);
      // this.loading$.next(false);
    })
  );
  constructor(
    private router: Router,
    private urlService: UrlService,
    private userService: UserService,
    private logger: LoggerService,
  ) {
    // On initial load, check authentication state with authorization server
    // Set up local auth streams if user is already authenticated
    this.localAuthSetup();
    // Handle redirect from Auth0 login
    this.handleAuthCallback();
  }

  // get the token as an observable
  // this should update automatically
  getTokenSilently$(options?): Observable<string> {
    return this.auth0Client$.pipe(
      concatMap((client: Auth0Client) => from(client.getTokenSilently(options)))
    );
  }

  // When calling, options can be passed if desired
  // https://auth0.github.io/auth0-spa-js/classes/auth0client.html#getuser
  getUser$(options?): Observable<any> {
    return this.auth0Client$.pipe(
      concatMap((client: Auth0Client) => from(client.getUser(options))),
      tap(user => {
        this.userProfileSubject$.next(user);
      })
    );
  }

  private localAuthSetup() {
    // This should only be called on app initialization
    // Set up local authentication streams
    const checkAuth$ = this.isAuthenticated$.pipe(
      concatMap((loggedIn: boolean) => {
        if (loggedIn) {
          this.logger.log("loggedIn in checkauth$", this.loggedIn);
          this.logger.log("notloading", this.notLoading);
          // If authenticated, get user and set in app
          // NOTE: you could pass options here if needed
          return this.getUser$();
        }
        // If not authenticated, return stream that emits 'false'
        return of(loggedIn);
      })
    );

    const temp = this.getTokenSilently$();
    temp.subscribe(reply => {
      this.logger.log("token", reply);
      // this.tryRetrieveUser();
    });
    this.userProfile$.subscribe(reply => {
      this.logger.log("userprofile", reply);
      if (reply != null) {
        this.tryRetrieveUser(reply.sub);
      }
    });
    checkAuth$.subscribe((reply) => {
      this.logger.log("in checkAuth$", reply);
      // this.tryRetrieveUser(reply.sub);
    }, () => { }, () => {
    });
  }

  // call the users api to get the current user
  // call this when
  private tryRetrieveUser(userid: string) {
    this.userService.getUser(userid).then(reply => {
      this.authModel$.next(reply);
      if (reply.firstname == null && window.location.pathname != "/profile") {
        this.logger.log("new user", "");
        this.router.navigate(["profile"]);
        this.isANewUser$.next(true);
      }
      else {
        this.isUserAdmin(userid);
      }
    }).catch(err => {
      this.logger.error("in retrieving user", err);
      this.isAdmin$.next(false);
      if (err.status == 404) {
        this.router.navigate(["profile"]);
        this.isANewUser$.next(true);
      }
    });
  }

  // send a request to check if user is an admin
  // if user isn't then set isadmin to false
  private isUserAdmin(userid: string) {
    this.userService.isAdmin(userid).then(reply => {
      this.logger.log("isadmin", reply);
      this.isAdmin$.next(true);
      this.isAdmin = reply;
    }).catch(err => {
      this.logger.error("isadmin", err);
      this.isAdmin$.next(false);
      this.isAdmin = false;
    });
  }

  login(redirectPath: string = '/') {
    // A desired redirect path can be passed to login method
    // (e.g., from a route guard)
    this.logger.log("logging in auth", "");
    // Ensure Auth0 client instance exists
    this.auth0Client$.subscribe((client: Auth0Client) => {
      this.logger.log("auth0Client$", client);
      // Call method to log in
      client.loginWithRedirect({
        redirect_uri: `${window.location.origin}`,
        appState: { target: redirectPath }
      });
    });
  }

  private handleAuthCallback() {
    // Call when app reloads after user logs in with Auth0
    const params = window.location.search;
    if (params.includes('code=') && params.includes('state=')) {
      let targetRoute: string; // Path to redirect to after login processsed
      const authComplete$ = this.handleRedirectCallback$.pipe(
        // Have client, now call method to handle auth callback redirect
        tap(cbRes => {
          // Get and set target redirect route from callback results
          targetRoute = cbRes.appState && cbRes.appState.target ? cbRes.appState.target : '/';
        }),
        concatMap(() => {
          // Redirect callback complete; get user and login status
          return combineLatest([
            this.getUser$(),
            this.isAuthenticated$
          ]);
        })
      );
      // Subscribe to authentication completion observable
      // Response will be an array of user and login status
      authComplete$.subscribe(([user, loggedIn]) => {
        this.logger.log("loggedIn in authcomplete", this.loggedIn);
        this.logger.log("notLoading", this.notLoading);

        // Redirect to target route after callback processing
        this.router.navigate([targetRoute]);
      });
    }
  }

  logout() {
    // Ensure Auth0 client instance exists
    this.auth0Client$.subscribe((client: Auth0Client) => {
      // Call method to log out
      client.logout({
        client_id: 'uDzm9BWSa0J3ePufHnwOjxzKWO2hpW5P',
        returnTo: `${window.location.origin}`
      });
    });
  }
}