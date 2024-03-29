"use client";

import styles from "./styles.module.scss";
import Image from "next/image";
import Button from "@/components/UI/Button/Button";
import Star from "../../../../public/star.svg";

import { userGiveFollow } from "@/app/api/user/giveFollow/[userId]/route";
import { user } from "@/app/api/user/types";
import { useState } from "react";
import { openNewMessageUserWindow } from "@/components/WebSocketBackgroundActions/MessagesUserWindows/MessagesUserWindows";

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
          <p className={`${styles.username}`}>{userData.name}</p>
          <p className={`${styles.id}`}>@{userData.publicId}</p>
          <p className={`${styles.proffesion} normalText`}>{userData.description} </p>
          {currentUser && currentUser.id !== userData.id && (
            <Button
              onClick={() => {
                openNewMessageUserWindow([currentUser.id, userData.id]);
              }}>
              Napisz wiadomość
            </Button>
          )}
        </div>
        <div className={`${styles.wrapper}`}>
          <div className={`${styles.wrapper2}`}>
            <div className={`${styles.opinionRate}`}>
              <p>{userData.averageOpinion === null ? "Brak" : userData.averageOpinion}</p>
              <Image src={Star} alt="Ikona gwiazdki"></Image>
            </div>
            <p>
              z {userData._count.opinions} {userData._count.opinions === undefined ? "0" : ""} opinii
            </p>
          </div>
          <div className={`${styles.wrapper1}`}>
            <div className={`${styles.wrapper}`}>
              <p>{userData._count.followers}</p>
              <p>Obserwujących</p>
            </div>
            <div className={`${styles.wrapper}`}>
              <p>{userData._count.following}</p>
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
        <button className={`${styles.active} normalText`}>Posty</button>
        <button className={`normalText`}>Oferta</button>
        <button className={`normalText`}>Informacje</button>
        <button className={`normalText`}>Zdjęcia</button>
        <button className={`normalText`}>Wzmianki</button>
        <button className={`normalText`}>Obserwujących</button>
        <button className={`normalText`}>Obserwuje</button>
        <button className={`normalText`}>Opinie</button>
      </nav>
    </header>
  );
};

export default Header;
