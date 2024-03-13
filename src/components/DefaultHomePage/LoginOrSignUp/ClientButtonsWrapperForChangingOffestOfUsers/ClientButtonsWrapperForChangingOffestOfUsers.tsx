"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.scss";

const ClientButtonsWrapperForChangingOffestOfUsers = () => {
  const [offset, setOffest] = useState(0);

  const usersElementRef = useRef<null | HTMLDivElement>(null);
  const componentElementRef = useRef<null | HTMLDivElement>(null);
  const forwardButtonElementRef = useRef<null | HTMLButtonElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (componentElementRef.current) {
      const usersWrapperElement = componentElementRef.current.parentElement!.children[1].firstChild as HTMLDivElement;
      usersElementRef.current = usersWrapperElement;
    }
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      forwardButtonElementRef.current?.click();
    }, 4000);

    return () => {
      clearInterval(intervalRef.current!);
    };
  }, []);

  return (
    <div className={`${styles.clientButtonsWrapperForChangingOffestOfUsers}`} ref={componentElementRef}>
      <button
        onClick={() => {
          const userCardWidth = parseInt(getComputedStyle(usersElementRef.current!).getPropertyValue("--userCard-width"));
          const visibleCardCount = Math.round(usersElementRef.current!.parentElement!.getBoundingClientRect().width / userCardWidth);
          const gap = parseInt(getComputedStyle(usersElementRef.current!).getPropertyValue("gap"));
          const elementsInside = usersElementRef.current!.childNodes.length + 1;
          const updatedVisibleCardCount = visibleCardCount > elementsInside ? elementsInside : visibleCardCount;

          setOffest((currentValue) => {
            const currentValueAfter = currentValue === 0 ? elementsInside - updatedVisibleCardCount : currentValue - 1;

            usersElementRef.current!.style.transform = `translateX(-${currentValueAfter * (userCardWidth + gap)}px)`;

            return currentValueAfter;
          });
        }}>
        <i className="fa-solid fa-caret-left"></i>
      </button>
      <button
        ref={forwardButtonElementRef}
        onClick={() => {
          const userCardWidth = parseInt(getComputedStyle(usersElementRef.current!).getPropertyValue("--userCard-width"));
          const visibleCardCount = Math.round(usersElementRef.current!.parentElement!.getBoundingClientRect().width / userCardWidth);
          const gap = parseInt(getComputedStyle(usersElementRef.current!).getPropertyValue("gap"));
          const elementsInside = usersElementRef.current!.childNodes.length + 1;
          const updatedVisibleCardCount = visibleCardCount > elementsInside ? elementsInside : visibleCardCount;

          //   const gap =
          //     (usersElementRef.current!.parentElement!.getBoundingClientRect().width - visibleCardCount * parseInt(userCardWidth)) / (visibleCardCount - 1);

          //   const correctedGap = gap < 0 ? 0 : gap;

          setOffest((currentValue) => {
            const currentValueAfter = currentValue === elementsInside - updatedVisibleCardCount ? 0 : currentValue + 1;

            usersElementRef.current!.style.transform = `translateX(-${currentValueAfter * (userCardWidth + gap)}px)`;

            return currentValueAfter;
          });
        }}>
        <i className="fa-solid fa-caret-right"></i>
      </button>
    </div>
  );
};

export default ClientButtonsWrapperForChangingOffestOfUsers;
