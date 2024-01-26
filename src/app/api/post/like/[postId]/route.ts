import prisma from "@/prisma";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import "../../../../../firebaseInitialization";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const POST = async (request: Request, { params: { postId } }: { params: { postId: string } }) => {
  const session = await getServerSession(authOptions);
  const requestData = await request.formData();
  const userId = requestData.get("userId") as string;

  if (session.user.id === userId) {
    const user = (await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })) as {
      id: string;
      name?: string;
      email?: string;
      emailVerified?: Date;
      image?: string;
      publicId?: string;
      description?: string;
      postCommentId?: string;
    }; // From schema.prisma

    if (user) {
      await prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          likedBy: {
            set: user,
          },
        },
      });
    }
  }

  try {
    return Response.json({ status: 200, data: {} });
  } catch (e) {
    const error = e as Error;
    return Response.json({ status: 500, error: error.message, data: null });
  }
};

export const postLike = async (postId: string, userId: string) => {
  const formData = new FormData();

  formData.append("userId", `${userId}`);

  const responseData = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/post/like/${postId}`, {
    method: "POST",
    body: formData,
  }).then(async (response) => await response.json());

  return responseData as {
    data: {};
    status: number;
  };
};
