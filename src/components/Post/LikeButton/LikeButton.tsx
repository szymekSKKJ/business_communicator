"use client";

import { ButtonHTMLAttributes, MouseEventHandler, useState } from "react";
import styles from "./styles.module.scss";

interface componentProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  currentLikes: number;
  doesCurrentUserLikesThat: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  onClickCallback?: (likesData: { currentLikes: number; value: boolean }) => any;
}

const LikeButton = ({ onClick, children, currentLikes, doesCurrentUserLikesThat, onClickCallback, className, ...rest }: componentProps) => {
  const [likesData, setLikesData] = useState({
    currentLikes: currentLikes,
    value: doesCurrentUserLikesThat,
  });
  const [isAfterFirstClick, setIsAfterFirstCick] = useState(false);

  return (
    <button
      className={`${styles.likeButton} ${className}`}
      onClick={(event) => {
        if (isAfterFirstClick === false) {
          setIsAfterFirstCick(true);
        }
        setLikesData((currentValue) => {
          const copiedCurrentValue = { ...currentValue };

          if (copiedCurrentValue.value === true) {
            copiedCurrentValue.value = false;
            copiedCurrentValue.currentLikes = copiedCurrentValue.currentLikes - 1;
          } else {
            copiedCurrentValue.value = true;
            copiedCurrentValue.currentLikes = copiedCurrentValue.currentLikes + 1;
          }

          return copiedCurrentValue;
        });

        onClick && onClick(event);
        onClickCallback && onClickCallback(likesData);
      }}
      {...rest}>
      <i
        aria-hidden
        className={`fa-heart ${likesData.value ? `fa-solid ${styles.faSolid}` : "fa-regular"} ${isAfterFirstClick ? styles.afterFirstClick : ""}`}></i>{" "}
      Polub <span>{likesData.currentLikes}</span>
    </button>
  );
};

export default LikeButton;
