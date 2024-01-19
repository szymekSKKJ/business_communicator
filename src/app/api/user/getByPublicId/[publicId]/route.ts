import prisma from "@/prisma";

export const GET = async ({ params: { publicId } }: { params: { publicId: string } }) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        publicId: publicId,
      },
    });

    return Response.json({ status: 200, data: user });
  } catch (error) {
    return Response.json({ status: 500, error: error, data: null });
  }
};
