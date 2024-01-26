"use client";

import { user } from "@/types";
import Background from "./Background/Background";
import Header from "./Header/Header";
import styles from "./styles.module.scss";
import { useState } from "react";
import Post from "../Post/Post";

interface componentProps {
  userData: user;
}

const EditUserProfile = ({ userData }: componentProps) => {
  const [backgroundImage, setBackgroundImage] = useState<null | File>(null);

  return (
    <div className={`${styles.editUserProfile}`}>
      <Background backgroundImage={backgroundImage}></Background>
      <div className={`${styles.content}`}>
        <Header setBackgroundImage={setBackgroundImage} userData={userData}></Header>
      </div>
    </div>
  );
};

export default EditUserProfile;
