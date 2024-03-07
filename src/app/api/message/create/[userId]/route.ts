import { authOptions, sessionUser } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/prisma";
import { getServerSession } from "next-auth";
import "../../../../../firebaseInitialization";
import { createResponse, response } from "@/app/api/responseTypes";

export const POST = async (request: Request, { params: { userId } }: { params: { userId: string } }) => {
  try {
    const session = await getServerSession(authOptions);
    const sessionUser = session.user as sessionUser;

    if (sessionUser.id === userId) {
      const requestData = await request.formData();

      const messageContent = requestData.get("messageContent") as string;
      const chatRoomId = requestData.get("chatRoomId") as string | null;
      const participantsId = requestData.get("participantsId") ? [...JSON.parse(requestData.get("participantsId") as string)] : null;

      if (chatRoomId === null && participantsId) {
        const createdChatRoom = await prisma.chatRoom.create({
          data: {
            participants: {
              create: participantsId.map((id: string) => {
                return {
                  userId: id,
                };
              }),
            },
          },
        });

        const createdMessage = await prisma.sentMessage.create({
          data: {
            chatRoomId: createdChatRoom.id,
            content: messageContent,
            senderUserId: userId,
          },
        });

        await prisma.chatRoom.update({
          where: {
            id: createdChatRoom.id,
          },
          data: {
            participants: {
              updateMany: {
                where: {
                  userId: userId,
                },
                data: {
                  lastReadMessageId: createdMessage.id,
                },
              },
            },
          },
        });

        return createResponse(200, null, { chatRoomId: createdChatRoom.id });
      } else if (chatRoomId) {
        const doesThisUserExistsInThisChatRoom = await prisma.chatRoom.findUnique({
          where: {
            id: chatRoomId,
            participants: {
              some: {
                userId: userId,
              },
            },
          },
        });

        if (doesThisUserExistsInThisChatRoom) {
          const chatRoom = doesThisUserExistsInThisChatRoom;

          const createdMessage = await prisma.sentMessage.create({
            data: {
              chatRoomId: chatRoom.id,
              content: messageContent,
              senderUserId: userId,
            },
          });

          await prisma.chatRoomParticipant.updateMany({
            where: {
              chatRoomId: chatRoom.id,
              userId: userId,
            },
            data: {
              lastReadMessageId: createdMessage.id,
            },
          });

          return createResponse(200, null, null);
        } else {
          return createResponse(400, "This user does not belongs to this room", null);
        }
      } else {
        return createResponse(400, "Bad gateway", null);
      }
    } else {
      return createResponse(400, "User is not that user", null);
    }
  } catch (e) {
    const error = e as Error;
    return createResponse(500, error.message, null);
  }
};

export const messageCreate = async (
  userId: string,
  messageContent: string,
  chatRoomId: string | null,
  participantsId: string[] | null
): Promise<response<{ roomId: string; messageId: string } | null>> => {
  const formData = new FormData();

  if (chatRoomId) {
    formData.append(`chatRoomId`, `${chatRoomId}`);
  }

  if (participantsId) {
    formData.append(`participantsId`, JSON.stringify(participantsId));
  }

  formData.append(`messageContent`, `${messageContent}`);

  const responseData = (await fetch(`${process.env.NEXT_PUBLIC_URL}/api/message/create/${userId}`, {
    method: "POST",
    body: formData,
  }).then(async (response) => await response.json())) as response<{ roomId: string; messageId: string } | null>;

  return responseData;
};
