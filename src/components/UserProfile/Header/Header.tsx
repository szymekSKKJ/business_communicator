"use client";

import styles from "./styles.module.scss";
import Image from "next/image";
import Button from "@/components/UI/Button/Button";
import Star from "../../../../public/star.svg";
import { Prompt } from "next/font/google";
import { sessionUser } from "@/app/api/auth/[...nextauth]/route";
import { userGiveFollow } from "@/app/api/user/giveFollow/[userId]/route";
import { user } from "@/app/api/user/types";
import { useState } from "react";
import { addUserToCurrentOpendMessagesUserWindows } from "@/components/WebSocketBackgroundActions/MessagesUserWindows/MessagesUserWindows";

const prompt = Prompt({ weight: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["latin"] });

interface componentProps {
  userData: user;
  currentUser: user | null;
}

const Header = ({ userData: userDataInit, currentUser }: componentProps) => {
  const [userData, setUserData] = useState(userDataInit);

  return (
    <header className={`${styles.header}`} id="main-header">
      <div
        className={`${styles.banner}`}
        style={{
          backgroundImage: `url("${userData.backgroundImage}")`,
        }}>
        <div className={`${styles.profileImage}`}>
          <Image src={userData.profileImage} alt="Zdjęcie użytkownika" width={200} height={200}></Image>
        </div>
      </div>
      <div className={`${styles.wrapper}`}>
        <div className={`${styles.userData}`}>
          <p className={`${styles.username} ${prompt.className}`}>{userData.name}</p>
          <p className={`${styles.id} ${prompt.className}`}>@{userData.publicId}</p>
          <p className={`${styles.proffesion} ${prompt.className}`}>{userData.description} </p>
          {currentUser && currentUser.id !== userData.id && (
            <Button
              onClick={() => {
                addUserToCurrentOpendMessagesUserWindows(userData.id, userData.publicId!, userData.lastActive, userData.profileImage);
              }}>
              Napisz wiadomość
            </Button>
          )}
        </div>
        <div className={`${styles.wrapper}`}>
          <div className={`${styles.wrapper2}`}>
            <div className={`${styles.opinionRate}`}>
              <p className={`${prompt.className}`}>{userData.averageOpinion === null ? "brak" : userData.averageOpinion}</p>
              <Image src={Star} alt="Ikona gwiazdki"></Image>
            </div>
            <p className={`${prompt.className}`}>{userData._count.Opinions} opinii</p>
          </div>
          <div className={`${styles.wrapper1}`}>
            <div className={`${styles.wrapper}`}>
              <p className={`${prompt.className}`}>{userData._count.followers}</p>
              <p>Obserwujących</p>
            </div>
            <div className={`${styles.wrapper}`}>
              <p className={`${prompt.className}`}>{userData._count.following}</p>
              <p>Obserwuje</p>
            </div>
          </div>
          {currentUser && currentUser.id !== userData.id && (
            <Button
              className={`${userData.doesCurrentUserFollowThisUser ? styles.following : ""}`}
              onClick={async () => {
                setUserData((currentValue) => {
                  const copiedCurrentValue = structuredClone(currentValue);

                  if (copiedCurrentValue.doesCurrentUserFollowThisUser) {
                    copiedCurrentValue._count.followers = copiedCurrentValue._count.followers - 1;
                    copiedCurrentValue.doesCurrentUserFollowThisUser = false;
                  } else {
                    copiedCurrentValue._count.followers = copiedCurrentValue._count.followers + 1;
                    copiedCurrentValue.doesCurrentUserFollowThisUser = true;
                  }

                  return copiedCurrentValue;
                });

                const response = await userGiveFollow(currentUser.id, userData.id, userData.doesCurrentUserFollowThisUser!);

                console.log(response);
              }}>
              {userData.doesCurrentUserFollowThisUser ? (
                <>
                  Obserwujsz <i aria-hidden className="fa-solid fa-heart"></i>
                </>
              ) : (
                "Obserwuj"
              )}
            </Button>
          )}
        </div>
      </div>
      <nav>
        <button className={`${prompt.className} ${styles.active}`}>Posty</button>
        <button className={`${prompt.className}`}>Informacje</button>
        <button className={`${prompt.className}`}>Zdjęcia</button>
        <button className={`${prompt.className}`}>Wzmianki</button>
        <button className={`${prompt.className}`}>Obserwujących</button>
        <button className={`${prompt.className}`}>Obserwuje</button>
        <button className={`${prompt.className}`}>Opinie</button>
      </nav>
    </header>
  );
};

export default Header;
