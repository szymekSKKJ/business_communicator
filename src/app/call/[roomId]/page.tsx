"use client";

import styles from "./styles.module.scss";
import User from "@/components/callPage/User/User";
import { useEffect, useRef, useState } from "react";
import { getSession } from "next-auth/react";
import { userSmallData } from "@/app/api/user/types";
import { socketSignal } from "@/components/WebSocketBackgroundActions/WebSocketBackgroundActions";
import { useSignals } from "@preact/signals-react/runtime";
import { userGetByIdSmallData } from "@/app/api/user/getByIdSmallData/[id]/route";
import { sessionUser } from "@/app/api/auth/[...nextauth]/route";
import Image from "next/image";
import Button from "@/components/UI/Button/Button";

const callPage = ({ params: { roomId } }: { params: { roomId: string } }) => {
  useSignals();

  const [roomUsers, setRoomUsers] = useState<userSmallData[]>([]);
  const [isSocketAvailable, setIsSocketAvailable] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [streamLocal, setSreamLocal] = useState<null | MediaStream>(null);
  const [lastRefusedCallFromUser, setLastRefusedCallFromUse] = useState<null | userSmallData>(null);
  const [isLocalStreamMuted, setIsLocalStreamMuted] = useState(false);
  const [isLocalVideoStreamOn, setIsLocalVideoStreamOn] = useState(false);

  const [streamLocalVideo, setStreamLocalVideo] = useState<null | MediaStream>(null);

  useEffect(() => {
    if (socketSignal.value) {
      setIsSocketAvailable(true);
    }
  }, [socketSignal.value]);

  useEffect(() => {
    (async () => {
      const streamLocal = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 360 },
          frameRate: { ideal: 60, min: 30 },
        },
        audio: {
          autoGainControl: false,
          echoCancellation: false,
          noiseSuppression: true,
        },
      });

      streamLocal.getVideoTracks()[0].enabled = false;

      setSreamLocal(streamLocal);
    })();

    return () => {
      if (streamLocal) {
        streamLocal.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (isSocketAvailable) {
      const socket = socketSignal.value!;

      socket.on("userJoined", async (data: { userId: string }) => {
        const { userId } = data;

        const userDataResponse = await userGetByIdSmallData(userId);

        if (userDataResponse.data) {
          setRoomUsers((currentValue) => {
            const copiedCurrentValue = structuredClone(currentValue);

            copiedCurrentValue.push(userDataResponse.data!);

            return copiedCurrentValue;
          });
        }
      });

      socket.on("userDisconected", (data: { userId: string }) => {
        const { userId } = data;

        setRoomUsers((currentValue) => {
          const copiedCurrentValue = structuredClone(currentValue);

          const foundUserIndex = copiedCurrentValue.findIndex((data) => data.id === userId);

          copiedCurrentValue.splice(foundUserIndex, 1);

          return copiedCurrentValue;
        });
      });

      socket.on("callRefused", async (data: { userId: string }) => {
        const { userId } = data;

        const userDataResponse = await userGetByIdSmallData(userId);

        if (userDataResponse.data) {
          setLastRefusedCallFromUse(userDataResponse.data);
        }
      });

      (async () => {
        const currentUserSession = await getSession();
        const currentUser = (currentUserSession?.user as sessionUser) || null;
        setCurrentUserId(currentUser.id);

        if (currentUser) {
          socket.emit("joinToRoom", { roomId: roomId, userId: currentUser.id });
        }
      })();
    }
  }, [isSocketAvailable]);

  return (
    <div className={`${styles.callPage}`}>
      {isSocketAvailable && streamLocal && currentUserId && (
        <>
          <div className={`${styles.users}`}>
            {roomUsers.map((userData) => {
              return (
                <User
                  key={userData.id}
                  streamLocalVideo={streamLocalVideo}
                  roomId={roomId}
                  currentUserId={currentUserId!}
                  data={userData}
                  streamLocal={streamLocal}></User>
              );
            })}
          </div>
          {lastRefusedCallFromUser && (
            <div className={`${styles.refusedCall}`}>
              <div className={`${styles.content}`}>
                <div className={styles.userData}>
                  <span>
                    Użytkownik {lastRefusedCallFromUser.publicId}{" "}
                    <div className={`${styles.imageWrapper}`}>
                      <Image src={`${lastRefusedCallFromUser.profileImage}`} width={32} height={32} alt="Zdjęcie użytkownika"></Image>{" "}
                    </div>
                    Odrzucił połączenie
                  </span>
                </div>
                <div className={`${styles.butttonsWrapper}`}>
                  <Button
                    onClick={() => {
                      socketSignal.value!.emit("callTo", {
                        roomId: roomId,
                        userId: currentUserId,
                        callingToUserId: lastRefusedCallFromUser.id,
                      });
                      setLastRefusedCallFromUse(null);
                    }}>
                    Zadzwoń ponownie
                  </Button>
                  <Button
                    themeType="red-white"
                    onClick={() => {
                      window.close();
                    }}>
                    Opuść spotkanie
                  </Button>
                </div>
              </div>
            </div>
          )}
          <div className={`${styles.controls}`}>
            <button
              className={`${isLocalStreamMuted ? styles.red : ""}`}
              onClick={() => {
                setIsLocalStreamMuted((currentValue) => {
                  if (currentValue === false) {
                    streamLocal.getAudioTracks()[0].enabled = false;

                    return true;
                  } else {
                    streamLocal.getAudioTracks()[0].enabled = true;

                    return false;
                  }
                });
              }}>
              <i className={`fa-solid fa-microphone${isLocalStreamMuted ? "-slash" : ""}`}></i>
            </button>
            <button>
              <i className="fa-solid fa-desktop"></i>
            </button>
            <button
              className={`${isLocalVideoStreamOn ? styles.red : ""}`}
              onClick={async () => {
                // const streamLocalVideo = await navigator.mediaDevices.getUserMedia({
                //   video: true,
                //   audio: false,
                // });
                // setStreamLocalVideo(streamLocalVideo);

                setIsLocalVideoStreamOn((currentValue) => {
                  if (currentValue === false) {
                    streamLocal.getVideoTracks()[0].enabled = true;

                    return true;
                  } else {
                    streamLocal.getVideoTracks()[0].enabled = false;

                    return false;
                  }
                });
              }}>
              <i className="fa-solid fa-camera"></i>
            </button>
            <button
              className={`${styles.red}`}
              onClick={() => {
                window.close();
              }}>
              <i className="fa-solid fa-phone-flip"></i>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default callPage;
