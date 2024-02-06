import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/prisma";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { getServerSession } from "next-auth";
import "../../../../../firebaseInitialization";
import { createResponse, response } from "@/app/api/responseTypes";

export const POST = async (request: Request, { params: { id } }: { params: { id: string } }) => {
  try {
    const currentUserSession = await getServerSession(authOptions);

    if (currentUserSession.user.id === id) {
      const requestData = await request.formData();

      const preparedDataToSave: {
        description: null | string;
        publicId: null | string;
        name: null | string;
      } = {
        description: null,
        publicId: null,
        name: null,
      };

      const storage = getStorage();

      if (requestData.get("profileImage")) {
        const profileImageFile = requestData.get("profileImage") as File;
        await uploadBytes(ref(storage, `users/${id}/${profileImageFile.name}`), profileImageFile);
      }

      if (requestData.get("backgroundImage")) {
        const backgroundImageFile = requestData.get("backgroundImage") as File;
        await uploadBytes(ref(storage, `users/${id}/${backgroundImageFile.name}`), backgroundImageFile);
      }

      if (requestData.get("description")) {
        preparedDataToSave.description = requestData.get("description") as string;
      }

      if (requestData.get("publicId")) {
        const doesUserWithThisPublicIdAlreadyExist = await prisma.user.findUnique({
          where: {
            publicId: requestData.get("publicId") as string,
          },
        });

        if (doesUserWithThisPublicIdAlreadyExist) {
          return createResponse(200, "User with given id (@) already exsits", null);
        } else {
          preparedDataToSave.publicId = requestData.get("publicId") as string;
        }
      }

      if (requestData.get("name")) {
        preparedDataToSave.name = requestData.get("name") as string;
      }

      await prisma.user.update({
        where: { id: id },
        data: preparedDataToSave,
      });

      return createResponse(200, null, null);
    } else {
      return createResponse(200, "User is not that user", null);
    }
  } catch (e: any) {
    const error = e as Error;
    return createResponse(500, error.message, null);
  }
};

export const userUpdate = async (
  userId: string,
  publicId?: string,
  description?: string,
  name?: string,
  profileImage?: File,
  backgroundImage?: File
): Promise<response<null>> => {
  const formData = new FormData();

  if (profileImage) {
    formData.append("profileImage", profileImage);
  }

  if (backgroundImage) {
    formData.append("backgroundImage", backgroundImage);
  }

  if (description) {
    formData.append("description", description);
  }

  if (publicId) {
    formData.append("publicId", publicId);
  }

  if (name) {
    formData.append("name", name);
  }

  const responseData = (await fetch(`${process.env.NEXT_PUBLIC_URL}/api/user/update/${userId}`, {
    method: "POST",
    body: formData,
  }).then(async (response) => await response.json())) as response<null>;

  return responseData;
};
