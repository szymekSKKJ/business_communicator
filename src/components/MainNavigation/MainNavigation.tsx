"use client";

import styles from "./styles.module.scss";
import main_navigation_logo from "../../../public/main_navigation_logo.svg";
import Image from "next/image";
import { user } from "@/app/api/user/types";
import { useEffect, useState } from "react";
import { chatRoomGetSome } from "@/app/api/chatRoom/getSome/[userId]/route";
import { openNewMessageUserWindow } from "../WebSocketBackgroundActions/MessagesUserWindows/MessagesUserWindows";
import { socketSignal } from "../WebSocketBackgroundActions/WebSocketBackgroundActions";
import { signal } from "@preact/signals";
import { useSignals } from "@preact/signals-react/runtime";

const notificationMessageToClearChatRoomIdSignal = signal<null | string>(null);

export const clearMainNavigationNotificationMessage = (chatRoomId: string) => {
  notificationMessageToClearChatRoomIdSignal.value = chatRoomId;
};

const sidebarTitles = [
  {
    key: "messages",
    value: "Wiadomości",
  },
  {
    key: "notifications",
    value: "Powiadomienia",
  },
];

interface componentProps {
  currentUser: user;
}

const MainNavigation = ({ currentUser }: componentProps) => {
  useSignals();

  const [sidebarState, setSidebarState] = useState<{ isOpen: boolean; content: "messages" | "notifications" | null }>({
    isOpen: false,
    content: null,
  });
  const [lastMessages, setLastMessages] = useState<
    {
      isRead: boolean;
      chatRoomId: string;
      user: {
        id: string;
        publicId: string;
        profileImage: string;
        lastMessage: {
          content: string;
          sentAt: Date;
          lastActive: Date;
        };
      };
    }[]
  >([]);
  const [isSocketAvailable, setIsSocketAvailable] = useState(false);

  useEffect(() => {
    if (notificationMessageToClearChatRoomIdSignal.value) {
      const roomIdToClear = structuredClone(notificationMessageToClearChatRoomIdSignal.value);

      setLastMessages((currentValue) => {
        const copiedValue = structuredClone(currentValue);
        const foundValue = copiedValue.find((data) => data.isRead === false && data.chatRoomId === roomIdToClear);

        if (foundValue) {
          foundValue.isRead = true;
        }

        return copiedValue;
      });

      notificationMessageToClearChatRoomIdSignal.value = null;
    }
  }, [notificationMessageToClearChatRoomIdSignal.value]);

  useEffect(() => {
    if (socketSignal.value) {
      setIsSocketAvailable(true);
    }
  }, [socketSignal.value]);

  useEffect(() => {
    if (socketSignal.value) {
      socketSignal.value.on("mainNavigationNotificationMessage", async ({ fromUserId, chatRoomId }: { fromUserId: string; chatRoomId: string }) => {
        const response = await chatRoomGetSome(currentUser.id, 1);

        if (response.data) {
          const formattedData = response.data.map((data) => {
            const { lastReadMessage, lastChatRoomMessage, participants, chatRoomId } = data;

            const foundParticipant = participants.find((data) => data.id !== currentUser.id)!;

            return {
              isRead: false,
              chatRoomId: chatRoomId,
              user: {
                id: foundParticipant.id,
                publicId: foundParticipant.publicId!,
                profileImage: foundParticipant.id === currentUser.id ? currentUser.profileImage! : foundParticipant.profileImage!,
                lastMessage: {
                  content: lastChatRoomMessage!.content,
                  sentAt: lastChatRoomMessage!.sentAt,
                  lastActive: foundParticipant.lastActive,
                },
              },
            };
          });

          setLastMessages((currentValue) => {
            const copiedValue = structuredClone(currentValue);

            const newValue = copiedValue.map((data) => {
              const doesThisValueAlreadyExists = formattedData.find((dataLocal) => dataLocal.user.id === data.user.id);

              if (doesThisValueAlreadyExists) {
                const thisValue = doesThisValueAlreadyExists;

                return thisValue;
              } else {
                return data;
              }
            });

            return newValue;
          });
        }
      });
    }

    return () => {
      socketSignal.value!.off("mainNavigationNotificationMessage");
    };
  }, [isSocketAvailable]);

  useEffect(() => {
    (async () => {
      const response = await chatRoomGetSome(currentUser.id);

      if (response.data) {
        const formattedData = response.data.map((data) => {
          const { lastReadMessage, lastChatRoomMessage, participants, chatRoomId } = data;

          const foundParticipant = participants.find((data) => data.id !== currentUser.id)!;

          const isRead = lastReadMessage!.id === lastChatRoomMessage.id;

          return {
            isRead: isRead,
            chatRoomId: chatRoomId,
            user: {
              id: foundParticipant.id,
              publicId: foundParticipant.publicId!,
              profileImage: foundParticipant.id === currentUser.id ? currentUser.profileImage! : foundParticipant.profileImage!,
              lastMessage: {
                content: lastChatRoomMessage!.content,
                sentAt: lastChatRoomMessage!.sentAt,
                lastActive: foundParticipant.lastActive,
              },
            },
          };
        });

        setLastMessages(formattedData);
      }
    })();
  }, []);

  useEffect(() => {
    const click = () => {
      setSidebarState({ isOpen: false, content: null });
    };

    window.addEventListener("click", click);

    return () => {
      window.removeEventListener("click", click);
    };
  }, []);

  const foundTitleForSidebar = sidebarState.content === null ? "" : sidebarTitles.find((data) => sidebarState.content === data.key)!.value;

  const notReadMessagesCounter = lastMessages.filter((data) => data.isRead === false).length;

  return (
    <>
      {window.location.pathname.includes("call") === false && (
        <div className={`${styles.navigationWrapper}`}>
          <nav className={`${styles.mainNavigation}`}>
            <div className={`${styles.content}`}>
              <a className={`${styles.logo}`}>
                <Image src={main_navigation_logo} alt="Ikona logo"></Image>
              </a>
              <div className={`${styles.mainButtons}`}></div>
              <div className={`${styles.profileButtons}`}>
                <button
                  className={`${styles.option}`}
                  onClick={(event) => {
                    event.stopPropagation();

                    setSidebarState((currentValue) => {
                      const copiedCurrentValue = structuredClone(currentValue);

                      if (copiedCurrentValue.content === "messages") {
                        if (copiedCurrentValue.isOpen) {
                          copiedCurrentValue.isOpen = false;
                        }
                      } else {
                        if (copiedCurrentValue.content === null) {
                          copiedCurrentValue.isOpen = true;
                          copiedCurrentValue.content = "messages";
                        } else {
                          copiedCurrentValue.isOpen = false;

                          setTimeout(() => {
                            setSidebarState((currentValue) => {
                              const copiedCurrentValue = structuredClone(currentValue);

                              copiedCurrentValue.isOpen = true;
                              copiedCurrentValue.content = "messages";

                              return copiedCurrentValue;
                            });
                          }, 300);
                        }
                      }

                      return copiedCurrentValue;
                    });
                  }}>
                  <i className="fa-regular fa-envelope"></i>
                  <div className={`${styles.counter} ${notReadMessagesCounter === 0 ? "" : styles.notRead}`}>
                    <p>{lastMessages.filter((data) => data.isRead === false).length}</p>
                  </div>
                </button>
                <button
                  className={`${styles.option}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    setSidebarState((currentValue) => {
                      const copiedCurrentValue = structuredClone(currentValue);

                      if (copiedCurrentValue.content === "notifications") {
                        if (copiedCurrentValue.isOpen) {
                          copiedCurrentValue.isOpen = false;
                        }
                      } else {
                        if (copiedCurrentValue.content === null) {
                          copiedCurrentValue.isOpen = true;
                          copiedCurrentValue.content = "notifications";
                        } else {
                          copiedCurrentValue.isOpen = false;

                          setTimeout(() => {
                            setSidebarState((currentValue) => {
                              const copiedCurrentValue = structuredClone(currentValue);

                              copiedCurrentValue.isOpen = true;
                              copiedCurrentValue.content = "notifications";

                              return copiedCurrentValue;
                            });
                          }, 300);
                        }
                      }

                      return copiedCurrentValue;
                    });
                  }}>
                  <i className="fa-regular fa-bell"></i>
                  {/* <div className={`${styles.counter} ${notReadMessagesCounter === 0 ? "" : styles.notRead}`}>
                    <p>{lastMessages.filter((data) => data.isRead === false).length}</p>
                  </div> */}
                </button>
                <button className={`${styles.profileImage}`}>
                  <Image src={currentUser ? currentUser.profileImage : ""} alt="Zdjęcie użytkownika" width={44} height={44}></Image>
                </button>
              </div>
            </div>
          </nav>
          <div className={`${styles.sidebar} ${sidebarState.isOpen ? styles.open : ""}`}>
            <h2>{foundTitleForSidebar}</h2>
            <div className={`${styles.content}`}>
              {sidebarState.content === "messages" &&
                lastMessages.map((data) => {
                  const {
                    isRead,
                    user: {
                      profileImage,
                      publicId,
                      id,
                      lastMessage: { lastActive, content },
                    },
                  } = data;

                  return (
                    <div
                      key={id}
                      className={`${styles.field} ${isRead === false ? styles.notRead : ""}`}
                      onClick={() => {
                        openNewMessageUserWindow([currentUser.id, data.user.id]);
                        setLastMessages((currentValue) => {
                          const copiedCurrentValue = structuredClone(currentValue);

                          const foundValue = copiedCurrentValue.find((data) => data.user.id === id)!;

                          foundValue.isRead = true;

                          return copiedCurrentValue;
                        });
                      }}>
                      <div className={`${styles.imageWrapper}`}>
                        <Image src={profileImage} alt="Zdjęcie użytkownika" width={42} height={42}></Image>
                      </div>
                      <div className={`${styles.content}`}>
                        <p className={`${styles.username} normalText`}>{publicId}</p>
                        <p className={`${styles.lastMessage} normalText`}>{content}</p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MainNavigation;
