export type subComment = {
  id: string;
  createdAt: Date;
  content: string;
  doesUserLikesThisSubComment: boolean;
  author: {
    id: string;
    name: string | null;
    publicId: string | null;
    image: string;
  };
  _count: {
    likedBy: number;
    postSubCommentReply: number;
  };
};
