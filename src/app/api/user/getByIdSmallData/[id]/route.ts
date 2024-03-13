import prisma from "@/prisma";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import "../../../../../firebaseInitialization";
import { createResponse, response } from "@/app/api/responseTypes";
import { userSmallData } from "../../types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const GET = async (request: Request, { params: { id } }: { params: { id: string } }) => {
  try {
    const user = (await prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        publicId: true,
        lastActive: true,
        description: true,
      },
    })) as userSmallData | null;

    if (user) {
      const storage = getStorage();
      const profileImageUrl = await getDownloadURL(ref(storage, `/users/${user.id}/profileImage.webp`));

      return createResponse(200, null, {
        ...user,
        profileImage: profileImageUrl,
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

export const userGetByIdSmallData = async (userId: string): Promise<response<userSmallData>> => {
  const responseData = (await fetch(`${process.env.NEXT_PUBLIC_URL}/api/user/getByIdSmallData/${userId}`, {
    next: {
      revalidate: 10,
    },

    method: "GET",
  }).then(async (response) => await response.json())) as response<userSmallData>;

  return responseData;
};
