import prisma from "@/prisma";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import "../../../../../firebaseInitialization";
import { createResponse, response } from "@/app/api/responseTypes";
import { user } from "../../types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const GET = async (request: Request, { params: { publicId } }: { params: { publicId: string } }) => {
  try {
    const user = (await prisma.user.findUnique({
      where: {
        publicId: publicId,
      },
      select: {
        id: true,
        publicId: true,
        email: true,
        description: true,
        name: true,
        lastActive: true,
        _count: {
          select: {
            followers: true,
            following: true,
            opinions: true,
          },
        },
      },
    })) as user | null;

    if (user) {
      const averageOpinion = await prisma.opinion.aggregate({
        _avg: {
          value: true,
        },
        where: {
          userId: user.id,
        },
      });

      const storage = getStorage();
      const profileImageUrl = await getDownloadURL(ref(storage, `/users/${user.id}/profileImage.webp`));

      const session = await getServerSession(authOptions);

      const doesCurrentUserFollowThisUser =
        session === null
          ? false
          : (await prisma.user.findFirst({
              where: {
                id: user!.id,
                followers: {
                  some: {
                    id: session.user.id,
                  },
                },
              },
            })) === null
          ? false
          : true;

      // #SKKJ sprawdź co jeżeli ktoś nie ma zdjęcia w tle
      try {
        const backgroundImageUrl = await getDownloadURL(ref(storage, `/users/${user.id}/backgroundImage.webp`));

        return createResponse(200, null, {
          ...user,
          profileImage: profileImageUrl,
          backgroundImage: backgroundImageUrl,
          doesCurrentUserFollowThisUser: doesCurrentUserFollowThisUser === null ? false : true,
          averageOpinion: averageOpinion._avg.value ? averageOpinion._avg.value.toFixed(1) : null,
        });
      } catch (e) {}

      return createResponse(200, null, {
        ...user,
        profileImage: profileImageUrl,
        backgroundImage: null,
        doesCurrentUserFollowThisUser: doesCurrentUserFollowThisUser === null ? false : true,
        averageOpinion: averageOpinion._avg.value ? averageOpinion._avg.value.toFixed(1) : null,
      });
    } else {
      return createResponse(200, "User not found", null);
    }
  } catch (e) {
    const error = e as Error;
    return createResponse(500, error.message, null);
  }
};

export const dynamic = "force-dynamic";

export const userGetByPublicId = async (publicId: string, isServerSide: boolean = false): Promise<response<user>> => {
  if (isServerSide) {
    const headers = await import("next/headers");

    const responseData = (await fetch(`${process.env.NEXT_PUBLIC_URL}/api/user/getByPublicId/${publicId}`, {
      next: {
        revalidate: 10,
      },
      method: "GET",
      headers: new Headers(headers.headers()),
    }).then(async (response) => await response.json())) as response<user>;

    return responseData;
  } else {
    const responseData = (await fetch(`${process.env.NEXT_PUBLIC_URL}/api/user/getByPublicId/${publicId}`, {
      next: {
        revalidate: 10,
      },

      method: "GET",
    }).then(async (response) => await response.json())) as response<user>;

    return responseData;
  }
};
