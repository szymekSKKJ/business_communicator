import { postGetSome } from "@/app/api/post/getSome/[userId]/route";
import style from "./styles.module.scss";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { user } from "@/app/api/user/types";
import CreatePost from "@/components/CreatePost/CreatePost";
import Post from "@/components/Post/Post";

interface componentProps {
  userData: user;
}

const Posts = async ({ userData }: componentProps) => {
  const last20Posts = await postGetSome(userData.id);

  const session = await getServerSession(authOptions);

  return (
    <div className={`${style.posts}`}>
      {userData.id === session.user.id && <CreatePost userImageUrl={userData.profileImage} publicId={userData.publicId!} userId={userData.id}></CreatePost>}
      {last20Posts.status === 200 &&
        last20Posts.data &&
        last20Posts.data.length !== 0 &&
        last20Posts.data.map((postData) => {
          const { id } = postData;

          return <Post key={id} userId={userData.id} postData={postData} userImageUrl={userData.profileImage} publicId={userData.publicId!}></Post>;
        })}
    </div>
  );
};

export default Posts;
