import styles from "./styles.module.scss";
import Header from "./Header/Header";
import Background from "./Background/Background";

const UserProfile = () => {
  return (
    <div className={`${styles.userProfile}`}>
      <Background></Background>
      <div className={`${styles.content}`}>
        <Header></Header>
        <p>1</p>
      </div>
    </div>
  );
};

export default UserProfile;
