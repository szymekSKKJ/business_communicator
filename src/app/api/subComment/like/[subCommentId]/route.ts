import prisma from "@/prisma";
import "../../../../../firebaseInitialization";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { createResponse, response } from "@/app/api/responseTypes";

export const POST = async (request: Request, { params: { subCommentId } }: { params: { subCommentId: string } }) => {
  const session = await getServerSession(authOptions);

  const requestData = await request.formData();

  try {
    if (session) {
      const user = (await prisma.user.findUnique({
        where: {
          id: session.user.id,
        },
      })) as {
        id: string;
        name?: string;
        email?: string;
        emailVerified?: Date;
        image?: string;
        publicId?: string;
        description?: string;
        postCommentId?: string;
      };

      if (user) {
        const doesUserLikeThisSubComment = requestData.get("doesUserLikeThisSubComment") as string;

        if (doesUserLikeThisSubComment === "true") {
          await prisma.postSubComment.update({
            where: {
              id: subCommentId,
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
          await prisma.postSubComment.update({
            where: {
              id: subCommentId,
              likedBy: {
                none: {
                  id: session.user.id,
                },
              },
            },
            data: {
              likedBy: {
                set: user,
              },
            },
          });

          return createResponse(200, null, null);
        }
      }
    } else {
      return createResponse(200, "User is not that user", null);
    }
  } catch (e) {
    const error = e as Error;
    return createResponse(500, error.message, null);
  }
};

export const subCommentLike = async (subCommentId: string, doesUserLikeThisSubComment: boolean): Promise<response<null>> => {
  const formData = new FormData();

  formData.append("doesUserLikeThisSubComment", `${doesUserLikeThisSubComment}`);

  const responseData = (await fetch(`${process.env.NEXT_PUBLIC_URL}/api/subComment/like/${subCommentId}`, {
    method: "POST",
    body: formData,
  }).then(async (response) => await response.json())) as response<null>;

  return responseData;
};
