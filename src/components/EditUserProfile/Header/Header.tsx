"use client";

import styles from "./styles.module.scss";
import Image from "next/image";
import Button from "@/components/UI/Button/Button";
import Star from "../../../../public/star.svg";

import Editable from "@/components/Editable/Editable";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import AvatarEditor from "react-avatar-editor";
import { useRouter } from "next/navigation";
import { createNotification } from "@/components/Notifications/Notifications";
import { setLoaderVisibility } from "@/components/Loader/Loader";
import { userUpdate } from "@/app/api/user/update/[id]/route";
import { user } from "@/app/api/user/types";

const isEmpty = (str: string) => !str || /^\s*$/.test(str);

interface componentProps {
  userData: user;
  setBackgroundImage: Dispatch<SetStateAction<null | File>>;
}

const Header = ({ userData, setBackgroundImage }: componentProps) => {
  const router = useRouter();

  const [currentUserData, setCurrentUserData] = useState<{
    id: string;
    email: string;
    name: null | string;
    profileImage: null | File;
    publicId: null | string;
    description: null | string;
    backgroundImage: null | File;
  }>({
    id: userData.id,
    email: userData.email!,
    name: null,
    profileImage: null,
    publicId: null,
    description: null,
    backgroundImage: null,
  });

  const [scaleForBackgroungImage, setScaleForBackgroundImage] = useState(1);
  const [scaleForProfileImage, setScaleForProfileImage] = useState(1);

  const usernameElementRef = useRef<null | HTMLParagraphElement>(null);
  const publicIdElementRef = useRef<null | HTMLParagraphElement>(null);
  const descriptionElementRef = useRef<null | HTMLParagraphElement>(null);
  const backgroundImageInputElementRef = useRef<null | HTMLInputElement>(null);
  const profileImageInputElementRef = useRef<null | HTMLInputElement>(null);

  const profileImageElementRef = useRef<null | HTMLDivElement>(null);

  const avatarEditorForBackgroundRef = useRef<null | AvatarEditor>(null);
  const avatarEditorForProfileImageRef = useRef<null | AvatarEditor>(null);

  return (
    <header className={`${styles.header}`} id="main-header">
      <div className={`${styles.banner}`}>
        <form>
          <input
            ref={backgroundImageInputElementRef}
            id="background-image-input"
            type="file"
            hidden
            onInput={(event) => {
              const inputFileList = event.currentTarget.files;

              if (inputFileList) {
                const file = inputFileList[0];

                if (file) {
                  setCurrentUserData((currentValue) => {
                    const copiedCurrentValue = { ...currentValue };

                    copiedCurrentValue.backgroundImage = file;

                    return copiedCurrentValue;
                  });
                } else {
                  setBackgroundImage(null);
                  setCurrentUserData((currentValue) => {
                    const copiedCurrentValue = { ...currentValue };

                    copiedCurrentValue.backgroundImage = null;

                    return copiedCurrentValue;
                  });
                }
              }
            }}></input>
        </form>
        <Editable
          defaultValue="Wybierz zdjęcie w tle"
          noPadding
          type="image"
          contextMenu={[
            {
              content: "Usuń zdjęcie",
              callback: () => {
                const formElement = backgroundImageInputElementRef.current?.parentElement as HTMLFormElement;
                formElement.reset();
                setBackgroundImage(null);
                setCurrentUserData((currentValue) => {
                  const copiedCurrentValue = { ...currentValue };

                  copiedCurrentValue.backgroundImage = null;

                  return copiedCurrentValue;
                });
              },
            },
            {
              content: (
                <>
                  Rozmiar <br></br>
                  <input
                    type="range"
                    onInput={(event) => {
                      setScaleForBackgroundImage(parseFloat(event.currentTarget.value));
                    }}
                    step={0.1}
                    defaultValue={scaleForBackgroungImage}
                    min={1}
                    max={5}></input>
                </>
              ),
            },
          ]}
          onClick={() => {
            if (currentUserData.backgroundImage === null) {
              backgroundImageInputElementRef.current!.click();
            }
          }}
          onSave={() => {
            avatarEditorForBackgroundRef.current?.getImageScaledToCanvas().toBlob((blob) => {
              setBackgroundImage(blob as File);
            }, "image/jpeg");
          }}>
          <div className={`${styles.backgroundImage}`}>
            {currentUserData.backgroundImage && (
              <AvatarEditor
                ref={avatarEditorForBackgroundRef}
                style={{ zIndex: "1000" }}
                image={currentUserData.backgroundImage}
                disableBoundaryChecks={false}
                width={1400}
                height={350}
                border={0}
                scale={scaleForBackgroungImage}
                rotate={0}
                onImageReady={() => {
                  avatarEditorForBackgroundRef.current?.getImageScaledToCanvas().toBlob((blob) => {
                    setBackgroundImage(blob as File);
                  }, "image/jpeg");
                }}
              />
            )}
          </div>
        </Editable>
        <form>
          <input
            ref={profileImageInputElementRef}
            id="profile-image-input"
            type="file"
            hidden
            onInput={(event) => {
              const inputFileList = event.currentTarget.files;
              if (inputFileList) {
                const file = inputFileList[0];

                if (file) {
                  setCurrentUserData((currentValue) => {
                    const copiedCurrentValue = { ...currentValue };

                    copiedCurrentValue.profileImage = file;

                    return copiedCurrentValue;
                  });
                } else {
                  setCurrentUserData((currentValue) => {
                    const copiedCurrentValue = { ...currentValue };

                    copiedCurrentValue.profileImage = null;

                    return copiedCurrentValue;
                  });
                }
              }
            }}></input>
        </form>
        <Editable
          defaultValue="Wybierz zdjęcie profilowe"
          noPadding
          type="image"
          contextMenu={[
            {
              content: "Usuń zdjęcie",
              callback: () => {
                const formElement = profileImageInputElementRef.current?.parentElement as HTMLFormElement;
                formElement.reset();
                setCurrentUserData((currentValue) => {
                  const copiedCurrentValue = { ...currentValue };

                  copiedCurrentValue.profileImage = null;

                  return copiedCurrentValue;
                });
              },
            },
            {
              content: (
                <>
                  Rozmiar <br></br>
                  <input
                    type="range"
                    onInput={(event) => {
                      setScaleForProfileImage(parseFloat(event.currentTarget.value));
                    }}
                    step={0.1}
                    defaultValue={scaleForProfileImage}
                    min={1}
                    max={5}></input>
                </>
              ),
            },
          ]}
          onClick={() => {
            if (currentUserData.profileImage === null) {
              profileImageInputElementRef.current!.click();
            }
          }}>
          <div className={`${styles.profileImage}`} ref={profileImageElementRef}>
            {currentUserData.profileImage && (
              <AvatarEditor
                ref={avatarEditorForProfileImageRef}
                style={{ zIndex: "1000" }}
                image={currentUserData.profileImage}
                disableBoundaryChecks={false}
                width={200}
                height={200}
                border={0}
                scale={scaleForProfileImage}
                rotate={0}
              />
            )}
          </div>
        </Editable>
      </div>
      <div className={`${styles.wrapper}`}>
        <div className={`${styles.userData}`}>
          <Editable
            onSave={(event) => {
              const currentElement = event.currentTarget as HTMLDivElement;
              const currentTextValue = currentElement.innerText.replace(/\s+/g, " ").trim();

              setCurrentUserData((currentValue) => {
                const copiedCurrentValue = { ...currentValue };

                if (isEmpty(currentTextValue)) {
                  copiedCurrentValue.name = null;
                } else {
                  copiedCurrentValue.name = currentTextValue;
                }

                return copiedCurrentValue;
              });
            }}
            defaultValue="Nazwa użytkownika"
            noPadding>
            <p
              className={`${styles.username}`}
              ref={(node) => {
                usernameElementRef.current = node;
              }}
              dangerouslySetInnerHTML={{ __html: currentUserData.name === null ? "" : currentUserData.name }}></p>
          </Editable>
          <div className={`${styles.wrapper}`}>
            <p className={`${styles.addSymbol}`}>@</p>
            <Editable
              onSave={(event) => {
                const currentElement = event.currentTarget as HTMLDivElement;
                const currentTextValue = currentElement.innerText.replace(/\s/g, "").toLowerCase().trim();

                setCurrentUserData((currentValue) => {
                  const copiedCurrentValue = { ...currentValue };

                  if (isEmpty(currentTextValue)) {
                    copiedCurrentValue.publicId = null;
                  } else {
                    copiedCurrentValue.publicId = currentTextValue;
                  }

                  return copiedCurrentValue;
                });
              }}
              defaultValue="Publiczny identyfikator"
              noPadding>
              <p
                className={`${styles.id}`}
                ref={(node) => {
                  publicIdElementRef.current = node;
                }}
                dangerouslySetInnerHTML={{ __html: currentUserData.publicId === null ? "" : currentUserData.publicId }}></p>
            </Editable>
          </div>
          <Editable
            onSave={(event) => {
              const currentElement = event.currentTarget as HTMLDivElement;
              const currentTextValue = currentElement.innerText.replace(/\s\s+/g, " ").trim();

              setCurrentUserData((currentValue) => {
                const copiedCurrentValue = { ...currentValue };

                if (isEmpty(currentTextValue)) {
                  copiedCurrentValue.description = null;
                } else {
                  copiedCurrentValue.description = currentTextValue;
                }

                return copiedCurrentValue;
              });
            }}
            defaultValue="Opisz czym się zajmujesz"
            noPadding>
            <p
              className={`${styles.proffesion} normalText`}
              ref={(node) => {
                descriptionElementRef.current = node;
              }}
              dangerouslySetInnerHTML={{ __html: currentUserData.description === null ? "" : currentUserData.description }}></p>
          </Editable>
          <Button>Napisz wiadomość</Button>
        </div>
        <div className={`${styles.wrapper}`}>
          <div className={`${styles.wrapper2}`}>
            <div className={`${styles.opinionRate}`}>
              <p>Brak</p>
              <Image src={Star} alt="Ikona gwiazdki"></Image>
            </div>
            <p>0 opinii</p>
          </div>
          <div className={`${styles.wrapper1}`}>
            <div className={`${styles.wrapper}`}>
              <p>0</p>
              <p>Obserwujących</p>
            </div>
            <div className={`${styles.wrapper}`}>
              <p>0</p>
              <p>Obserwuje</p>
            </div>
          </div>
          <Button>Obserwuj</Button>
        </div>
      </div>
      <nav>
        <button className={`${styles.active} normalText`}>Posty</button>
        <button className={`normalText`}>Oferta</button>
        <button className={`normalText`}>Informacje</button>
        <button className={`normalText`}>Zdjęcia</button>
        <button className={`normalText`}>Wzmianki</button>
        <button className={`normalText`}>Obserwujących</button>
        <button className={`normalText`}>Obserwuje</button>
        <button className={`normalText`}>Opinie</button>
      </nav>
      <div className={`${styles.saveChanges}`}>
        <p>Kliknij w poszczególne sekcje swojego profilu aby je edytować lub prawym przyciskiem myszy aby zobaczyć więcej opcji</p>
        <Button
          style={{ fontSize: "18px" }}
          onClick={async () => {
            const emptyValue = Object.keys(currentUserData).find((key) => {
              if (currentUserData[key as keyof typeof currentUserData] === null && key !== "backgroundImage") {
                return key;
              }
            });

            if (emptyValue) {
              createNotification("Uzupełnij wymagane pole", "failure");
              if (emptyValue === "name") {
                usernameElementRef.current?.focus();
              } else if (emptyValue === "publicId") {
                publicIdElementRef.current?.focus();
              } else if (emptyValue === "description") {
                descriptionElementRef.current?.focus();
              } else if (emptyValue === "profileImage") {
                profileImageElementRef.current?.focus();
              }
            } else {
              setLoaderVisibility(true);

              const preparedCurrentUserData = {
                name: currentUserData.name!.replace(/\s+/g, " ").trim(),
                publicId: currentUserData.publicId!.replace(/\s/g, "").toLowerCase().trim(),
                description: currentUserData.description!.replace(/\s+/g, " ").trim(),
              };

              avatarEditorForProfileImageRef.current?.getImageScaledToCanvas().toBlob(async (profileImageBlob) => {
                const profileImageFile = new File([profileImageBlob!], "profileImage.webp", { type: profileImageBlob!.type });

                if (currentUserData.backgroundImage) {
                  avatarEditorForBackgroundRef.current?.getImageScaledToCanvas().toBlob(async (backgroundImageBlob) => {
                    const backgroundImageFile = new File([backgroundImageBlob!], "backgroundImage.webp", { type: backgroundImageBlob!.type });

                    const response = await userUpdate(
                      currentUserData.id,
                      preparedCurrentUserData.publicId,
                      preparedCurrentUserData.description,
                      preparedCurrentUserData.name,
                      profileImageFile,
                      backgroundImageFile
                    );
                    if (response.status === 200 && response.error === null) {
                      createNotification("Profil zaaktualizowany");
                      router.push(`/${currentUserData.publicId}`);
                    } else if (response.status === 200) {
                      createNotification(response.error!, "failure", [response.error!]);
                    } else {
                      createNotification("Wystąpił niespodziewany błąd. Przepraszamy", "failure", [response.error!]);
                    }
                    setLoaderVisibility(false);
                  }, "image/webp");
                } else {
                  const response = await userUpdate(
                    currentUserData.id,
                    preparedCurrentUserData.publicId,
                    preparedCurrentUserData.description,
                    preparedCurrentUserData.name,
                    profileImageFile
                  );

                  if (response.status === 200) {
                    createNotification("Profil zaaktualizowany");
                    router.push(`/${currentUserData.publicId}`);
                  } else {
                    createNotification("Wystąpił niespodziewany błąd. Przepraszamy", "failure", [response.error!]);
                  }
                  setLoaderVisibility(false);
                }
              }, "image/webp");
            }
          }}>
          Zapisz
        </Button>
      </div>
    </header>
  );
};

export default Header;
