import prisma from "@/prisma";
import "../../../../../firebaseInitialization";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { createResponse, response } from "@/app/api/responseTypes";

export const POST = async (request: Request, { params: { commentId } }: { params: { commentId: string } }) => {
  const session = await getServerSession(authOptions);

  try {
    if (session) {
      const requestData = await request.formData();
      const doesUserLikeThisComment = requestData.get("doesUserLikeThisComment") as string;

      if (doesUserLikeThisComment === "true") {
        await prisma.postComment.update({
          where: {
            id: commentId,
            likedBy: {
              some: {
                id: session.user.id,
              },
            },
          },
          data: {
            likedBy: {
              disconnect: [{ id: session.user.id }],
            },
          },
        });

        return createResponse(200, null, null);
      } else {
        await prisma.postComment.update({
          where: {
            id: commentId,
            likedBy: {
              none: {
                id: session.user.id,
              },
            },
          },
          data: {
            likedBy: {
              set: [{ id: session.user.id }],
            },
          },
        });

        return createResponse(200, null, null);
      }
    } else {
      return createResponse(200, "User is not that user", null);
    }
  } catch (e) {
    const error = e as Error;
    return createResponse(500, error.message, null);
  }
};

export const commentLike = async (commentId: string, doesUserLikeThisComment: boolean): Promise<response<null>> => {
  const formData = new FormData();

  formData.append("doesUserLikeThisComment", `${doesUserLikeThisComment}`);

  const responseData = (await fetch(`${process.env.NEXT_PUBLIC_URL}/api/comment/like/${commentId}`, {
    method: "POST",
    body: formData,
  }).then(async (response) => await response.json())) as response<null>;

  return responseData;
};
