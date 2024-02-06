import prisma from "@/prisma";
import "../../../../../firebaseInitialization";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { createResponse, response } from "@/app/api/responseTypes";

export const POST = async (request: Request, { params: { postId } }: { params: { postId: string } }) => {
  const session = await getServerSession(authOptions);
  const requestData = await request.formData();
  const userId = requestData.get("userId") as string;

  try {
    if (session.user.id === userId) {
      const doesUserLikeThisPost = requestData.get("doesUserLikeThisPost") as string;

      if (doesUserLikeThisPost === "true") {
        await prisma.post.update({
          where: {
            id: postId,
            likedBy: {
              some: {
                id: userId,
              },
            },
          },
          data: {
            likedBy: {
              disconnect: [{ id: userId }],
            },
          },
        });

        return createResponse(200, null, null);
      } else {
        await prisma.post.update({
          where: {
            id: postId,
            likedBy: {
              none: {
                id: userId,
              },
            },
          },
          data: {
            likedBy: {
              set: [{ id: userId }],
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

export const postLike = async (postId: string, userId: string, doesUserLikeThisPost: boolean): Promise<response<null>> => {
  const formData = new FormData();

  formData.append("userId", `${userId}`);
  formData.append("doesUserLikeThisPost", `${doesUserLikeThisPost}`);

  const responseData = (await fetch(`${process.env.NEXT_PUBLIC_URL}/api/post/like/${postId}`, {
    method: "POST",
    body: formData,
  }).then(async (response) => await response.json())) as response<null>;

  return responseData;
};
