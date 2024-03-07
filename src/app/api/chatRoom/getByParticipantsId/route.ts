import { authOptions, sessionUser } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/prisma";
import { getServerSession } from "next-auth";
import { createResponse, response } from "@/app/api/responseTypes";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import "../../../../firebaseInitialization";

export type initialRoomData = {
  id: string | null;
  messages: {
    id: string;
    senderUserId: string;
    content: string;
    sentAt: Date;
  }[];
  participants: {
    publicId: string | null;
    lastReadMessageId: string | null;
    lastSeenAtChat: Date | null;
    userId: string;
    profileImage: string;
    lastActive: Date;
  }[];
};

export const POST = async (request: Request) => {
  try {
    const session = await getServerSession(authOptions);
    const sessionUser = session.user as sessionUser;

    if (sessionUser) {
      const requestData = await request.formData();

      const participantsId = JSON.parse(requestData.get("usersId") as string);

      const roomData = await prisma.chatRoom.findFirst({
        where: {
          participants: {
            every: {
              userId: {
                in: participantsId,
              },
            },
          },
        },
        select: {
          id: true,
          messages: {
            take: 40,
            select: {
              id: true,
              senderUserId: true,
              sentAt: true,
              content: true,
            },
            orderBy: {
              sentAt: "desc",
            },
          },
          participants: {
            select: {
              userId: true,
              lastReadMessageId: true,
              lastSeenAtChat: true,
              user: {
                select: {
                  publicId: true,
                  lastActive: true,
                },
              },
            },
          },
        },
      });

      if (roomData) {
        const newParticipants = roomData.participants.map((data) => {
          const { user, lastReadMessageId, lastSeenAtChat, userId } = data;

          return {
            publicId: user.publicId!,
            lastActive: user.lastActive!,
            lastReadMessageId: lastReadMessageId,
            lastSeenAtChat: lastSeenAtChat,
            userId: userId,
          };
        }) as unknown as {
          publicId: string;
          lastReadMessageId: string;
          lastSeenAtChat: Date;
          userId: string;
          profileImage: string;
          lastActive: Date;
        }[];

        const newRoomDataType = roomData as unknown as {
          id: string;
          messages: {
            id: string;
            senderUserId: string;
            content: string;
            sentAt: Date;
          }[];
          participants: {
            publicId: string | null;
            lastReadMessageId: string | null;
            lastSeenAtChat: Date | null;
            userId: string;
            profileImage: string;
            lastActive: Date;
          }[];
        };

        newRoomDataType.participants = newParticipants;

        await Promise.all(
          newRoomDataType.participants.map(async (data) => {
            const { userId } = data;

            const storage = getStorage();
            const profileImageUrl = await getDownloadURL(ref(storage, `/users/${userId}/profileImage.webp`));

            data.profileImage = profileImageUrl;
          })
        );

        return createResponse(200, null, newRoomDataType);
      } else {
        return createResponse(400, "Error while getting room data", null);
      }
    } else {
      return createResponse(400, "User is not that user", null);
    }
  } catch (e) {
    const error = e as Error;
    return createResponse(500, error.message, null);
  }
};

export const chatRoomGetByParticipantsId = async (usersId: string[]): Promise<response<initialRoomData | null>> => {
  const formData = new FormData();

  formData.append(`usersId`, JSON.stringify(usersId));

  const responseData = (await fetch(`${process.env.NEXT_PUBLIC_URL}/api/chatRoom/getByParticipantsId`, {
    method: "POST",
    cache: "no-cache",
    body: formData,
  }).then(async (response) => await response.json())) as response<initialRoomData | null>;

  return responseData;
};
