"use client";
import Login from "@/components/Login/Login";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import AdditionalInformationToSetProfile from "@/components/AdditionalInformationToSetProfile/AdditionalInformationToSetProfile";
import Button from "@/components/UI/Button/Button";
import { getSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { user } from "@/types";

const HomePage = () => {
  const [session, setSession] = useState<null | Session>(null);

  useEffect(() => {
    (async () => {
      const session = await getSession();
      setSession(session);
    })();
  }, []);

  if (session && session.user) {
    const userMisingInformation = Object.keys(session.user).some((key) => {
      if (session.user![key as keyof typeof session.user] === null) {
        return true;
      }
    });

    return (
      <>
        {userMisingInformation ? (
          <AdditionalInformationToSetProfile userData={session.user as user}></AdditionalInformationToSetProfile>
        ) : (
          <>
            <p>Zalogowany jako: {session.user.name}</p>
            <Button onClick={() => signOut()}>Wyloguj się</Button>
          </>
        )}
      </>
    );
  } else {
    return <Login></Login>;
  }
};

export default HomePage;
