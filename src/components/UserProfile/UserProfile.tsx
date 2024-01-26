import styles from "./styles.module.scss";
import Header from "./Header/Header";
import Background from "./Background/Background";
import { user } from "@/types";
import Post from "../Post/Post";
import CreatePost from "../CreatePost/CreatePost";
import { post, postGetSome } from "@/app/api/post/getSome/[userId]/route";

interface componentProps {
  userData: user;
}

const UserProfile = async ({ userData }: componentProps) => {
  const last20Posts = await postGetSome(userData.id);
  // lol

  return (
    <div className={`${styles.userProfile}`}>
      <Background backgroundUrl={userData.backgroundImage}></Background>
      <div className={`${styles.content}`}>
        <Header userData={userData}></Header>

        <div className={`${styles.posts}`}>
          <CreatePost userImageUrl={userData.profileImage} username={userData.name} userId={userData.id}></CreatePost>
          {last20Posts.status === 200 &&
            last20Posts.data &&
            last20Posts.data.length !== 0 &&
            last20Posts.data.map((postData) => {
              const { id } = postData;

              return <Post key={id} userId={userData.id} postData={postData} userImageUrl={userData.profileImage} username={userData.name}></Post>;
            })}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
