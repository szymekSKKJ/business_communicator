import prisma from "@/prisma";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import "../../../../../firebaseInitialization.ts";
import { createResponse, response } from "@/app/api/responseTypes";
import { subComment } from "../../types.js";

export const GET = async (request: Request, { params: { commentId } }: { params: { commentId: string } }) => {
  try {
    const url = new URL(request.url);

    const subComments = (await prisma.postSubComment.findMany({
      skip: parseInt(url.searchParams.get("skip") as string),
      take: parseInt(url.searchParams.get("take") as string),
      where: {
        postCommentId: commentId,
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
            postSubCommentReply: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })) as subComment[];

    const storage = getStorage();

    await Promise.all(
      subComments.map(async (subCommentData) => {
        const {
          author: { id: authorId },
          id: subCommentId,
        } = subCommentData;

        const doesUserLikesThisSubComment = await prisma.postSubComment.findUnique({
          where: {
            id: subCommentId,
            likedBy: {
              some: {
                id: url.searchParams.get("userId") as string,
              },
            },
          },
        });

        const urlImage = await getDownloadURL(ref(storage, `users/${authorId}/profileImage.webp`));
        subCommentData.author.image = urlImage;
        subCommentData.doesUserLikesThisSubComment = doesUserLikesThisSubComment === null ? false : true;
      })
    );

    return createResponse(200, null, subComments);
  } catch (e) {
    const error = e as Error;
    return createResponse(500, error.message, null);
  }
};

export const subCommentGetSome = async (commentId: string, userId: string, skip: string = "0", take: string = "20"): Promise<response<subComment[]>> => {
  const responseData = (await fetch(`${process.env.NEXT_PUBLIC_URL}/api/subComment/getSome/${commentId}?skip=${skip}&take=${take}&userId=${userId}`, {
    next: {
      revalidate: 10,
    },
  }).then(async (response) => await response.json())) as response<subComment[]>;

  return responseData;
};
