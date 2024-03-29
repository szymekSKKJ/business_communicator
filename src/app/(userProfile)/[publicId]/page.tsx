import styles from "./styles.module.scss";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { userGetByPublicId } from "@/app/api/user/getByPublicId/[publicId]/route";
import Background from "@/components/UserProfile/Background/Background";
import Header from "@/components/UserProfile/Header/Header";
import Posts from "@/components/UserProfile/Posts/Posts";
import UserProfile from "@/components/UserProfile/UserProfile";
import { getServerSession } from "next-auth";

interface componentsProps {
  params: { publicId: string };
}

const UserProfilePage = async ({ params, params: { publicId } }: componentsProps) => {
  const session = await getServerSession(authOptions);

  const currentUser = session ? (await userGetByPublicId(session.user.publicId, true)).data : null;

  const foundUserData = await userGetByPublicId(publicId, true);

  return (
    <div className={`${styles.UserProfilePage}`}>
      {foundUserData.data ? (
        <>
          <div className={`${styles.headerAndBackgroundWrapper}`}>
            <Background backgroundUrl={foundUserData.data.backgroundImage}></Background>
            <Header userData={foundUserData.data} currentUser={currentUser}></Header>
          </div>
          <UserProfile>
            <Posts user={foundUserData.data} currentUser={currentUser}></Posts>
          </UserProfile>
        </>
      ) : (
        <p>User not found</p>
      )}
    </div>
  );
};

export default UserProfilePage;
