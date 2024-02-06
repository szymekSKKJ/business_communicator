import prisma from "@/prisma";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import "../../../../../firebaseInitialization";
import { comment } from "@/app/api/comment/getSome/[postId]/route";
import { createResponse, response } from "@/app/api/responseTypes";
import { post } from "../../types";

export const GET = async (request: Request, { params: { userId } }: { params: { userId: string } }) => {
  try {
    const url = new URL(request.url);

    const posts = (await prisma.post.findMany({
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
        author: true,
        _count: {
          select: {
            likedBy: true,
            comments: true,
            sharedBy: true,
          },
        },
      },
    })) as post[];
    const storage = getStorage();

    await Promise.all(
      posts.map(async (postData) => {
        const parsedImagesData = JSON.parse(`${postData.imagesData}`);

        const mostLikedComment = (await prisma.postComment.findFirst({
          where: {
            postId: postData.id,
          },
          select: {
            id: true,
            author: {
              select: {
                id: true,
                name: true,
                publicId: true,
              },
            },
            createdAt: true,
            content: true,
            _count: {
              select: {
                likedBy: true,
                postSubComment: true,
              },
            },
          },
          orderBy: {
            likedBy: {
              _count: "desc",
            },
          },
        })) as comment | null;

        const doesUserLikesThisPost = await prisma.post.findUnique({
          where: {
            id: postData.id,
            likedBy: {
              some: {
                id: userId,
              },
            },
          },
        });

        await Promise.all(
          parsedImagesData.map(async (imageData: { id: string; order: number; url?: string }) => {
            const urlImage = await getDownloadURL(ref(storage, `users/${userId}/posts/${postData.id}/${imageData.id}.webp`));
            imageData.url = urlImage;
          })
        );

        postData.imagesData = parsedImagesData;

        if (mostLikedComment) {
          const urlImage = await getDownloadURL(ref(storage, `users/${userId}/profileImage.webp`));

          mostLikedComment.author.image = urlImage;

          const doesUserLikesThisComment = (await prisma.postComment.findUnique({
            where: {
              id: mostLikedComment.id,
              likedBy: {
                some: {
                  id: userId,
                },
              },
            },
          })) as comment | null;

          mostLikedComment.doesUserLikesThisComment = doesUserLikesThisComment === null ? false : true;

          postData.mostLikedComment = mostLikedComment;
        }

        postData.doesUserLikesThisPost = false;

        if (doesUserLikesThisPost) {
          postData.doesUserLikesThisPost = true;
        }
      })
    );
    return createResponse(200, null, posts);
  } catch (e) {
    const error = e as Error;
    return createResponse(500, error.message, null);
  }
};

export const postGetSome = async (userId: string, skip: string = "0", take: string = "10"): Promise<response<post[]>> => {
  const responseData = (await fetch(`${process.env.NEXT_PUBLIC_URL}/api/post/getSome/${userId}?skip=${skip}&take=${take}`, {
    cache: "no-cache",
  }).then(async (response) => await response.json())) as response<post[]>;

  return responseData;
};
