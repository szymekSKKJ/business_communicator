import styles from "./styles.module.scss";

import Image from "next/image";
import Button from "@/components/UI/Button/Button";
import Star from "../../../../public/star.svg";
import { Prompt } from "next/font/google";
import { user } from "@/types";

const prompt = Prompt({ weight: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["latin"] });

interface componentProps {
  userData: user;
}

const Header = ({ userData }: componentProps) => {
  return (
    <header className={`${styles.header}`} id="main-header">
      <div
        className={`${styles.banner}`}
        style={{
          backgroundImage: `url("${userData.backgroundImage}")`,
        }}>
        <div className={`${styles.profileImage}`}>
          <Image src={userData.profileImage} alt="Zdjęcie użytkownika" width={256} height={256}></Image>
        </div>
      </div>
      <div className={`${styles.wrapper}`}>
        <div className={`${styles.userData}`}>
          <p className={`${styles.username}`}>{userData.name}</p>
          <p className={`${styles.id}`}>@{userData.publicId}</p>
          <p className={`${styles.proffesion}`}>{userData.description} </p>
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
