import prisma from "@/prisma";

export const POST = async (request: Request, { params: { id } }: { params: { id: string } }) => {
  try {
    const requestData = await request.json();

    let preparedDataToSave: any = {};

    if (requestData.publicId) {
      preparedDataToSave.publicId = requestData.publicId;
    }
    if (requestData.description) {
      preparedDataToSave.description = requestData.description;
    }

    const updatedRecord = await prisma.user.update({
      where: { id: id },
      data: preparedDataToSave,
    });

    return Response.json({ status: 200, data: updatedRecord });
  } catch (error) {
    return Response.json({ status: 500, error: error, data: null });
  }
};
