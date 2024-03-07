"use client";

import { user } from "@/app/api/user/types";
import Background from "./Background/Background";
import Header from "./Header/Header";
import styles from "./styles.module.scss";
import { useState } from "react";

interface componentProps {
  userData: user;
}

const EditUserProfile = ({ userData }: componentProps) => {
  const [backgroundImage, setBackgroundImage] = useState<null | File>(null);

  return (
    <div className={`${styles.editUserProfile}`}>
      <Background backgroundImage={backgroundImage}></Background>
      <Header setBackgroundImage={setBackgroundImage} userData={userData}></Header>
    </div>
  );
};

export default EditUserProfile;
