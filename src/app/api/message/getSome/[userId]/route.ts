import prisma from "@/prisma";
import "../../../../../firebaseInitialization";
import { createResponse, response } from "@/app/api/responseTypes";
import { message } from "../../types";

export const GET = async (request: Request, { params: { userId } }: { params: { userId: string } }) => {
  try {
    const url = new URL(request.url);

    const sentMessages = (await prisma.sentMessages.findMany({
      skip: parseInt(url.searchParams.get("skip") as string),
      take: parseInt(url.searchParams.get("take") as string),
      where: {
        senderUserId: userId,
        sentToUserId: url.searchParams.get("sendToUserId") as string,
      },
      orderBy: {
        sentAt: "desc",
      },
    })) as message[];

    const receivedMessages = (await prisma.sentMessages.findMany({
      skip: parseInt(url.searchParams.get("skip") as string),
      take: parseInt(url.searchParams.get("take") as string),
      where: {
        senderUserId: url.searchParams.get("sendToUserId") as string,
        sentToUserId: userId,
      },
      orderBy: {
        sentAt: "desc",
      },
    })) as message[];

    parseInt(url.searchParams.get("skip") as string);

    return createResponse(200, null, {
      sentMessages: sentMessages,
      receivedMessages: receivedMessages,
    });
  } catch (e) {
    const error = e as Error;
    return createResponse(500, error.message, null);
  }
};

export const messageGetSome = async (
  userId: string,
  sendToUserId: string,
  skip: string = "0",
  take: string = "20"
): Promise<
  response<{
    sentMessages: message[];
    receivedMessages: message[];
  }>
> => {
  const responseData = (await fetch(`${process.env.NEXT_PUBLIC_URL}/api/message/getSome/${userId}?sendToUserId=${sendToUserId}&skip=${skip}&take=${take}`, {
    next: {
      revalidate: 60 * 5,
    },
  }).then(async (response) => await response.json())) as response<{
    sentMessages: message[];
    receivedMessages: message[];
  }>;

  return responseData;
};
