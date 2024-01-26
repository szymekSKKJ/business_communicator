import UserProfile from "@/components/UserProfile/UserProfile";
import { userGetByPublicId } from "../../../app/api/user/getByPublicId/[publicId]/route";

interface componentsProps {
  params: { publicId: string };
}

const UserProfilePage = async ({ params: { publicId } }: componentsProps) => {
  const foundUserData = await userGetByPublicId(publicId);

  return <>{foundUserData.data ? <UserProfile userData={foundUserData.data}></UserProfile> : <>Ten użytkownik nie istnieje :(</>}</>;
};

export default UserProfilePage;
