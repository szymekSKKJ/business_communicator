import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/prisma";
import { getServerSession } from "next-auth";
import { createResponse, response } from "@/app/api/responseTypes";

export const POST = async (request: Request, { params: { roomId } }: { params: { roomId: string } }) => {
  try {
    const session = await getServerSession(authOptions);

    if (session) {
      const url = new URL(request.url);

      const userId = url.searchParams.get("userId") as string;

      const lastReadMessageId = await prisma.sentMessage.findFirst({
        where: {
          chatRoomId: roomId,
        },
        orderBy: {
          sentAt: "desc",
        },
      });

      // This is imposible to find two users with this same id in one chat room

      await prisma.chatRoom.update({
        where: {
          id: roomId,
        },
        data: {
          participants: {
            updateMany: {
              where: {
                userId: userId,
              },
              data: {
                lastReadMessageId: lastReadMessageId!.id,
              },
            },
          },
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

export const chatRoomUpdateReadBy = async (roomId: string, userId: string): Promise<response<null>> => {
  const responseData = (await fetch(`${process.env.NEXT_PUBLIC_URL}/api/chatRoom/updateReadBy/${roomId}?userId=${userId}`, {
    method: "POST",
  }).then(async (response) => await response.json())) as response<null>;

  return responseData;
};
