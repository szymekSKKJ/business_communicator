"use client";

import { signal } from "@preact/signals";
import { useLayoutEffect, useRef, useState } from "react";
import { Socket, io } from "socket.io-client";
import { user, userSmallData } from "@/app/api/user/types";
import { useSignals } from "@preact/signals-react/runtime";
import MessagesUserWindows from "./MessagesUserWindows/MessagesUserWindows";
import { userGetByIdSmallData } from "@/app/api/user/getByIdSmallData/[id]/route";
import CallingUser from "./CallingUser/CallingUser";
import { userUpdate } from "@/app/api/user/update/[id]/route";

export const socketSignal = signal<null | Socket>(null);

export const createMainNavigationNotification = (type: "message" | "global", toUserId: string, fromUserId: string, chatRoomId: string) => {
  if (socketSignal.value) {
    if (type === "message") {
      socketSignal.value.emit("mainNavigationNotificationMessage", { toUserId: toUserId, fromUserId: fromUserId, chatRoomId: chatRoomId });
    }
  }
};

interface componentProps {
  currentUser: user;
}

const WebSocketBackgroundActions = ({ currentUser }: componentProps) => {
  useSignals();

  const [callingData, setCallingData] = useState<null | {
    roomId: string;
    user: userSmallData;
  }>(null);

  useLayoutEffect(() => {
    const socket = io(`${process.env.NEXT_PUBLIC_WS_URL}`);

    socket.on("connect", () => {
      socket.emit("addUserToActive", { userId: currentUser.id });
    });

    socket.on("calling", async (data: { fromUserId: string; roomId: string }) => {
      const responseData = await userGetByIdSmallData(data.fromUserId);

      if (responseData.data) {
        setCallingData({
          roomId: data.roomId,
          user: responseData.data,
        });
      }
    });

    socketSignal.value = socket;

    (async () => {
      await userUpdate(currentUser.id);
    })();

    const interval = setInterval(async () => {
      await userUpdate(currentUser.id);
    }, 1000 * 60 * 2);

    return () => {
      socket.off("calling");
      socket.disconnect();
      clearInterval(interval);
    };
  }, []);

  return (
    socketSignal.value && (
      <>
        <MessagesUserWindows currentUser={currentUser}></MessagesUserWindows>
        {callingData && <CallingUser currentUserId={currentUser.id} data={callingData} setCallingData={setCallingData}></CallingUser>}
      </>
    )
  );
};

export default WebSocketBackgroundActions;
