import UserProfile from "@/components/UserProfile/UserProfile";
import { GET } from "../../../app/api/user/getByPublicId/[publicId]/route";
import { apiResponseType, user } from "@/types";

interface componentsProps {
  params: { publicId: string };
}

const UserProfilePage = async ({ params: { publicId } }: componentsProps) => {
  const foundUserData = (await GET(null, { params: { publicId: publicId } }).then((response) => response.json())) as apiResponseType<user>;

  return <>{foundUserData.data ? <UserProfile userData={foundUserData.data}></UserProfile> : <>Ten użytkownik nie istnieje :(</>}</>;
};

export default UserProfilePage;
