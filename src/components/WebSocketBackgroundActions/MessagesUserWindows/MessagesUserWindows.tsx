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
import { chatRoomGetByParticipantsId, initialRoomData } from "@/app/api/chatRoom/getByParticipantsId/route";
import { userGetByIdSmallData } from "@/app/api/user/getByIdSmallData/[id]/route";

const initialRoomsDataSignal = signal<{ id: string; isOpen: boolean; queue: number; participantsId: string[] }[]>([]);

export const openNewMessageUserWindow = async (participantsId: string[], chatRoomId: string | null = null) => {
  const copiedValue = structuredClone(initialRoomsDataSignal.value);

  const queueValue = copiedValue.at(-1) ? copiedValue.at(-1)!.queue : 1;

  const doesChatRoomAlreadyExistByParticipantsId = copiedValue.find((data) => {
    const { participantsId: participantsIdLocal } = data;

    const isEveryParticipantThisSame = participantsIdLocal.every((id) => {
      if (participantsId.includes(id)) {
        return true;
      } else {
        return false;
      }
    });

    if (isEveryParticipantThisSame) {
      return true;
    } else {
      return false;
    }
  });

  const doesChatRoomAlreadyExistByChatRoomId = copiedValue.find((data) => data.id === chatRoomId);

  const isWindowAlreadyOpened = doesChatRoomAlreadyExistByParticipantsId !== undefined || doesChatRoomAlreadyExistByChatRoomId;

  if (isWindowAlreadyOpened) {
    const foundRoomData = doesChatRoomAlreadyExistByParticipantsId ? doesChatRoomAlreadyExistByParticipantsId : doesChatRoomAlreadyExistByChatRoomId!;

    foundRoomData.isOpen = true;
  } else {
    copiedValue.push({
      id: crypto.randomUUID(),
      participantsId,
      queue: queueValue,
      isOpen: true,
    });
  }

  initialRoomsDataSignal.value = copiedValue;

  // const roomDataResponse = await chatRoomGetByParticipantsId(participantsId);
};

export const closeMessageUserWindow = (initialChatRoomId: string | null) => {
  const copiedValue = structuredClone(initialRoomsDataSignal.value);

  copiedValue.forEach((data) => {
    const { id } = data;

    if (id === initialChatRoomId) {
      data.isOpen = false;
    }
  });

  initialRoomsDataSignal.value = copiedValue;
};

interface componentsProps {
  currentUser: user;
}

const MessagesUserWindows = ({ currentUser }: componentsProps) => {
  useSignals();

  useEffect(() => {
    socketSignal.value!.on("messageReceived", ({ message, chatRoomId, fromUserId }: { message: string; chatRoomId: string; fromUserId: string }) => {
      openNewMessageUserWindow([currentUser.id, fromUserId], chatRoomId);
    });
  }, []);

  return (
    <div className={`${styles.messagesUserWindows}`}>
      {initialRoomsDataSignal.value.map((roomData) => {
        return <MessageUserWindow key={roomData.id} initialRoomData={roomData} currentUser={currentUser}></MessageUserWindow>;
      })}
    </div>
  );
};

export default MessagesUserWindows;
