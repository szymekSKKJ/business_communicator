"use client";

import { useSignals } from "@preact/signals-react/runtime";
import MessageUserWindow from "./MessageUserWindow/MessageUserWindow";
import styles from "./styles.module.scss";
import { signal } from "@preact/signals-react";
import { useEffect, useState } from "react";

import { user } from "@/app/api/user/types";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { userUpdate } from "@/app/api/user/update/[id]/route";
import { socketSignal } from "../WebSocketBackgroundActions";

const currentOpenedMessagesUserWindows = signal<
  {
    queue: number;
    id: string;
    publicId: string;
    lastActive: Date;
    image: string;
  }[]
>([]);

export const addUserToCurrentOpendMessagesUserWindows = async (id: string, userPublicId: string, lastActive: Date, image: string | null = null) => {
  const isChatAlreadyOpen = currentOpenedMessagesUserWindows.value.some((userData) => userData.id === id);

  if (isChatAlreadyOpen === false) {
    const copiedCurrentValue = [...currentOpenedMessagesUserWindows.value];

    if (image === null) {
      const storage = getStorage();
      const profileImageUrl = await getDownloadURL(ref(storage, `/users/${id}/profileImage.webp`));

      copiedCurrentValue.push({
        id: id,
        queue: copiedCurrentValue.at(0) ? copiedCurrentValue.at(0)!.queue + 1 : 0,
        publicId: userPublicId,
        lastActive: lastActive,
        image: profileImageUrl,
      });
    } else {
      copiedCurrentValue.push({
        id: id,
        queue: copiedCurrentValue.at(0) ? copiedCurrentValue.at(0)!.queue + 1 : 0,
        publicId: userPublicId,
        lastActive: lastActive,
        image: image,
      });
    }

    currentOpenedMessagesUserWindows.value = copiedCurrentValue;
  } else {
    const copiedCurrentValue = [...currentOpenedMessagesUserWindows.value];

    const foundOpenedChat = copiedCurrentValue.find((userData) => userData.id === id);

    foundOpenedChat!.queue = currentOpenedMessagesUserWindows.value.at(0)!.queue + 1;

    currentOpenedMessagesUserWindows.value = copiedCurrentValue;
  }
};

export const removeUserFromCurrentOpendMessagesUserWindows = (userPublicId: string) => {
  const indexOfOpenedChat = currentOpenedMessagesUserWindows.value.findIndex((userData) => userData.publicId === userPublicId);

  if (indexOfOpenedChat !== -1) {
    const copiedValue = [...currentOpenedMessagesUserWindows.value];

    copiedValue.splice(indexOfOpenedChat, 1);

    setTimeout(() => {
      currentOpenedMessagesUserWindows.value = copiedValue;
    }, 250); // Animation time in MessageUserWindow styles
  }
};

interface componentsProps {
  currentUser: user;
}

const MessagesUserWindows = ({ currentUser }: componentsProps) => {
  const [lastReceivedMessage, setLastReceivedMessage] = useState<{
    id: string;
    content: string;
    toUserId: string | null;
  }>({
    id: "",
    content: "",
    toUserId: null,
  });

  useSignals();

  useEffect(() => {
    (async () => {
      await userUpdate(currentUser.id);
    })();

    const interval = setInterval(async () => {
      await userUpdate(currentUser.id);
    }, 1000 * 60 * 2);

    socketSignal.value!.on("receivingMessage", (message) => {
      setLastReceivedMessage(message);
      addUserToCurrentOpendMessagesUserWindows(message.toUserId, message.toUserPublicId, new Date(), null);
    });

    return () => {
      clearInterval(interval);
    };
  }, []);

  const SortedCurrentOpenedMessagesUserWindows = currentOpenedMessagesUserWindows.value.sort((a, b) => a.queue - b.queue);

  return (
    <div className={`${styles.messagesUserWindows}`}>
      {socketSignal.value &&
        SortedCurrentOpenedMessagesUserWindows.map((userData) => {
          const { publicId } = userData;

          return (
            <MessageUserWindow
              newMessage={lastReceivedMessage.toUserId === userData.id ? lastReceivedMessage : null}
              key={publicId}
              currentUser={currentUser}
              userData={userData}></MessageUserWindow>
          );
        })}
    </div>
  );
};

export default MessagesUserWindows;
