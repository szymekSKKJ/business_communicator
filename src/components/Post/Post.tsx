import styles from "./styles.module.scss";
import testProfileImage from "../../../public/test_profile_image.jpg";
import testPostImage from "../../../public/test_post_image.jpg";
import Image from "next/image";
import moment from "moment";
import "moment/locale/pl";

const Post = () => {
  const date = new Date();

  date.setDate(new Date().getDate() - 5);

  const formatedDate = moment(date);

  formatedDate.locale("pl");

  return (
    <article className={`${styles.post}`}>
      <div className={`${styles.userData}`}>
        <div className={`${styles.wrapper1}`}>
          <Image src={testProfileImage} alt="Zdjęcie autora postu" width={64} height={64}></Image>
        </div>
        <div className={`${styles.wrapper2}`}>
          <p>Disney+</p>
          <p>
            {/* {date.toLocaleDateString("pl-PL", { year: "numeric", month: "long", day: "numeric" })} o{" "} */}
            {formatedDate.fromNow()} o {date.toLocaleTimeString("pl-PL", { hour: "numeric", minute: "numeric" })}
          </p>
        </div>
      </div>
      <div className={`${styles.content}`}>
        <p>
          Ty: Chętnie poznam kogoś nowego. <br></br>My: Nowe, ikoniczne trio już w Disney+. Poznajcie się! <br></br> Oglądaj nowe odcinki serialu „Percy Jackson
          i bogowie olimpijscy” w każdą środę w Disney+. 🔱
        </p>
        <div className={`${styles.images}`}>
          <div className={`${styles.image}`}>
            <Image src={testPostImage} alt="Zdjęcie posta"></Image>
          </div>
          <div className={`${styles.image}`}>
            <Image src={testPostImage} alt="Zdjęcie posta"></Image>
          </div>
          <div className={`${styles.image}`}>
            <Image src={testPostImage} alt="Zdjęcie posta"></Image>
          </div>
          <div className={`${styles.image}`}>
            <Image src={testPostImage} alt="Zdjęcie posta"></Image>
          </div>
          <div className={`${styles.image}`}>
            <Image src={testPostImage} alt="Zdjęcie posta"></Image>
          </div>
          <div className={`${styles.image}`}>
            <Image src={testPostImage} alt="Zdjęcie posta"></Image>
          </div>
          <div className={`${styles.image}`}>
            <Image src={testPostImage} alt="Zdjęcie posta"></Image>
          </div>
        </div>
      </div>
    </article>
  );
};

export default Post;
