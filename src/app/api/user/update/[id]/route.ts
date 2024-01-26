import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/prisma";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { getServerSession } from "next-auth";
import "../../../../../firebaseInitialization";

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
        await uploadBytes(ref(storage, `users/${id}/profileImage.jpg`), requestData.get("profileImage") as Blob);
      }

      if (requestData.get("backgroundImage")) {
        await uploadBytes(ref(storage, `users/${id}/backgroundImage.jpg`), requestData.get("backgroundImage") as Blob);
      }

      if (requestData.get("description")) {
        preparedDataToSave.description = requestData.get("description") as string;
      }

      if (requestData.get("publicId")) {
        preparedDataToSave.publicId = requestData.get("publicId") as string;
      }

      if (requestData.get("name")) {
        preparedDataToSave.name = requestData.get("name") as string;
      }

      const updatedRecord = await prisma.user.update({
        where: { id: id },
        data: preparedDataToSave,
      });

      return Response.json({ status: 200, data: updatedRecord });
    } else {
      throw new Error("User is not that user");
    }
  } catch (e: any) {
    const error = e as Error;

    return Response.json({ status: 500, error: error.message, data: null });
  }
};

export const userUpdate = async (userId: string, publicId?: string, description?: string, name?: string, profileImage?: File, backgroundImage?: File) => {
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

  const responseData = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/user/update/${userId}`, {
    method: "POST",
    body: formData,
  }).then(async (response) => await response.json());

  return responseData;
};
