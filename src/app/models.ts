import { Moment } from "moment";

export interface User {
  username: string,
  firstname: string,
  lastname: string,
  email: string,
  permissions: number
}

export interface Review {
  creationTime: string,
  imdbid: string,
  review: string,
  reviewid: string,
  score: string,
  usernameid: string
}

export interface Discussion {
  discussionid: number,
  movieid: string,
  username: string,
  subject: string,
  topic: string
}

export interface Comment {
  commentid: number,
  discussionid: number,
  username: string,
  text: string,
  isspoiler: boolean
}


export interface ReportedItem {
  ReportId?: number, // optional
  ReportEntityType: ReportType,
  ReportDescription: string,
  ReportEnitityId: string,
  ReportTime: Date,
  Item: any
}

export enum ReportType {
  Review = "Review",
  Comment = "Comment",
  Discussion = "Discussion"
}

export interface NewUser {
  userid: string,
  username: string,
  firstname: string,
  lastname: string,
  email: string,
  dateofbirth: string,
  permissions: number
}

export class Movie {
  imdbId: string;
  title: string;
  ratingName: string;
  releaseDate: string;
  releaseCountry: string;
  runtimeMinutes: number;
  isReleased: boolean;
  plot: string;  
  posterURL: string[];
  movieDirectors: string[];
  movieGenres: string[];
  movieLanguages: string[];
  movieTags: string[];
}

export class PostDiscussion {
  movieid: string;
  userid: string;
  subject: string;
  topic: string;
}

export class PostReview {
  imdbid: string;
  usernameid: string;
  score: number;
  review: string;
}