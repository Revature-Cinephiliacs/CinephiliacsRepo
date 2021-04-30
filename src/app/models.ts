//import { Moment } from "moment";

export interface User {
  username: string,
  firstname: string,
  lastname: string,
  email: string,
  permissions: number
}

export interface Review {
  movieid: string,
  username: string,
  rating: string,
  text: string
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
  //ReportTime: Moment,
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