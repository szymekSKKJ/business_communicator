import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Background from "@/components/UserProfile/Background/Background";
import Header from "@/components/UserProfile/Header/Header";
import UserProfile from "@/components/UserProfile/UserProfile";
import { getServerSession } from "next-auth";
import { userGetByPublicId } from "@/app/api/user/getByPublicId/[publicId]/route";

const profileLayout = async ({ children }: { children: React.ReactNode }) => {
  // @ts-ignore
  const userPublicIdFromUrl = children.props.segmentPath[3][1]; // Should alwayes be this same
  const session = await getServerSession(authOptions);

  const foundUserData = await userGetByPublicId(userPublicIdFromUrl, true);

  return (
    <>
      {foundUserData.data ? (
        <>
          <Background backgroundUrl={foundUserData.data.backgroundImage}></Background>
          <Header userData={foundUserData.data} currentUser={session.user}></Header>
          <UserProfile>{children}</UserProfile>
        </>
      ) : (
        <p>User not found</p>
      )}
    </>
  );
};

export default profileLayout;
