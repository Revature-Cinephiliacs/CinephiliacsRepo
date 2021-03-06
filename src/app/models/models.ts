import { Moment } from 'moment';

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

export class Comment {
  commentid: string;
  discussionid: number;
  username: string;
  text: string;
  isspoiler: boolean;
  parentCommentid: number
}


export class ReportedItem {
  ReportId?: string; // optional
  ReportEntityType: ReportType;
  ReportDescription: string;
  ReportEnitityId: string;
  ReportTime: Moment;
  Item: any;
}

export class TicketItem {
  affectedService: string;
  descript: string;
  item: any;
  itemId: string;
  ticketId: string;
  timeSubmitted: Moment;
}

export enum ReportType {
  Review = "Review",
  Comment = "Comment",
  Discussion = "Discussion"
}

export class NewUser {
  userid: string;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  dateofbirth: string;
  permissions: number; // 1 for normal user, 3 for admin
}

export class UserNotification {
  creatorUsername: string;
  notificationId: string;
  otherId: string;
  fromService: string;
  creatorId: string;
  item: any; // this can be comments, discussions, or reviews
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

export class TagVote {
  movieId: string;
  userId: string;
  tagName: string;
  isUpvote: boolean;
}

export class Discussion {
  discussionId: string;
  movieId: string;
  userId: string;
  creationTime: Moment;
  subject: string;
  likes: number;
  comments: Comment[];
  discussionFollows: DiscussionFollow[];
  discussionTopics: string[];
}

export class newDiscussion {
  movieId: string;
  userId: string;
  creationTime: Moment;
  subject: string;
  topic: string;
}

export class DiscussionTopic {
  discussionId: string;
  topicId: string;
  discussion: Discussion;
  topic: Topic;
}

export class Topic {
  topicId: string;
  topicName: string;
  discussionTopics: DiscussionTopic[];
}

export class DiscussionFollow {
  discussionId: string;
  userId: string;
  discussion: Discussion;
}