import { comment } from "../comment/getSome/[postId]/route";

export type post = {
  id: string;
  createdAt: Date;
  content: string;
  imagesData: { id: string; url: string; order: number }[];
  author: {
    id: string;
    name: string;
    email: string;
    emailVerified: Date | null;
    profileImage: string;
    publicId: string;
    description: string;
    postSubCommentReplyId: string;
  };
  doesCurrentUserLikesThisPost: boolean;
  mostLikedComment: comment;
  _count: {
    likedBy: number;
    comments: number;
    sharedBy: number;
  };
};
