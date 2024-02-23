import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/prisma";
import { Prisma } from "@prisma/client";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { getServerSession } from "next-auth";
import "../../../../../firebaseInitialization";
import { createResponse, response } from "@/app/api/responseTypes";

export const POST = async (request: Request, { params: { userId } }: { params: { userId: string } }) => {
  try {
    const session = await getServerSession(authOptions);

    if (session) {
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

      try {
        await Promise.all(
          imagesData.map(async (imageData, index) => {
            await uploadBytes(ref(storage, `users/${userId}/posts/${postData.id}/${imageData.id}.webp`), imageFiles[index] as Blob);
          })
        );
      } catch (e) {
        const error = e as Error;
        throw new Error(error.message);
      }

      return createResponse(200, null, null);
    } else {
      return createResponse(200, "User is not that user", null);
    }
  } catch (e) {
    const error = e as Error;
    return createResponse(500, error.message, null);
  }
};

export const postCreate = async (
  currentUserId: string,
  content: string,
  images: {
    id: string;
    order: number;
    file: File;
  }[] = []
): Promise<response<null>> => {
  const formData = new FormData();

  formData.append("content", `${content}`);

  const newImagesData: {
    id: string;
    order: number;
  }[] = [];

  if (images.length !== 0) {
    await new Promise<boolean>((resolve) => {
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
            }, "image/webp");
          };
        };

        reader.readAsDataURL(imageData.file);
      });
    });
  }

  formData.append(`imagesData`, `${JSON.stringify(newImagesData)}`);

  const responseData = (await fetch(`${process.env.NEXT_PUBLIC_URL}/api/post/create/${currentUserId}`, {
    method: "POST",
    body: formData,
  }).then(async (response) => await response.json())) as response<null>;

  return responseData;
};
