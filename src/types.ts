export type user = {
  id: string;
  email: string;
  name: string | null | undefined;
  image: string | null | undefined;
  publicId: string | null | undefined;
  description: string | null | undefined;
};

export type apiResponseType<dataResponse> = {
  status: number;
  data: dataResponse | null;
  error?: any;
};
