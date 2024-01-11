import styles from "./styles.module.scss";
import Header from "./Header/Header";
import Background from "./Background/Background";
import Post from "../Post/Post";

const UserProfile = () => {
  return (
    <div className={`${styles.userProfile}`}>
      <Background></Background>
      <div className={`${styles.content}`}>
        <Header></Header>
        <Post></Post>
      </div>
    </div>
  );
};

export default UserProfile;
