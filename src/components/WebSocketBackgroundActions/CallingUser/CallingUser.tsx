import { user, userSmallData } from "@/app/api/user/types";
import styles from "./styles.module.scss";
import Button from "@/components/UI/Button/Button";
import Image from "next/image";
import { socketSignal } from "../WebSocketBackgroundActions";
import { Dispatch, SetStateAction, useState } from "react";

interface componentProps {
  data: {
    roomId: string;
    user: userSmallData;
  };
  currentUserId: string;
  setCallingData: Dispatch<
    SetStateAction<null | {
      roomId: string;
      user: userSmallData;
    }>
  >;
}

const CallingUser = ({ data, setCallingData, currentUserId }: componentProps) => {
  const [isClosing, setIsClosing] = useState(false);

  const { user, roomId } = data;

  return (
    <div className={`${styles.wrapper} ${isClosing ? styles.closing : ""}`}>
      <div className={`${styles.content}`}>
        <div className={`${styles.user}`}>
          <div className={`${styles.imageWrapper}`}>
            <Image src={user.profileImage} alt="Zdjęcie użytkownika" width={200} height={200}></Image>
          </div>
          <p>{user.publicId}</p>
        </div>
        <div className={`${styles.butttonsWrapper}`}>
          <Button
            onClick={async () => {
              window.open(
                `${process.env.NEXT_PUBLIC_URL}/call/${roomId}`,
                "mozillaWindow",
                `popup, width=${screen.width * 0.75}, height=${screen.height * 0.75}, left=${screen.width * 0.5 - (screen.width * 0.75) / 2}, top=${
                  screen.height * 0.5 - (screen.height * 0.75) / 2
                }`
              );

              setCallingData(null);
            }}>
            Odbierz
          </Button>
          <Button
            themeType="red-white"
            onClick={() => {
              socketSignal.value!.emit("refuseCall", {
                toUserId: user.id,
                fromUserId: currentUserId,
              });
              setIsClosing(true);
              setTimeout(() => {
                setCallingData(null);
              }, 250); // Time of animation
            }}>
            Odrzuć
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CallingUser;
