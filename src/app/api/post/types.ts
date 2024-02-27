import { comment } from "../comment/getSome/[postId]/route";

export type post = {
  id: string;
  createdAt: Date;
  content: string;
  imagesData: { id: string; url: string; order: number }[];
  author: {
    id: string;
    name: string;
    profileImage: string;
    publicId: string;
  };
  doesCurrentUserLikesThisPost: boolean;
  mostLikedComment: comment | null;
  _count: {
    likedBy: number;
    comments: number;
    sharedBy: number;
  };
};
