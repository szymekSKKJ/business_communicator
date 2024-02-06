import prisma from "@/prisma";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import "../../../../../firebaseInitialization.ts";
import { createResponse, response } from "@/app/api/responseTypes";

export type comment = {
  content: string;
  id: string;
  _count: {
    postSubComment: number;
    likedBy: number;
  };
  createdAt: Date;
  doesUserLikesThisComment: boolean;
  author: {
    id: string;
    name: string | null;
    publicId: string | null;
    image: string;
  };
};

export const GET = async (request: Request, { params: { postId } }: { params: { postId: string } }) => {
  try {
    const url = new URL(request.url);

    const comments = (await prisma.postComment.findMany({
      skip: parseInt(url.searchParams.get("skip") as string),
      take: parseInt(url.searchParams.get("take") as string),
      where: {
        postId: postId,
      },
      select: {
        id: true,
        author: {
          select: {
            id: true,
            name: true,
            publicId: true,
          },
        },
        createdAt: true,
        content: true,
        _count: {
          select: {
            likedBy: true,
            postSubComment: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })) as comment[];

    const storage = getStorage();

    await Promise.all(
      comments.map(async (commentData) => {
        const {
          author: { id: authorId },
          id: commentId,
        } = commentData;

        const doesUserLikesThisComment = await prisma.postComment.findUnique({
          where: {
            id: commentId,
            likedBy: {
              some: {
                id: url.searchParams.get("userId") as string,
              },
            },
          },
        });

        const urlImage = await getDownloadURL(ref(storage, `users/${authorId}/profileImage.webp`));
        commentData.author.image = urlImage;
        commentData.doesUserLikesThisComment = doesUserLikesThisComment === null ? false : true;
      })
    );

    return createResponse(200, null, comments);
  } catch (e) {
    const error = e as Error;
    return createResponse(500, error.message, null);
  }
};

export const commentGetSome = async (postId: string, userId: string, skip: string = "0", take: string = "20"): Promise<response<comment[]>> => {
  const responseData = (await fetch(`${process.env.NEXT_PUBLIC_URL}/api/comment/getSome/${postId}?skip=${skip}&take=${take}&userId=${userId}`, {
    next: {
      revalidate: 10,
    },
  }).then(async (response) => await response.json())) as response<comment[]>;

  return responseData;
};
