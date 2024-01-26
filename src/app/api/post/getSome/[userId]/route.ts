import prisma from "@/prisma";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import "../../../../../firebaseInitialization";

export const GET = async (request: Request, { params: { userId } }: { params: { userId: string } }) => {
  try {
    const url = new URL(request.url);

    const posts = await prisma.post.findMany({
      skip: parseInt(url.searchParams.get("skip") as string),
      take: parseInt(url.searchParams.get("take") as string),
      where: {
        authorId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        createdAt: true,
        content: true,
        imagesData: true,
        _count: {
          select: {
            likedBy: true,
          },
        },
      },
    });

    const storage = getStorage();

    await Promise.all(
      posts.map(async (postData) => {
        const parsedImagesData = JSON.parse(`${postData.imagesData}`);

        await Promise.all(
          parsedImagesData.map(async (imageData: { id: string; order: number; url?: string }) => {
            const urlImage = await getDownloadURL(ref(storage, `users/${userId}/posts/${postData.id}/${imageData.id}.jpg`));
            imageData.url = urlImage;
          })
        );

        postData.imagesData = parsedImagesData;
      })
    );

    return Response.json({ status: 200, data: posts });
  } catch (e) {
    const error = e as Error;
    return Response.json({ status: 500, error: error.message, data: null });
  }
};

export type post = { id: string; createdAt: string; content: string; _count: { likedBy: number }; imagesData: { id: string; url: string; order: number }[] };

export const postGetSome = async (userId: string, skip: string = "0", take: string = "20") => {
  const responseData = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/post/getSome/${userId}?skip=${skip}&take=${take}`, {
    next: {
      revalidate: 30,
    },
  }).then(async (response) => await response.json());

  return responseData as {
    data: post[];
    status: number;
  };
};
