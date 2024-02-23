"use client";

import { signal } from "@preact/signals";
import { useLayoutEffect, useRef, useState } from "react";
import { Socket, io } from "socket.io-client";
import { user, userSmallData } from "@/app/api/user/types";
import { useSignals } from "@preact/signals-react/runtime";
import MessagesUserWindows from "./MessagesUserWindows/MessagesUserWindows";
import { userGetByIdSmallData } from "@/app/api/user/getByIdSmallData/[id]/route";
import CallingUser from "./CallingUser/CallingUser";

export const socketSignal = signal<null | Socket>(null);

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

    return () => {
      socket.disconnect();
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
