"use client";

import { post } from "@/app/api/post/types";
import styles from "./styles.module.scss";
import Post from "@/components/Post/Post";
import { user } from "@/app/api/user/types";
import CreatePost from "@/components/CreatePost/CreatePost";
import { useState } from "react";

interface componentProps {
  posts: post[];
  currentUser: user | null;
  user: user;
}

const ClientWrapper = ({ posts: postsData, currentUser, user }: componentProps) => {
  const [posts, setPosts] = useState(postsData);

  return (
    <div className={`${styles.clientWrapper}`}>
      <div className={`${styles.posts}`}>
        {currentUser && currentUser.id === user.id && <CreatePost currentUser={currentUser} setPosts={setPosts}></CreatePost>}
        {posts.map((postData) => {
          const { id } = postData;

          return <Post key={id} currentUser={currentUser} postData={postData}></Post>;
        })}
      </div>
    </div>
  );
};

export default ClientWrapper;
