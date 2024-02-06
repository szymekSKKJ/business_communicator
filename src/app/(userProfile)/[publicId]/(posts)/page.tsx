import { userGetByPublicId } from "@/app/api/user/getByPublicId/[publicId]/route";
import Posts from "@/components/UserProfile/Posts/Posts";

interface componentsProps {
  params: { publicId: string };
}

const PostsPage = async ({ params: { publicId } }: componentsProps) => {
  const foundUserData = await userGetByPublicId(publicId, true);

  if (foundUserData.data) {
    return <Posts userData={foundUserData.data}></Posts>;
  }
};

export default PostsPage;
