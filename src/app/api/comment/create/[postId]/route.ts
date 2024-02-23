import prisma from "@/prisma";
import "../../../../../firebaseInitialization.ts";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { createResponse, response } from "@/app/api/responseTypes";

export const POST = async (request: Request, { params: { postId } }: { params: { postId: string } }) => {
  const session = await getServerSession(authOptions);

  try {
    if (session) {
      const requestData = await request.formData();
      const content = requestData.get("content") as string;

      await prisma.postComment.create({
        data: {
          authorId: session.user.id,
          content: content,
          postId: postId,
        },
      });

      return createResponse(200, null, null);
    } else {
      return createResponse(200, "User is not that user", null);
    }
  } catch (e) {
    const error = e as Error;
    return createResponse(500, error.message, null);
  }
};

export const commentCreate = async (postId: string, content: string): Promise<response<null>> => {
  const formData = new FormData();

  formData.append("content", `${content}`);

  const responseData = (await fetch(`${process.env.NEXT_PUBLIC_URL}/api/comment/create/${postId}`, {
    method: "POST",
    body: formData,
  }).then(async (response) => await response.json())) as response<null>;

  return responseData;
};
