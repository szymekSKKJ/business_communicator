"use client";
import styles from "./styles.module.scss";
import Header from "./Header/Header";
import Background from "./Background/Background";
import Post from "../Post/Post";
import { user } from "@/types";

interface componentProps {
  userData: user;
}

const UserProfile = ({ userData }: componentProps) => {
  return (
    <div className={`${styles.userProfile}`}>
      <Background></Background>
      <div className={`${styles.content}`}>
        <Header userData={userData}></Header>
        <Post></Post>
        <Post></Post>
      </div>
    </div>
  );
};

export default UserProfile;
