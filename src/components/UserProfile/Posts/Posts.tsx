import { postGetSome } from "@/app/api/post/getSome/[userId]/route";
import style from "./styles.module.scss";
import { user } from "@/app/api/user/types";
import ClientWrapper from "./ClientWrapper/ClientWrapper";

interface componentProps {
  user: user;
  currentUser: user | null;
}

const Posts = async ({ user, currentUser }: componentProps) => {
  const last20Posts = await postGetSome(user.id);

  return (
    <div className={`${style.posts}`}>
      <ClientWrapper posts={last20Posts.data ? last20Posts.data : []} currentUser={currentUser} user={user}></ClientWrapper>
    </div>
  );
};

export default Posts;
