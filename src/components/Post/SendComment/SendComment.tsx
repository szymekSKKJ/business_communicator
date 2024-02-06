"use client";

import Textarea from "@/components/UI/Textarea/Textarea";
import styles from "./styles.module.scss";
import Image from "next/image";
import Button from "@/components/UI/Button/Button";
import moment from "moment";
import "moment/locale/pl";
import { useEffect, useRef } from "react";

interface componentProps {
  userImageUrl: string;
  publicId: string;
  onSend: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, textareaValue: string) => any;
  isOpen?: boolean;
}

const SendComment = ({ userImageUrl, publicId, onSend, isOpen = false }: componentProps) => {
  const textareaElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        const spanElement = textareaElementRef.current!.firstChild as HTMLSpanElement;
        spanElement.focus();
      }, 500);
    }
  }, [isOpen]);

  return (
    <div className={`${styles.sendComment} ${isOpen ? styles.open : ""}`}>
      <div className={`${styles.userData}`}>
        <div className={`${styles.wrapper1}`}>
          <Image src={userImageUrl} alt="Zdjęcie autora postu" width={64} height={64}></Image>
        </div>
        <div className={`${styles.wrapper2}`}>
          <p>{publicId}</p>
          <p>{moment(new Date()).locale("pl").fromNow()}</p>
        </div>
      </div>
      <Textarea refProp={textareaElementRef} id="textarea" placeholder="Napisz komentarz"></Textarea>
      <Button
        onClick={async (event) => {
          const textareaValue = textareaElementRef.current!.innerText;
          const textareaValueElement = textareaElementRef.current!.firstChild! as HTMLElement;
          await onSend(event, textareaValue);
          textareaValueElement.innerText = "";
        }}>
        Wyślij
      </Button>
    </div>
  );
};

export default SendComment;
