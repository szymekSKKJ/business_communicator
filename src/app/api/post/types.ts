import { comment } from "../comment/getSome/[postId]/route";

export type post = {
  id: string;
  createdAt: Date;
  content: string;
  imagesData: { id: string; url: string; order: number }[];
  author: {
    id: string;
    name: string | null;
    email: string | null;
    emailVerified: Date | null;
    image: string | null;
    publicId: string | null;
    description: string | null;
    postSubCommentReplyId: string | null;
  };
  doesUserLikesThisPost: boolean;
  mostLikedComment: comment | null;
  _count: {
    likedBy: number;
    comments: number;
    sharedBy: number;
  };
};
