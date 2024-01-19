import Input from "@/components/UI/Input/Input";
import styles from "./styles.module.scss";
import Button from "@/components/UI/Button/Button";
import { user } from "@/types";
import { Dispatch, SetStateAction } from "react";

interface componentProps {
  setCurrentUserData: Dispatch<SetStateAction<user>>;
  currentUserData: user;
}

const SetDescription = ({ setCurrentUserData, currentUserData }: componentProps) => {
  return (
    <div className={`${styles.setDescription}`}>
      <h2>Ustaw krótki opis</h2>
      <p>Po opisie inni użytkownicy od razu będą wiedzieć czym się zajmujesz</p>
      <Input placeholder="Opis"></Input>
      <Button
        onClick={async (event) => {
          const descriptionInputElement = event.currentTarget.parentElement?.querySelector("input") as HTMLInputElement;
          await fetch(`/api/user/update/${currentUserData.id}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ description: descriptionInputElement.value.toLowerCase() }),
          });

          setCurrentUserData((currentValue) => {
            const copiedCurrentValue = { ...currentValue };

            copiedCurrentValue.description = descriptionInputElement.value.toLowerCase();

            return copiedCurrentValue;
          });
        }}>
        Zapisz
      </Button>
    </div>
  );
};

export default SetDescription;
