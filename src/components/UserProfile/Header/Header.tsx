import styles from "./styles.module.scss";
import testBanner from "../../../../public/test_banner.jpg";
import testProfileImage from "../../../../public/test_profile_image.jpg";
import Image from "next/image";
import Button from "@/components/UI/Button/Button";
import Star from "../../../../public/star.svg";
import { Prompt } from "next/font/google";

const prompt = Prompt({ weight: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["latin"] });

const Header = () => {
  return (
    <header className={`${styles.header}`} id="main-header">
      <div
        className={`${styles.banner}`}
        style={{
          backgroundImage: `url("${testBanner.src}")`,
        }}>
        <div className={`${styles.profileImage}`}>
          <Image src={testProfileImage} alt="Zdjęcie użytkownika"></Image>
        </div>
      </div>
      <div className={`${styles.wrapper}`}>
        <div className={`${styles.userData}`}>
          <p className={`${styles.username}`}>Disney+</p>
          <p className={`${styles.id}`}>@Disneyplus</p>
          <p className={`${styles.proffesion}`}>Świętuj historie, które kochasz. 💙</p>
          <Button>Napisz wiadomość</Button>
        </div>
        <div className={`${styles.wrapper}`}>
          <div className={`${styles.wrapper2}`}>
            <div className={`${styles.opinionRate}`}>
              <p className={`${prompt.className}`}>5,4</p>
              <Image src={Star} alt="Ikona gwiazdki"></Image>
            </div>
            <p className={`${prompt.className}`}>7 852 opinii</p>
          </div>
          <div className={`${styles.wrapper1}`}>
            <div className={`${styles.wrapper}`}>
              <p>12K</p>
              <p>Obserwujących</p>
            </div>
            <div className={`${styles.wrapper}`}>
              <p>143</p>
              <p>Obserwuje</p>
            </div>
          </div>
          <Button>Obserwuj</Button>
        </div>
      </div>
      <div className={`${styles.socialLinks}`}>
        <ul>
          <li>
            <a href="https://www.facebook.com/disney">https://www.facebook.com/disney</a>
          </li>
          <li>
            <a href="https://www.instagram.com/disney">https://www.instagram.com/disney</a>
          </li>
          <li>
            <a href="https://www.linkedin.com/in/disney">https://www.linkedin.com/in/disney</a>
          </li>
        </ul>
      </div>
      <nav>
        <button className={`${prompt.className} ${styles.active}`}>Posty</button>
        <button className={`${prompt.className}`}>Informacje</button>
        <button className={`${prompt.className}`}>Zdjęcia</button>
        <button className={`${prompt.className}`}>Wzmianki</button>
      </nav>
    </header>
  );
};

export default Header;
