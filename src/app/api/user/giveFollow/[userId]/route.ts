import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import prisma from "@/prisma";
import { createResponse, response } from "@/app/api/responseTypes";

export const POST = async (request: Request, { params: { userId } }: { params: { userId: string } }) => {
  try {
    const currentUserSession = await getServerSession(authOptions);

    const requestData = await request.formData();

    const giveToUserId = requestData.get("giveToUserId") as string;
    const doesAlreadyFollow = requestData.get("doesAlreadyFollow") as string;

    if (currentUserSession.user.id === userId) {
      if (doesAlreadyFollow === "true") {
        await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            following: {
              disconnect: [{ id: giveToUserId }],
            },
          },
        });
      } else {
        await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            following: {
              set: [{ id: giveToUserId }],
            },
          },
        });
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

export const userGiveFollow = async (currentUserId: string, giveToUserId: string, doesAlreadyFollow: boolean): Promise<response<null>> => {
  const formData = new FormData();

  formData.append("giveToUserId", `${giveToUserId}`);
  formData.append("doesAlreadyFollow", `${doesAlreadyFollow}`);

  const responseData = (await fetch(`${process.env.NEXT_PUBLIC_URL}/api/user/giveFollow/${currentUserId}`, {
    method: "POST",
    body: formData,
  }).then(async (response) => await response.json())) as response<null>;

  return responseData;
};
