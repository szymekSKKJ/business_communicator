import styles from "./styles.module.scss";
import Image from "next/image";
import moment from "moment";
import testProfileImage from "../../../../../public/test_profile_image.jpg";
import { Montserrat } from "next/font/google";
import heartIcon from "../../../../../public/post/heart.svg";
import commentIcon from "../../../../../public/post/comment.svg";

const montserrat = Montserrat({ weight: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["latin"] });

const Reply = () => {
  const date = new Date();

  date.setDate(new Date().getDate() - 5);

  const formatedDate = moment(date);

  formatedDate.locale("pl");
  return (
    <div className={`${styles.reply}`}>
      <div className={`${styles.userData}`}>
        <div className={`${styles.wrapper1}`}>
          <Image src={testProfileImage} alt="Zdjęcie autora postu" width={64} height={64}></Image>
        </div>
        <div className={`${styles.wrapper2}`}>
          <p>Disney+</p>
          <p>
            {formatedDate.fromNow()} o {date.toLocaleTimeString("pl-PL", { hour: "numeric", minute: "numeric" })}
          </p>
        </div>
      </div>
      <div className={`${styles.content}`}>
        <p>
          {/* <span className={`${styles.replyTo}`}>@Disney+</span>  */}
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam aliquam mauris quis bibendum tristique. Maecenas feugiat orci et ipsum convallis
          consectetur ut pellentesque lacus. Pellentesque sagittis felis non nibh facilisis, ac sodales ante interdum. Etiam ullamcorper laoreet aliquam.
          Quisque ut venenatis augue. Interdum et malesuada fames ac ante ipsum primis in faucibus. Suspendisse ac ligula ultrices, feugiat lorem id, maximus
          dui.
        </p>
      </div>
      <div className={`${styles.options}`}>
        <button className={`${montserrat.className}`}>
          <Image src={heartIcon} alt="Ikona"></Image> Polub <span> 54</span>
        </button>
        <button className={`${montserrat.className}`}>
          <Image src={commentIcon} alt="Ikona"></Image>Odpowiedz <span>16</span>
        </button>
      </div>
    </div>
  );
};

export default Reply;
