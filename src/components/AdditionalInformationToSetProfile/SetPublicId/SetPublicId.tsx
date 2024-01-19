import styles from "./styles.module.scss";
import Button from "@/components/UI/Button/Button";
import Input from "@/components/UI/Input/Input";
import { user } from "@/types";
import { Dispatch, SetStateAction } from "react";

interface componentProps {
  setCurrentUserData: Dispatch<SetStateAction<user>>;
  currentUserData: user;
}

const SetPublicId = ({ setCurrentUserData, currentUserData }: componentProps) => {
  return (
    <div className={styles.setPublicId}>
      <h2>Wybierz nazwę, po której każdy Cię rozpozna</h2>
      <p>Jest to nazwa, która będzie wyświetlana w adresie URL i każdy będzie mógł jej użyć aby Cię znaleźć</p>
      <Input placeholder="Nazwa użytkownika"></Input>
      <Button
        onClick={async (event) => {
          const publicIdInputElement = event.currentTarget.parentElement?.querySelector("input") as HTMLInputElement;
          const response = await fetch(`/api/user/update/${currentUserData.id}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ publicId: publicIdInputElement.value.toLowerCase() }),
          });

          setCurrentUserData((currentValue) => {
            const copiedCurrentValue = { ...currentValue };

            copiedCurrentValue.publicId = publicIdInputElement.value.toLowerCase();

            return copiedCurrentValue;
          });
        }}>
        Zapisz
      </Button>
    </div>
  );
};

export default SetPublicId;
