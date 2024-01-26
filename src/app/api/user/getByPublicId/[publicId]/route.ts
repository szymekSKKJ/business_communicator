import prisma from "@/prisma";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import "../../../../../firebaseInitialization";

export const GET = async (Request: Request, { params: { publicId } }: { params: { publicId: string } }) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        publicId: publicId,
      },
    });

    if (user) {
      const storage = getStorage();
      const profileImageUrl = await getDownloadURL(ref(storage, `/users/${user.id}/profileImage.jpg`));

      try {
        const backgroundImageUrl = await getDownloadURL(ref(storage, `/users/${user.id}/backgroundImage.jpg`));

        return Response.json({
          status: 200,
          data: {
            profileImage: profileImageUrl,
            backgroundImage: backgroundImageUrl,
            ...user,
          },
        });
      } catch (e) {}

      return Response.json({
        status: 200,
        data: {
          profileImage: profileImageUrl,
          backgroundImage: null,
          ...user,
        },
      });
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    return Response.json({ status: 500, error: error, data: null });
  }
};

export const userGetByPublicId = async (publicId: string) => {
  const responseData = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/user/getByPublicId/${publicId}`).then(async (response) => await response.json());

  return responseData;
};
