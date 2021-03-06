import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ListComponent } from './list/list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { MovieComponent } from './movie/movie.component';
import { AllUsersComponent } from './all-users/all-users.component';
import { UserComponent } from './user/user.component';
import { DiscussionComponent } from './discussion/discussion.component';
import { ProfileComponent } from './profile/profile.component';
import { AdmintoolsComponent } from './admintools/admintools.component';
import { ReviewComponent } from './review/review.component';
import { MovieDiscussionsComponent } from './movie-discussions/movie-discussions.component';
import { DiscussionListComponent } from './discussion-list/discussion-list.component';
import { GetStartedBoxComponent } from './get-started-box/get-started-box.component';
import { ErrorComponent } from './error/error.component';
import { RecommendationsComponent } from './recommendations/recommendations.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ListComponent,
    MovieComponent,
    AllUsersComponent,
    UserComponent,
    DiscussionComponent,
    ProfileComponent,
    AdmintoolsComponent,
    ReviewComponent,
    MovieDiscussionsComponent,
    DiscussionListComponent,
    GetStartedBoxComponent,
    ErrorComponent,
    RecommendationsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
