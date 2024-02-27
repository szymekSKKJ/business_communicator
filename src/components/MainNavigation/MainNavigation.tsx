"use client";

import styles from "./styles.module.scss";
import main_navigation_logo from "../../../public/main_navigation_logo.svg";
import Image from "next/image";
import { user } from "@/app/api/user/types";
import { useState } from "react";

interface componentProps {
  currentUser: user | null;
}

const MainNavigation = ({ currentUser }: componentProps) => {
  const [sidebarState, setSidebarState] = useState<{ isOpen: boolean; content: "messages" | "notifications" | null }>({
    isOpen: false,
    content: null,
  });

  return (
    <>
      <nav className={`${styles.mainNavigation}`}>
        <div className={`${styles.content}`}>
          <a className={`${styles.logo}`}>
            <Image src={main_navigation_logo} alt="Ikona logo"></Image>
          </a>
          <div className={`${styles.mainButtons}`}></div>
          <div className={`${styles.profileButtons}`}>
            <button
              className={`${styles.option}`}
              onClick={() => {
                setSidebarState((currentValue) => {
                  const copiedCurrentValue = structuredClone(currentValue);

                  if (copiedCurrentValue.content === "messages") {
                    if (copiedCurrentValue.isOpen) {
                      copiedCurrentValue.isOpen = false;
                      copiedCurrentValue.content = null;
                    }
                  } else {
                    copiedCurrentValue.isOpen = false;
                    copiedCurrentValue.content = null;

                    setTimeout(() => {
                      setSidebarState((currentValue) => {
                        const copiedCurrentValue = structuredClone(currentValue);

                        copiedCurrentValue.isOpen = true;
                        copiedCurrentValue.content = "messages";

                        return copiedCurrentValue;
                      });
                    }, 300);
                  }

                  return copiedCurrentValue;
                });
              }}>
              <i className="fa-regular fa-envelope"></i>
            </button>
            <button
              className={`${styles.option}`}
              onClick={() => {
                setSidebarState((currentValue) => {
                  const copiedCurrentValue = structuredClone(currentValue);

                  if (copiedCurrentValue.content === "notifications") {
                    if (copiedCurrentValue.isOpen) {
                      copiedCurrentValue.isOpen = false;
                      copiedCurrentValue.content = null;
                    }
                  } else {
                    copiedCurrentValue.isOpen = false;
                    copiedCurrentValue.content = null;

                    setTimeout(() => {
                      setSidebarState((currentValue) => {
                        const copiedCurrentValue = structuredClone(currentValue);

                        copiedCurrentValue.isOpen = true;
                        copiedCurrentValue.content = "notifications";

                        return copiedCurrentValue;
                      });
                    }, 300); // Animation time
                  }

                  return copiedCurrentValue;
                });
              }}>
              <i className="fa-regular fa-bell"></i>
            </button>
            <button className={`${styles.profileImage}`}>
              <Image src={currentUser ? currentUser.profileImage : ""} alt="Zdjęcie użytkownika" width={44} height={44}></Image>
            </button>
          </div>
        </div>
      </nav>
      <div className={`${styles.sidebar} ${sidebarState.isOpen ? styles.open : ""}`}>
        <p>123</p>
        <p>123</p>
        <p>123</p>
        <p>123</p>
        <p>123</p>
        <p>123</p>
      </div>
    </>
  );
};

export default MainNavigation;
