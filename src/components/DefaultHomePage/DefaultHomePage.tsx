import Footer from "../Footer/Footer";
import Categories from "./Categories/Categories";
import LoginOrSignUp from "./LoginOrSignUp/LoginOrSignUp";
import PromotedOffers from "./PromotedOffers/PromotedOffers";
import styles from "./styles.module.scss";

const DefaultHomePage = () => {
  return (
    <>
      <LoginOrSignUp></LoginOrSignUp>
      <div className={`${styles.defaultHomePage}`}>
        <Categories></Categories>
        <PromotedOffers></PromotedOffers>
      </div>
      <Footer></Footer>
    </>
  );
};

export default DefaultHomePage;
