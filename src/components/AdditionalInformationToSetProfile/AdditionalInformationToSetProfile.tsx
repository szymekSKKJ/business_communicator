"use client";

import { useEffect, useState } from "react";

import SetPublicId from "./SetPublicId/SetPublicId";
import { user } from "@/types";
import SetDescription from "./SetDescription/SetDescription";
import { useRouter } from "next/navigation";

interface componentProps {
  userData: user;
}

const AdditionalInformationToSetProfile = ({ userData }: componentProps) => {
  const [currentUserData, setCurrentUserData] = useState<user>(userData);
  const router = useRouter();

  const currentMisingInformation = Object.keys(currentUserData).find((key) => {
    if (currentUserData[key as keyof typeof currentUserData] === null) {
      return true;
    }
  });

  useEffect(() => {
    if (currentMisingInformation === undefined) {
      router.push(`/${currentUserData.publicId}`);
    }
  }, [currentUserData]);

  return (
    <>
      {currentMisingInformation === "publicId" && <SetPublicId currentUserData={currentUserData} setCurrentUserData={setCurrentUserData}></SetPublicId>}
      {currentMisingInformation === "description" && (
        <SetDescription currentUserData={currentUserData} setCurrentUserData={setCurrentUserData}></SetDescription>
      )}
    </>
  );
};

export default AdditionalInformationToSetProfile;
