"use client";

import Image from "next/image";
import styles from "./styles.module.scss";
import moment from "moment";
import "moment/locale/pl";
import sendIcon from "../../../../public/chat_window/send.svg";
import { Dispatch, MutableRefObject, SetStateAction, useEffect, useRef, useState } from "react";
import { removeUserFromCurrentOpendMessagesUserWindows } from "../MessagesUserWindows";
import { messageCreate } from "@/app/api/message/create/[userId]/route";
import { user } from "@/app/api/user/types";
import { messageGetSome } from "@/app/api/message/getSome/[userId]/route";
import { Socket } from "socket.io-client";

const isEmpty = (str: string) => !str || /^\s*$/.test(str);

const sendMessage = async (
  textareaElementRef: MutableRefObject<HTMLSpanElement | null>,
  setMessages: Dispatch<
    SetStateAction<
      {
        id: string;
        sentAt: Date;
        content: string;
        state: "from" | "to";
      }[]
    >
  >,
  socket: Socket,
  currentUser: user,
  userData: {
    id: string;
    publicId: string;
    lastActive: Date;
    image: string;
    queue: number;
  },
  setScrollToBottom: Dispatch<SetStateAction<boolean>>
) => {
  const message = textareaElementRef.current!.innerText.replace(/\s+/g, " ").trim();

  if (isEmpty(message) === false) {
    await messageCreate(currentUser.id, message, userData.id);

    socket.emit("sendingMessage", {
      messageId: crypto.randomUUID(),
      fromUserId: currentUser.id,
      fromUserPublicId: currentUser.publicId,
      toUserId: userData.id,
      content: message,
    });

    setMessages((currentValue) => {
      const copiedCurrentValue = [...currentValue];

      copiedCurrentValue.push({
        id: crypto.randomUUID(),
        sentAt: new Date(),
        content: message,
        state: "to",
      });

      return copiedCurrentValue;
    });

    textareaElementRef.current!.innerText = "";
    setScrollToBottom(true);
  }
};

interface componentProps {
  currentUser: user;
  userData: {
    id: string;
    publicId: string;
    lastActive: Date;
    image: string;
    queue: number;
  };
  socket: Socket;
  newMessage: null | {
    id: string;
    content: string;
    toUserId: string | null;
  };
}

const MessageUserWindow = ({ userData, currentUser, socket, newMessage }: componentProps) => {
  const [isClosing, setIsClosing] = useState(false);
  const [messages, setMessages] = useState<
    {
      id: string;
      sentAt: Date;
      content: string;
      state: "from" | "to";
    }[]
  >([]);
  const [skip, setSkip] = useState(0);
  const [isGettingMessages, setIsGettingMessages] = useState(true);
  const [gotAllMessages, setGotAllMessages] = useState(false);
  const [scrollToBottom, setScrollToBottom] = useState(false);

  const textareaElementRef = useRef<null | HTMLSpanElement>(null);
  const messagesElementRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (newMessage) {
      setMessages((currentValue) => {
        const copiedCurrentValue = [...currentValue];

        const doesMessageAllreadyExists = copiedCurrentValue.some((message) => message.id === newMessage.id);

        if (doesMessageAllreadyExists === false) {
          copiedCurrentValue.push({
            id: newMessage.id,
            sentAt: new Date(),
            content: newMessage.content,
            state: "from",
          });
        }

        return copiedCurrentValue;
      });

      setIsClosing(false);
      setScrollToBottom(true);
    }
  }, [newMessage]);

  useEffect(() => {
    setIsClosing(false);
  }, [userData.queue]);

  useEffect(() => {
    if (gotAllMessages === false) {
      (async () => {
        const gotMessages = await messageGetSome(currentUser.id, userData.id, `${skip}`);

        if (gotMessages.data) {
          const receivedMessages = gotMessages.data.receivedMessages.map((messageData) => {
            return {
              id: messageData.id,
              sentAt: new Date(messageData.sentAt),
              content: messageData.content,
              state: "from" as "from",
            };
          });

          const sentMessages = gotMessages.data.sentMessages.map((messageData) => {
            return {
              id: messageData.id,
              sentAt: new Date(messageData.sentAt),
              content: messageData.content,
              state: "to" as "to",
            };
          });

          const sortedMessages = [...messages, ...receivedMessages, ...sentMessages].sort((a, b) => a.sentAt.getTime() - b.sentAt.getTime());

          if (receivedMessages.length === 0 && sentMessages.length === 0) {
            setGotAllMessages(true);
          }

          setMessages(sortedMessages);

          if (messages.length === 0) {
            setScrollToBottom(true);

            const scrollEnd = () => {
              setIsGettingMessages(false);
            };

            messagesElementRef.current!.addEventListener("scrollend", scrollEnd, {
              once: true,
            });
          } else {
            setIsGettingMessages(false);
          }
        }
      })();
    }
  }, [skip]);

  useEffect(() => {
    if (scrollToBottom === true) {
      setScrollToBottom(false);
      messagesElementRef.current!.scrollTo(0, messagesElementRef.current!.scrollHeight);
    }
  }, [scrollToBottom]);

  const lastActive = new Date(userData.lastActive);

  moment.updateLocale("pl", {
    relativeTime: {
      s: "teraz",
    },
  });

  const someMinutesAgo = new Date().getTime() / 1000 - 120;

  const formatedDate = moment(lastActive);

  formatedDate.locale("pl");

  const sortedMessages = messages.sort((a, b) => a.sentAt.getTime() - b.sentAt.getTime());

  return (
    <div className={`${styles.messageUserWindow} ${isClosing ? styles.closing : ""}`}>
      <div className={`${styles.header}`}>
        <div className={`${styles.userData}`}>
          <div className={`${styles.imageWrapper}`}>
            <Image src={userData.image} alt="Zdjęcie użytkownika czatu" width={36} height={36}></Image>
          </div>
          <div className={`${styles.dataWrapper}`}>
            <p className={`${styles.username}`}>{userData.publicId}</p>
            <p className={`${styles.lastActive}`}>{formatedDate.fromNow(someMinutesAgo - lastActive.getTime() / 1000 <= 120 ? true : false)}</p>
          </div>
        </div>
        <div className={`${styles.options}`}>
          <button className={`${styles.call}`}>
            <i className="fa-solid fa-phone"></i>
          </button>
          <button
            className={`${styles.close}`}
            onClick={() => {
              setIsClosing(true);
              //removeUserFromCurrentOpendMessagesUserWindows(userData.publicId);
            }}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>
      <div
        className={`${styles.messages}`}
        ref={messagesElementRef}
        onScroll={(event) => {
          if (isGettingMessages === false && event.currentTarget.scrollTop < (event.currentTarget.scrollHeight - event.currentTarget.clientHeight) * 0.5) {
            setIsGettingMessages(true);
            setSkip((currentValue) => currentValue + 20);
          }
        }}>
        <div className={`${styles.messagesWrapper}`}>
          {sortedMessages.map((messageData) => {
            const { id, sentAt, content, state } = messageData;

            return (
              <div className={`${styles.message} ${state === "from" ? styles.from : styles.to}`} key={id}>
                <div className={`${styles.imageWrapper}`}>
                  <Image src={state === "from" ? userData.image : currentUser.profileImage} alt="Zdjęcie użytkownika czatu" width={32} height={32}></Image>
                </div>
                <div className={`${styles.content}`}>
                  <p>{content}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className={`${styles.sender}`}>
        <div className={`${styles.anotherInputWrapper}`}>
          <div className={`${styles.inputWrapper}`}>
            <span
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  sendMessage(textareaElementRef, setMessages, socket, currentUser, userData, setScrollToBottom);
                }
              }}
              contentEditable={true}
              data-placeholder={"Wiadomość"}
              role="textarea"
              ref={textareaElementRef}></span>
          </div>
        </div>
        <button
          onClick={() => {
            sendMessage(textareaElementRef, setMessages, socket, currentUser, userData, setScrollToBottom);
          }}>
          <Image src={sendIcon} alt="Ikonka przycisku wyślij"></Image>
        </button>
      </div>
    </div>
  );
};

export default MessageUserWindow;
