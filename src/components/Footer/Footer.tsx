import styles from "./styles.module.scss";
import logoImage from "../../../public/logo.svg";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className={`${styles.footer}`}>
      <div className={`${styles.column}`}>
        <div className={`${styles.imageWrapper}`}>
          <Image src={logoImage} alt="Logo image"></Image>
        </div>
        <p>we connect business people around the world</p>
      </div>
      <div className={`${styles.column} ${styles.links}`}>
        <p className={`${styles.caption}`}>Caption 1</p>
        <p className={`${styles.link} normalText`}>link 1</p>
        <p className={`${styles.link} normalText`}>link 2</p>
        <p className={`${styles.link} normalText`}>link 3</p>
        <p className={`${styles.link} normalText`}>link 4</p>
      </div>
      <div className={`${styles.column} ${styles.links}`}>
        <p className={`${styles.caption}`}>Caption 2</p>
        <p className={`${styles.link} normalText`}>link 5</p>
        <p className={`${styles.link} normalText`}>link 6</p>
        <p className={`${styles.link} normalText`}>link 7</p>
        <p className={`${styles.link} normalText`}>link 8</p>
      </div>
      <div className={`${styles.column} ${styles.links}`}>
        <p className={`${styles.caption}`}>Caption 3</p>
        <p className={`${styles.link} normalText`}>link 9</p>
        <p className={`${styles.link} normalText`}>link 10</p>
        <p className={`${styles.link} normalText`}>link 11</p>
        <p className={`${styles.link} normalText`}>link 12</p>
      </div>
      <div className={`${styles.column} ${styles.links}`}>
        <p className={`${styles.caption}`}>Caption 4</p>
        <p className={`${styles.link} normalText`}>link 13</p>
        <p className={`${styles.link} normalText`}>link 14</p>
        <p className={`${styles.link} normalText`}>link 15</p>
        <p className={`${styles.link} normalText`}>link 16</p>
      </div>
    </footer>
  );
};

export default Footer;
