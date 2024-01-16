"use client";

import styles from "./styles.module.scss";
import testProfileImage from "../../../../public/test_profile_image.jpg";
import heartIcon from "../../../../public/post/heart.svg";
import commentIcon from "../../../../public/post/comment.svg";
import Image from "next/image";
import moment from "moment";
import { Montserrat } from "next/font/google";
import Reply from "./Reply/Reply";
import { useRef, useState } from "react";
import Textarea from "@/components/UI/Textarea/Textarea";
import Button from "@/components/UI/Button/Button";

const montserrat = Montserrat({ weight: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["latin"] });

interface componentProps {
  content: string;
  username: string;
}

const Comment = ({ content, username }: componentProps) => {
  const [areRepliesOpen, setAreRepliesOpen] = useState(false);

  const mainParentElementRef = useRef<null | HTMLDivElement>(null);

  const date = new Date();

  date.setDate(new Date().getDate() - 5);

  const formatedDate = moment(date);

  formatedDate.locale("pl");

  return (
    <div className={`${styles.comment}`} ref={mainParentElementRef}>
      <div className={`${styles.userData}`}>
        <div className={`${styles.wrapper1}`}>
          <Image src={testProfileImage} alt="Zdjęcie autora postu" width={64} height={64}></Image>
        </div>
        <div className={`${styles.wrapper2}`}>
          <p>{username}</p>
          <p>
            {formatedDate.fromNow()} o {date.toLocaleTimeString("pl-PL", { hour: "numeric", minute: "numeric" })}
          </p>
        </div>
      </div>
      <div className={`${styles.content}`}>
        <p>{content}</p>
      </div>
      <div className={`${styles.options}`}>
        <button className={`${montserrat.className}`}>
          <Image src={heartIcon} alt="Ikona"></Image> Polub <span> 123</span>
        </button>
        <button
          className={`${montserrat.className}`}
          onClick={() => {
            setAreRepliesOpen((currentValue) => (currentValue === false ? true : false));

            if (mainParentElementRef.current) {
              const textareaElement = mainParentElementRef.current.querySelector("#textarea1") as HTMLTextAreaElement;

              if (areRepliesOpen === false) {
                setTimeout(() => {
                  textareaElement.focus();
                }, 600); // Time of displaying comments animation
              }
            }
          }}>
          <Image src={commentIcon} alt="Ikona"></Image>Skomentuj <span>31</span>
        </button>
      </div>
      <div className={`${styles.replies} ${areRepliesOpen ? styles.open : ""}`}>
        <Reply></Reply>
        <Reply></Reply>
        <Reply></Reply>
        <Reply></Reply>
        <Reply></Reply>
        <Reply></Reply>
        <Reply></Reply>
        <Reply></Reply>
        <Reply></Reply>
        <Reply></Reply>
        <Reply></Reply>
        <Reply></Reply>
        <button className={`${styles.readMore}`}>Czytaj więcej</button>
        <div className={`${styles.sendComment}`}>
          <div className={`${styles.userData}`}>
            <div className={`${styles.wrapper1}`}>
              <Image src={testProfileImage} alt="Zdjęcie autora postu" width={64} height={64}></Image>
            </div>
            <div className={`${styles.wrapper2}`}>
              <p>Disney+</p>
            </div>
          </div>
          <Textarea id="textarea1" placeholder="Napisz komentarz"></Textarea>
          <Button>Wyślij</Button>
        </div>
      </div>
    </div>
  );
};

export default Comment;
