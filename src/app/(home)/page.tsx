import Login from "@/components/Login/Login";
import { Session } from "next-auth";
import Button from "@/components/UI/Button/Button";
import { getSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { user } from "@/types";
import EditUserProfile from "@/components/EditUserProfile/EditUserProfile";
import { GET, authOptions } from "../api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

const HomePage = async () => {
  const session = await getServerSession(authOptions);

  if (session && session.user) {
    const userMisingInformation = Object.keys(session.user).some((key) => {
      if (session.user![key as keyof typeof session.user] === null) {
        return true;
      }
    });

    if (true) {
      return <EditUserProfile userData={session.user}></EditUserProfile>;
    }
  } else {
    return <Login></Login>;
  }
};

export default HomePage;
