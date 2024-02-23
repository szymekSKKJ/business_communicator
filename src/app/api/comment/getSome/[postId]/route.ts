import prisma from "@/prisma";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import "../../../../../firebaseInitialization.ts";
import { createResponse, response } from "@/app/api/responseTypes";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

export type comment = {
  content: string;
  id: string;
  _count: {
    postSubComment: number;
    likedBy: number;
  };
  createdAt: Date;
  doesCurrentUserLikesThisComment: boolean;
  author: {
    id: string;
    name: string;
    publicId: string;
    profileImage: string;
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

    const session = await getServerSession(authOptions);

    const currentUserId = session === null ? null : session.user.id;

    await Promise.all(
      comments.map(async (commentData) => {
        const {
          author: { id: authorId },
          id: commentId,
        } = commentData;

        const doesCurrentUserLikesThisComment =
          currentUserId === null
            ? false
            : (await prisma.postComment.findUnique({
                where: {
                  id: commentId,
                  likedBy: {
                    some: {
                      id: currentUserId,
                    },
                  },
                },
              })) === null
            ? false
            : true;

        const urlImage = await getDownloadURL(ref(storage, `users/${authorId}/profileImage.webp`));
        commentData.author.profileImage = urlImage;
        commentData.doesCurrentUserLikesThisComment = doesCurrentUserLikesThisComment;
      })
    );

    return createResponse(200, null, comments);
  } catch (e) {
    const error = e as Error;
    return createResponse(500, error.message, null);
  }
};

export const commentGetSome = async (postId: string, skip: string = "0", take: string = "20"): Promise<response<comment[]>> => {
  const responseData = (await fetch(`${process.env.NEXT_PUBLIC_URL}/api/comment/getSome/${postId}?skip=${skip}&take=${take}`, {
    next: {
      revalidate: 10,
    },
  }).then(async (response) => await response.json())) as response<comment[]>;

  return responseData;
};
