import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/prisma";
import { getServerSession } from "next-auth";
import { createResponse, response } from "@/app/api/responseTypes";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import "../../../../../firebaseInitialization";

export const GET = async (request: Request, { params: { userId } }: { params: { userId: string } }) => {
  try {
    const session = await getServerSession(authOptions);

    if (session) {
      const url = new URL(request.url);

      const take = parseInt(url.searchParams.get("take") as string);
      const skip = parseInt(url.searchParams.get("skip") as string);

      const response = await prisma.chatRoomParticipant.findMany({
        where: {
          userId: userId,
        },
        take: take,
        skip: skip,
        select: {
          chatRoom: {
            select: {
              participants: {
                select: {
                  user: {
                    select: {
                      id: true,
                      publicId: true,
                      lastActive: true,
                    },
                  },
                },
              },
              messages: {
                select: {
                  id: true,
                  content: true,
                  sentAt: true,
                },
                orderBy: {
                  sentAt: "desc",
                },
                take: 1,
              },
              id: true,
            },
          },
          lastReadMessage: {
            select: {
              id: true,
              content: true,
              sentAt: true,
            },
          },
        },
      });

      const responseNewType = response as {
        chatRoom: {
          messages: {
            id: string;
            sentAt: Date;
            content: string;
          }[];
          participants: {
            user: {
              lastActive: Date;
              id: string;
              publicId: string | null;
              profileImage: string;
            };
          }[];
          id: string;
        };
        lastReadMessage: {
          id: string;
          sentAt: Date;
          content: string;
        } | null;
      }[];

      await Promise.all(
        responseNewType.map(async (data) => {
          const {
            chatRoom: { participants },
          } = data;

          const foundParticipant = participants.find((data) => data.user.id !== userId)!;

          const storage = getStorage();
          const profileImageUrl = await getDownloadURL(ref(storage, `/users/${foundParticipant.user.id}/profileImage.webp`));

          foundParticipant.user.profileImage = profileImageUrl;
        })
      );

      const formattedData = responseNewType.map((data) => {
        const {
          chatRoom: { participants, messages, id },
          lastReadMessage,
        } = data;

        const newParticipants = participants.map((data) => data.user);

        return { lastReadMessage: lastReadMessage, participants: newParticipants, lastChatRoomMessage: messages[0], chatRoomId: id };
      });

      return createResponse(200, null, formattedData);
    } else {
      return createResponse(200, "User is not that user", null);
    }
  } catch (e) {
    const error = e as Error;
    return createResponse(500, error.message, null);
  }
};

export const chatRoomGetSome = async (
  userId: string,
  take: number = 20,
  skip: number = 0
): Promise<
  response<
    {
      lastReadMessage: {
        id: string;
        sentAt: Date;
        content: string;
      } | null;
      participants: {
        lastActive: Date;
        id: string;
        publicId: string | null;
        profileImage: string;
      }[];
      lastChatRoomMessage: {
        id: string;
        sentAt: Date;
        content: string;
      };
      chatRoomId: string;
    }[]
  >
> => {
  const responseData = (await fetch(`${process.env.NEXT_PUBLIC_URL}/api/chatRoom/getSome/${userId}/?take=${take}&skip=${skip}`, {
    method: "GET",
  }).then(async (response) => await response.json())) as response<
    {
      lastReadMessage: {
        id: string;
        sentAt: Date;
        content: string;
      } | null;
      participants: {
        lastActive: Date;
        id: string;
        publicId: string | null;
        profileImage: string;
      }[];
      lastChatRoomMessage: {
        id: string;
        sentAt: Date;
        content: string;
      };
      chatRoomId: string;
    }[]
  >;

  return responseData;
};
