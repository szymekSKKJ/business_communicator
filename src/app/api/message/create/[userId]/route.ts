import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/prisma";
import { getServerSession } from "next-auth";
import "../../../../../firebaseInitialization";
import { createResponse, response } from "@/app/api/responseTypes";
import { message } from "../../types";

export const POST = async (request: Request, { params: { userId } }: { params: { userId: string } }) => {
  try {
    const session = await getServerSession(authOptions);

    if (session) {
      const requestData = await request.formData();

      const content = requestData.get("content") as string;
      const sendingToUserId = requestData.get("sendingToUserId") as string;

      const responseData = await prisma.sentMessages.create({
        data: {
          sentToUserId: sendingToUserId,
          senderUserId: userId,
          content: content,
        },
      });

      return createResponse(200, null, responseData);
    } else {
      return createResponse(200, "User is not that user", null);
    }
  } catch (e) {
    const error = e as Error;
    return createResponse(500, error.message, null);
  }
};

export const messageCreate = async (userId: string, content: string, sendingToUserId: string): Promise<response<message>> => {
  const formData = new FormData();

  formData.append(`sendingToUserId`, `${sendingToUserId}`);
  formData.append(`content`, `${content}`);

  const responseData = (await fetch(`${process.env.NEXT_PUBLIC_URL}/api/message/create/${userId}`, {
    method: "POST",
    body: formData,
  }).then(async (response) => await response.json())) as response<message>;

  return responseData;
};
