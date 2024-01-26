export type user = {
  id: string;
  email: string;
  name: string;
  profileImage: string;
  publicId: string;
  description: string;
  backgroundImage: string | null;
};

export type apiResponseType<dataResponse> = {
  status: number;
  data: dataResponse | null;
  error?: any;
};
