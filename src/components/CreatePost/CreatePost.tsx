"use client";

import moment from "moment";
import Button from "../UI/Button/Button";
import Textarea from "../UI/Textarea/Textarea";
import styles from "./styles.module.scss";
import Image from "next/image";
import "moment/locale/pl";
import imageIcon from "../../../public/create_post/image.svg";
import { useRef, useState } from "react";
import closeIcon from "../../../public/create_post/close.svg";
import { postCreate } from "@/app/api/post/create/[userId]/route";
import Loader from "./Loader/Loader";
import { createNotification } from "../Notifications/Notifications";
import { user } from "@/app/api/user/types";

const isEmpty = (str: string) => !str || /^\s*$/.test(str);

interface componentProps {
  currentUser: user;
}

const CreatePost = ({ currentUser }: componentProps) => {
  const [images, setImages] = useState<
    {
      id: string;
      order: number;
      data: string;
      file: File;
    }[]
  >([]);
  const [isPostSending, setIsPostSending] = useState(false);

  const componentElementRef = useRef<null | HTMLDivElement>(null);

  const sortedImages = images.sort((a, b) => a.order - b.order);

  return (
    <div className={`${styles.createPost} ${isPostSending ? styles.sending : ""}`} ref={componentElementRef}>
      {isPostSending && <Loader></Loader>}

      <div className={`${styles.sendComment}`}>
        <div className={`${styles.userData}`}>
          <div className={`${styles.wrapper1}`}>
            <Image src={currentUser.profileImage} alt="Zdjęcie autora postu" width={64} height={64}></Image>
          </div>
          <div className={`${styles.wrapper2}`}>
            <p>{currentUser.publicId}</p>
            <p>{moment(new Date()).locale("pl").fromNow()}</p>
          </div>
        </div>
        <Textarea id="textarea" placeholder="Podziel się czymś ze światem"></Textarea>
        {sortedImages.length !== 0 && (
          <div className={`${styles.images}`}>
            {sortedImages.map((imageData) => {
              const { order, data, id } = imageData;

              return (
                <div
                  key={id}
                  className={`${styles.image}`}
                  onClick={() => {
                    let changed = false;
                    setImages((currentValues) => {
                      const copiedCurrentValues = [...currentValues];

                      if (changed === false) {
                        const foundFirstImage = copiedCurrentValues.find((imageDate) => imageDate.order === 1);

                        const foundImage = copiedCurrentValues.find((imageDate) => imageDate.order === order);

                        if (foundFirstImage && foundImage) {
                          foundFirstImage.order = foundImage.order;

                          foundImage.order = 1;
                        }

                        changed = true;
                      }

                      return copiedCurrentValues;
                    });
                  }}>
                  <button
                    className={`${styles.close}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      setImages((currentValues) => {
                        const copiedCurrentValues = [...currentValues];

                        const foundImageIndex = copiedCurrentValues.findIndex((imageDate) => imageDate.order === order);

                        copiedCurrentValues.splice(foundImageIndex, 1);

                        return copiedCurrentValues;
                      });
                    }}>
                    <Image src={closeIcon} alt="Ikona krzyżyka"></Image>
                  </button>
                  <Image src={data} alt="Zdjęcie posta" width={512} height={512}></Image>
                </div>
              );
            })}
          </div>
        )}
        <div className={`${styles.options}`}>
          <button
            className={`${styles.option}`}
            onClick={(event) => {
              const inputElement = event.currentTarget.querySelector("input") as HTMLInputElement;

              inputElement.click();
            }}>
            <input
              type="file"
              accept="image/*"
              hidden
              multiple
              onChange={(event) => {
                const files = event.currentTarget.files;

                if (files) {
                  const urlFiles: {
                    id: string;
                    order: number;
                    data: string;
                    file: File;
                  }[] = [];

                  [...files].forEach((file, index) => {
                    urlFiles.push({
                      id: self.crypto.randomUUID(),
                      order: index + 1,
                      data: URL.createObjectURL(file),
                      file: file,
                    });
                  });

                  setImages(urlFiles);
                }
              }}></input>
            <Image src={imageIcon} alt="Ikona zdjęcia"></Image>
          </button>
          <Button
            className={`${styles.send}`}
            onClick={async () => {
              const textareaElement = componentElementRef.current!.querySelector("#textarea") as HTMLElement;

              if (isEmpty(textareaElement.innerText) === false) {
                setIsPostSending(true);

                const newImagesData = images.map((imageData) => {
                  return {
                    file: imageData.file,
                    id: imageData.id,
                    order: imageData.order,
                  };
                });

                const responseData = await postCreate(currentUser.id, textareaElement.innerText.replace(/\s+/g, " ").trim(), newImagesData);

                setIsPostSending(false);

                if (responseData.status === 200) {
                  textareaElement.innerText = "";

                  setImages([]);
                } else {
                  createNotification("Wystąpił nieoczekiwany błąd. Przepraszamy", "failure", [responseData.error!]);
                }
              } else {
                textareaElement.blur();
                setTimeout(() => {
                  textareaElement.focus();
                }, 250);
              }
            }}>
            Wyślij
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
