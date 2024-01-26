import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/prisma";
import { Prisma } from "@prisma/client";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { getServerSession } from "next-auth";
import "../../../../../firebaseInitialization";

export const POST = async (request: Request, { params: { userId } }: { params: { userId: string } }) => {
  try {
    const currentUserSession = await getServerSession(authOptions);

    if (currentUserSession.user.id === userId) {
      const requestData = await request.formData();

      const storage = getStorage();

      const postData = await prisma.post.create({
        data: {
          authorId: userId,
          content: requestData.get("content") as string,
          imagesData: JSON.stringify(JSON.parse(`${requestData.get("imagesData")}`)),
        },
      });

      const imagesData = JSON.parse(`${postData.imagesData}`) as { id: string; order: number }[];

      const imageFiles = requestData.getAll("images") as File[];

      await Promise.all(
        imagesData.map(async (imageData, index) => {
          await uploadBytes(ref(storage, `users/${userId}/posts/${postData.id}/${imageData.id}.jpg`), imageFiles[index] as Blob);
        })
      );

      return Response.json({ status: 200, data: postData });
    } else {
      throw new Error("User is not that user");
    }
  } catch (e) {
    const error = e as Error;
    return Response.json({ status: 500, error: error.message, data: null });
  }
};

export const postCreate = async (
  userId: string,
  content: string,
  images: {
    id: string;
    order: number;
    file: File;
  }[] = []
) => {
  const formData = new FormData();

  formData.append("content", `${content}`);

  const newImagesData: {
    id: string;
    order: number;
  }[] = [];

  const areAllImagesResized = await new Promise<boolean>((resolve) => {
    let loadedImagesCount = 0;

    images.forEach((imageData) => {
      const reader = new FileReader();

      reader.onload = function (e) {
        const img = new Image();
        img.src = e.target!.result as string;

        img.onload = function () {
          const maxWidth = 1024;
          const maxHeight = 1024;

          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

          let newWidth, newHeight;

          if (img.width > img.height) {
            newWidth = maxWidth;
            newHeight = (img.height / img.width) * maxWidth;
          } else {
            newHeight = maxHeight;
            newWidth = (img.width / img.height) * maxHeight;
          }

          canvas.width = newWidth;
          canvas.height = newHeight;

          ctx.drawImage(img, 0, 0, newWidth, newHeight);

          canvas.toBlob((blob) => {
            formData.append(`images`, blob as File);

            newImagesData.push({
              id: imageData.id,
              order: imageData.order,
            });

            loadedImagesCount++;
            if (loadedImagesCount === images.length) {
              resolve(true);
            }
          });
        };
      };

      reader.readAsDataURL(imageData.file);
    });
  });

  formData.append(`imagesData`, `${JSON.stringify(newImagesData)}`);

  const responseData = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/post/create/${userId}`, {
    method: "POST",
    body: formData,
  }).then(async (response) => await response.json());

  return responseData as {
    status: number;
    data: null | {
      id: string;
      authorId: string;
      createdAt: Date;
      content: string;
      imagesData: Prisma.JsonValue;
    };
    error?: string;
  };
};
