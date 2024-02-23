import { postGetSome } from "@/app/api/post/getSome/[userId]/route";
import style from "./styles.module.scss";
import { user } from "@/app/api/user/types";
import CreatePost from "@/components/CreatePost/CreatePost";
import Post from "@/components/Post/Post";

interface componentProps {
  userData: user;
  currentUser: user | null;
}

const Posts = async ({ userData, currentUser }: componentProps) => {
  const last20Posts = await postGetSome(userData.id);

  return (
    <div className={`${style.posts}`}>
      {currentUser && <CreatePost currentUser={currentUser}></CreatePost>}
      {last20Posts.status === 200 &&
        last20Posts.data &&
        last20Posts.data.length !== 0 &&
        last20Posts.data.map((postData) => {
          const { id } = postData;

          return <Post key={id} currentUser={currentUser} postData={postData}></Post>;
        })}
    </div>
  );
};

export default Posts;
