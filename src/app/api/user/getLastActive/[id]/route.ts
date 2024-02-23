import prisma from "@/prisma";

import "../../../../../firebaseInitialization";
import { createResponse, response } from "@/app/api/responseTypes";

export const GET = async (request: Request, { params: { id } }: { params: { id: string } }) => {
  try {
    const lastActive = await prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        lastActive: true,
      },
    });

    return createResponse(200, null, lastActive!.lastActive);
  } catch (e) {
    const error = e as Error;
    return createResponse(500, error.message, null);
  }
};

export const userGetLastActive = async (id: string): Promise<response<string>> => {
  const responseData = (await fetch(`${process.env.NEXT_PUBLIC_URL}/api/user/getLastActive/${id}`, {
    cache: "no-cache",

    method: "GET",
  }).then(async (response) => await response.json())) as response<string>;

  return responseData;
};
