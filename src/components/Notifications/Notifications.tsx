"use client";

import styles from "./styles.module.scss";
import { useSignals } from "@preact/signals-react/runtime";

import { signal } from "@preact/signals";
import { useState } from "react";

type notification = { id: string; content: string; type: string; additional: string[]; isOpen: boolean };

const notifications = signal<notification[]>([]);

export const createNotification = (content: string, type: "success" | "failure" = "success", additional: string[] = []) => {
  const generatedId = self.crypto.randomUUID();

  notifications.value = [
    ...notifications.value,
    {
      isOpen: false,
      id: generatedId,
      type: type,
      content: content,
      additional: additional,
    },
  ];

  setTimeout(() => {
    const copiedNotifications = [...notifications.value];

    const foundNotification = copiedNotifications[copiedNotifications.findIndex((notificationData) => notificationData.id === generatedId)];

    if (foundNotification.isOpen === false) {
      copiedNotifications.splice(
        copiedNotifications.findIndex((notificationData) => notificationData.id === generatedId),
        1
      );
    }

    notifications.value = copiedNotifications;
  }, 3500); // Animation time
};

const Notifications = () => {
  useSignals();
  const [isReadMoreOpen, setIsReadMoreOpen] = useState(false);

  return (
    <>
      {notifications.value.map((notificationData) => {
        const { id, content, type, additional } = notificationData;

        return (
          <div key={id}>
            <div
              className={`${styles.notification} ${type === "failure" ? styles.failure : ""}`}
              onClick={() => {
                if (additional.length !== 0) {
                  setIsReadMoreOpen((currentValue) => (currentValue === false ? true : false));
                  const copiedNotifications = [...notifications.value];

                  const foundNotification = copiedNotifications.find((notificationData) => notificationData.id === id)!;

                  foundNotification.isOpen = true;

                  notifications.value = copiedNotifications;
                }
              }}>
              <p>{content}</p>
            </div>
            {isReadMoreOpen && (
              <div
                className={`${styles.readMore}`}
                onClick={() => {
                  setIsReadMoreOpen(false);

                  const copiedNotifications = [...notifications.value];

                  copiedNotifications.splice(
                    copiedNotifications.findIndex((notificationData) => notificationData.id === id),
                    1
                  );

                  notifications.value = copiedNotifications;
                }}>
                <div className={`${styles.content}`} onClick={(event) => event.stopPropagation()}>
                  {additional.map((additionalData, index) => {
                    return <p key={index}>{additionalData}</p>;
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};

export default Notifications;
