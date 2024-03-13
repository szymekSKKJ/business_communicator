import { createResponse, response } from "../../responseTypes";
import prisma from "@/prisma";
import { user } from "../types";
import { userGetByPublicId } from "../getByPublicId/[publicId]/route";
import { userGetByIdSmallData } from "../getByIdSmallData/[id]/route";
import { getDownloadURL, getStorage, ref } from "firebase/storage";

import "../../../../firebaseInitialization";

export const GET = async (request: Request) => {
  try {
    const recentlyJoinedUserResponse = await prisma.user.findMany({
      take: 10,
      orderBy: {
        joinedAt: "desc",
      },
      select: {
        id: true,
        description: true,
        publicId: true,
        _count: {
          select: {
            opinions: true,
            followers: true,
          },
        },
      },
    });

    const usersData = await Promise.all(
      recentlyJoinedUserResponse.map(async (data) => {
        const { id } = data;

        const storage = getStorage();
        const profileImageUrl = await getDownloadURL(ref(storage, `/users/${id}/profileImage.webp`));

        const averageOpinion = await prisma.opinion.aggregate({
          where: {
            userId: id,
          },
          _avg: {
            value: true,
          },
        });

        return {
          ...data,
          averageOpinion: averageOpinion._avg.value,
          profileImage: profileImageUrl,
        };
      })
    );

    return createResponse(200, null, usersData);
  } catch (e) {
    const error = e as Error;

    return createResponse(500, error.message, null);
  }
};

export const userGetSomeRecentlyJoined = async (): Promise<
  response<
    {
      averageOpinion: number | null;
      profileImage: string;
      id: string;
      publicId: string | null;
      description: string | null;
      _count: {
        opinions: number;
        followers: number;
      };
    }[]
  >
> => {
  return fetch(`${process.env.NEXT_PUBLIC_URL}/api/user/getSomeRecentlyJoined`, {
    method: "GET",
    cache: "no-cache",
  }).then(async (response) => await response.json()) as Promise<
    response<
      {
        averageOpinion: number | null;
        profileImage: string;
        id: string;
        publicId: string | null;
        description: string | null;
        _count: {
          opinions: number;
          followers: number;
        };
      }[]
    >
  >;
};
