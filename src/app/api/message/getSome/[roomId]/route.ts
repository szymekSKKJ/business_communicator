import { authOptions, sessionUser } from "@/app/api/auth/[...nextauth]/route";
import { createResponse, response } from "@/app/api/responseTypes";
import { getServerSession } from "next-auth";
import prisma from "@/prisma";
import { message } from "../../types";

const GET = async (request: Request, { params: { roomId } }: { params: { roomId: string } }) => {
  try {
    const userSession = await getServerSession(authOptions);

    if (userSession) {
      const sessionUser = userSession.user as sessionUser;
      const url = new URL(request.url);

      if (sessionUser.id === url.searchParams.get("currentUserId")) {
        const take = url.searchParams.get("take") as string;
        const skip = url.searchParams.get("skip") as string;

        const messagesData = await prisma.sentMessage.findMany({
          where: {
            chatRoomId: roomId,
          },
          take: parseInt(take),
          skip: parseInt(skip),
          orderBy: {
            sentAt: "desc",
          },
          select: {
            id: true,
            senderUserId: true,
            sentAt: true,
            content: true,
          },
        });

        return createResponse(200, null, messagesData);
      } else {
        return createResponse(500, "User is not that user", null);
      }
    } else {
      return createResponse(500, "User not signin", null);
    }
  } catch (e) {
    const error = e as Error;
    return createResponse(500, error.message, null);
  }
};

const messaageGetSome = async (roomId: string, currentUserId: string, skip: number = 0, take: number = 20): Promise<response<message[]>> => {
  const responseData = (await fetch(`${process.env.NEXT_PUBLIC_URL}/api/message/getSome/${roomId}?take=${take}&skip=${skip}&currentUserId=${currentUserId}`, {
    cache: "no-cache",
  }).then(async (response) => await response.json())) as response<message[]>;

  return responseData;
};

export { GET, messaageGetSome };
