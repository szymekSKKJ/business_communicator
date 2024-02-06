import styles from "./styles.module.scss";
import Header from "./Header/Header";
import Background from "./Background/Background";

import { ReactNode } from "react";

interface componentProps {
  children: ReactNode;
}

const UserProfile = async ({ children }: componentProps) => {
  return (
    <div className={`${styles.userProfile}`}>
      <div className={`${styles.content}`}>{children}</div>
    </div>
  );
};

export default UserProfile;
