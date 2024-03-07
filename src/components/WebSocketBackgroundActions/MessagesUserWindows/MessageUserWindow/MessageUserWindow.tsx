"use client";

import Image from "next/image";
import styles from "./styles.module.scss";
import moment from "moment";
import "moment/locale/pl";
import sendIcon from "../../../../../public/chat_window/send.svg";

import { Dispatch, MutableRefObject, SetStateAction, useEffect, useRef, useState } from "react";
import { messageCreate } from "@/app/api/message/create/[userId]/route";
import { user } from "@/app/api/user/types";

import { Socket } from "socket.io-client";
import { userGetLastActive } from "@/app/api/user/getLastActive/[id]/route";
import { createMainNavigationNotification, socketSignal } from "@/components/WebSocketBackgroundActions/WebSocketBackgroundActions";
import { Noto_Sans } from "next/font/google";
import { chatRoomGetByParticipantsId, initialRoomData } from "@/app/api/chatRoom/getByParticipantsId/route";
import { chatRoomUpdateReadBy } from "@/app/api/chatRoom/updateReadBy/[roomId]/route";
import { messaageGetSome } from "@/app/api/message/getSome/[roomId]/route";
import { clearMainNavigationNotificationMessage } from "@/components/MainNavigation/MainNavigation";
import { closeMessageUserWindow, openNewMessageUserWindow } from "../MessagesUserWindows";
import { userGetByIdSmallData } from "@/app/api/user/getByIdSmallData/[id]/route";

const noto_Sans = Noto_Sans({ weight: ["100", "300", "400", "500"], subsets: ["latin"] });

const isEmpty = (str: string) => !str || /^\s*$/.test(str);

const sendMessage = async (message: string, currentUser: user, roomId: string | null, participantsId: string[] | null = null) => {
  const messageResponse = await messageCreate(currentUser.id, message, roomId, participantsId);

  return messageResponse;
};

interface componentProps {
  initialRoomData: { id: string; isOpen: boolean; queue: number; participantsId: string[] };
  currentUser: user;
}

const MessageUserWindow = ({ initialRoomData, currentUser }: componentProps) => {
  const [roomData, setRoomData] = useState<null | initialRoomData>(null);
  const [messages, setMessages] = useState<
    {
      id: string;
      sentAt: Date;
      content: string;
      state: "from" | "to";
      pendingStatus: "pending" | "done" | "error";
      senderUserId: string;
    }[]
  >([]);

  const [isClosed, setIsClosed] = useState(false);
  const [skip, setSkip] = useState(0);
  const [isGettingMessages, setIsGettingMessages] = useState(false);
  const [areAllMessagesLoaded, setAreAllMessagesLoaded] = useState(false);
  const [scrollToBottom, setScrollToBottom] = useState(false);

  const textareaElementRef = useRef<null | HTMLSpanElement>(null);
  const messagesElementRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (roomData) {
        socketSignal.value!.on(
          "messageReceived",
          ({ message, chatRoomId, fromUserId, messageId }: { messageId: string; message: string; chatRoomId: string; fromUserId: string }) => {
            if (chatRoomId === roomData.id) {
              setMessages((currentValue) => {
                const copiedCurrentValue = structuredClone(currentValue);

                copiedCurrentValue.push({
                  id: messageId,
                  sentAt: new Date(),
                  content: message,
                  state: "from",
                  pendingStatus: "done",
                  senderUserId: fromUserId,
                });

                return copiedCurrentValue;
              });

              setScrollToBottom(true);
            }
          }
        );

        socketSignal.value!.on("messageRead", ({ messageId, chatRoomId, fromUserId }: { messageId: string; chatRoomId: string; fromUserId: string }) => {
          if (chatRoomId === roomData.id) {
            setRoomData((currentValue) => {
              const copiedCurrentValue = structuredClone(currentValue)!;

              const foundParticipant = copiedCurrentValue.participants.find((data) => data.userId === fromUserId)!;

              foundParticipant.lastReadMessageId = messageId;

              return copiedCurrentValue;
            });
          }
        });
      }
    }, 100);

    return () => {
      socketSignal.value!.off("messageRead");
      socketSignal.value!.off("messageReceived");
      clearTimeout(timeout);
    };
  }, [roomData]);

  useEffect(() => {
    (async () => {
      const roomDataResponse = await chatRoomGetByParticipantsId(initialRoomData.participantsId);

      if (roomDataResponse.data) {
        setRoomData(roomDataResponse.data);

        const formattedMessages = roomDataResponse.data.messages.map((data) => {
          const { id, sentAt, content, senderUserId } = data;

          return {
            id: id,
            sentAt: new Date(sentAt),
            content: content,
            state: senderUserId === currentUser.id ? ("to" as "to") : ("from" as "from"),
            pendingStatus: "done" as "done",
            senderUserId: senderUserId,
          };
        });

        setMessages(formattedMessages);
      } else {
        //#SKKJ Należy zoptymalizować aby nie pobierać danych aktualnego użytkownika

        const participants: {
          publicId: string | null;
          lastReadMessageId: string | null;
          lastSeenAtChat: Date | null;
          userId: string;
          profileImage: string;
          lastActive: Date;
        }[] = [];

        await Promise.all(
          initialRoomData.participantsId.map(async (id) => {
            const userSmallDataResponse = await userGetByIdSmallData(id);

            if (userSmallDataResponse.data) {
              const { profileImage, publicId, lastActive } = userSmallDataResponse.data;

              participants.push({
                publicId: publicId,
                lastReadMessageId: null,
                lastSeenAtChat: null,
                userId: id,
                profileImage: profileImage,
                lastActive: lastActive,
              });
            }
          })
        );

        setRoomData({ id: null, messages: [], participants: participants });
      }
      setScrollToBottom(true);
    })();
  }, []);

  useEffect(() => {
    if (scrollToBottom) {
      messagesElementRef.current!.scrollTo(0, messagesElementRef.current!.scrollHeight);
      setScrollToBottom(false);
    }
  }, [scrollToBottom]);

  useEffect(() => {
    if (initialRoomData.isOpen === true) {
      setIsClosed(false);
    }
  }, [initialRoomData.isOpen]);

  useEffect(() => {
    (async () => {
      if (isGettingMessages && roomData && roomData.id && areAllMessagesLoaded === false) {
        const messagesResponse = await messaageGetSome(roomData.id, currentUser.id, skip);

        if (messagesResponse.data) {
          const filteredMessages = messagesResponse.data.map((data) => {
            return {
              id: data.id,
              sentAt: new Date(data.sentAt),
              content: data.content,
              pendingStatus: "done" as "done",
              state: data.senderUserId === currentUser.id ? ("to" as "to") : ("from" as "from"),
              senderUserId: data.senderUserId,
            };
          });

          setMessages((currentValue) => {
            const copiedCurrentValue = structuredClone(currentValue);

            const filteredMessagesIdOnly = filteredMessages.map((data) => data.id);

            const newCurrentMessages = copiedCurrentValue.filter((data) => {
              if (filteredMessagesIdOnly.includes(data.id) === false) {
                return data;
              }
            });

            newCurrentMessages.push(...filteredMessages);
            return newCurrentMessages;
          });

          if (messagesResponse.data.length === 0) {
            setAreAllMessagesLoaded(true);
          }
        }

        setIsGettingMessages(false);
      }
    })();
  }, [isGettingMessages, skip]);

  moment.updateLocale("pl", {
    relativeTime: {
      s: "teraz",
    },
  });

  const userData = roomData && roomData.participants.find((data) => data.userId !== currentUser.id)!;

  const someMinutesAgo = new Date().getTime() / 1000 - 120;

  const isActiveNow = userData && someMinutesAgo - new Date(userData.lastActive).getTime() / 1000 <= 0;

  const formatedDate = userData && moment(new Date(userData.lastActive));

  formatedDate && formatedDate.locale("pl");

  const sortedMessages = messages.sort((a, b) => a.sentAt.getTime() - b.sentAt.getTime());

  return (
    <div
      className={`${styles.messageUserWindow} ${isClosed ? styles.closing : ""}`}
      onClick={async () => {
        if (roomData && roomData.id) {
          clearMainNavigationNotificationMessage(roomData.id);

          roomData.participants.forEach((data) => {
            const { userId } = data;

            if (userId !== currentUser.id) {
              socketSignal.value!.emit("messageRead", {
                fromUserId: currentUser.id,
                messageId: messages.at(-1)!.id,
                chatRoomId: roomData.id,
                toUserId: userId,
              });
            }
          });

          await chatRoomUpdateReadBy(roomData.id, currentUser.id);
        }
      }}>
      <div className={`${styles.header}`}>
        <div className={`${styles.userData} ${isActiveNow ? styles.active : ""}`}>
          <div className={`${styles.imageWrapper}`}>
            {userData && <Image src={userData.profileImage} alt="Zdjęcie użytkownika czatu" width={36} height={36}></Image>}
          </div>
          <div className={`${styles.dataWrapper}`}>
            <p className={`${styles.username} ${noto_Sans.className}`}>{userData && userData.publicId}</p>
            <p className={`${styles.lastActive} ${noto_Sans.className}`}>{isActiveNow ? "Aktywny" : formatedDate && formatedDate.fromNow(false)}</p>
          </div>
        </div>
        <div className={`${styles.options}`}>
          <button
            className={`${styles.call}`}
            onClick={() => {
              if (userData) {
                const generatedRoomId = crypto.randomUUID();

                window.open(
                  `${process.env.NEXT_PUBLIC_URL}/call/${generatedRoomId}`,
                  "mozillaWindow",
                  `popup, width=${screen.width * 0.75}, height=${screen.height * 0.75}, left=${screen.width * 0.5 - (screen.width * 0.75) / 2}, top=${
                    screen.height * 0.5 - (screen.height * 0.75) / 2
                  }`
                );

                socketSignal.value!.emit("callTo", {
                  roomId: generatedRoomId,
                  userId: currentUser.id,
                  callingToUserId: userData.userId,
                });
              }
            }}>
            <i className="fa-solid fa-phone"></i>
          </button>
          <button
            className={`${styles.close}`}
            onClick={() => {
              setIsClosed(true);
              closeMessageUserWindow(initialRoomData.id);
            }}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>
      <div
        className={`${styles.messages}`}
        ref={messagesElementRef}
        onScroll={(event) => {
          if (isGettingMessages === false && event.currentTarget.scrollTop < event.currentTarget.scrollHeight * 0.66) {
            setIsGettingMessages(true);
            setSkip((currentValue) => currentValue + 20);
          }
        }}>
        <div className={`${styles.messagesWrapper}`}>
          {roomData &&
            sortedMessages.map((messageData) => {
              const { id, sentAt, content, state, pendingStatus, senderUserId } = messageData;

              const foundParticipantData = roomData.participants.find((data) => data.userId !== currentUser.id)!;

              return (
                <div key={id} className={`${state === "from" ? styles.from : styles.to}`}>
                  <div
                    className={`${styles.message} ${state === "from" ? styles.from : styles.to} ${
                      pendingStatus === "pending" ? styles.pending : pendingStatus === "error" ? styles.error : ""
                    }`}>
                    <div className={`${styles.imageWrapper}`}>
                      <Image
                        src={state === "from" ? foundParticipantData.profileImage : currentUser.profileImage}
                        alt="Zdjęcie użytkownika czatu"
                        width={32}
                        height={32}></Image>
                    </div>
                    <div className={`${styles.content}`}>
                      <p className="normalText">{content}</p>
                    </div>
                  </div>
                  {foundParticipantData.lastReadMessageId === id && (
                    <div className={`${styles.lastReadMessage}`}>
                      <div className={`${styles.imageWrapper}`}>
                        {userData && <Image src={userData.profileImage} alt="Zdjęcie użytkownika czatu" width={16} height={16}></Image>}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
      <div className={`${styles.sender}`}>
        <div className={`${styles.anotherInputWrapper}`} tabIndex={0}>
          <div className={`${styles.inputWrapper}`}>
            <span
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();

                  const sendButtonElement = event.currentTarget.parentElement!.parentElement!.parentElement!.querySelector("button") as HTMLButtonElement;
                  sendButtonElement.click();
                }
              }}
              contentEditable={true}
              data-placeholder={"Wiadomość"}
              role="textarea"
              ref={textareaElementRef}></span>
          </div>
        </div>
        <button
          onClick={async () => {
            const formattedMessage = textareaElementRef.current!.innerText.replace(/\s+/g, " ").trim();

            if (isEmpty(formattedMessage) === false && roomData) {
              const participantsId = roomData.participants.map((data) => data.userId);
              const generatedIdForMessage = crypto.randomUUID();

              textareaElementRef.current!.innerHTML = "";

              setMessages((currentValue) => {
                const copiedCurrentValue = structuredClone(currentValue);

                copiedCurrentValue.push({
                  id: generatedIdForMessage,
                  sentAt: new Date(),
                  content: formattedMessage,
                  state: "to",
                  pendingStatus: "pending",
                  senderUserId: currentUser.id,
                });

                return copiedCurrentValue;
              });

              const messageResponse =
                roomData.id === null
                  ? await sendMessage(formattedMessage, currentUser, roomData.id, participantsId)
                  : await sendMessage(formattedMessage, currentUser, roomData.id);

              if (messageResponse.error) {
                setMessages((currentValue) => {
                  const copiedCurrentValue = structuredClone(currentValue);

                  const foundMessageData = copiedCurrentValue.find((data) => data.id === generatedIdForMessage)!;

                  foundMessageData.pendingStatus = "error";

                  return copiedCurrentValue;
                });
              } else {
                setMessages((currentValue) => {
                  const copiedCurrentValue = structuredClone(currentValue);

                  const foundMessageData = copiedCurrentValue.find((data) => data.id === generatedIdForMessage)!;

                  foundMessageData.pendingStatus = "done";

                  return copiedCurrentValue;
                });

                roomData.participants.forEach((data) => {
                  const { userId } = data;

                  if (userId !== currentUser.id) {
                    socketSignal.value!.emit("sendMessage", {
                      fromUserId: currentUser.id,
                      toUserId: userId,
                      chatRoomId: roomData.id,
                      message: formattedMessage,
                      messageId: generatedIdForMessage,
                    });

                    socketSignal.value!.emit("messageRead", {
                      fromUserId: currentUser.id,
                      messageId: generatedIdForMessage,
                      chatRoomId: roomData.id,
                      toUserId: userId,
                    });
                  }
                });

                createMainNavigationNotification("message", userData!.userId, currentUser.id, roomData.id!);
                setScrollToBottom(true);
              }
            }
          }}>
          <Image src={sendIcon} alt="Ikonka przycisku wyślij"></Image>
        </button>
      </div>
    </div>
  );
};

export default MessageUserWindow;
