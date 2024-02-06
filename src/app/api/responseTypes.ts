export type response<dataResponse> = {
  status: number;
  error: null | string;
  data: null | dataResponse;
};

export const createResponse = <dataResponse>(status: number, error: null | string, data: dataResponse) => {
  return Response.json({ status: status, error: error, data: data });
};
