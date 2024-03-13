import type { Metadata } from "next";
import "./global.scss";

import Notifications from "@/components/Notifications/Notifications";
import { Varela_Round } from "next/font/google";
import Loader from "@/components/Loader/Loader";
import { userGetByPublicId } from "./api/user/getByPublicId/[publicId]/route";
import { authOptions, sessionUser } from "./api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import WebSocketBackgroundActions from "@/components/WebSocketBackgroundActions/WebSocketBackgroundActions";
import MainNavigation from "@/components/MainNavigation/MainNavigation";

export const metadata: Metadata = {
  title: "Business communicator",
  description: "Generated by create next app",
};

const varela_Round = Varela_Round({ weight: ["400"], subsets: ["latin"] });

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  const user = session ? (session.user as sessionUser) : null;

  const userData = user !== null ? await userGetByPublicId(user.publicId, true) : null;

  return (
    <html lang="en">
      <head>
        <script src="https://kit.fontawesome.com/845eb6a366.js" crossOrigin="anonymous" async></script>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Varela+Round&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&family=Varela+Round&display=swap" rel="stylesheet" />
      </head>
      <body className={`${varela_Round.className}`}>
        {userData?.data && <MainNavigation currentUser={userData.data}></MainNavigation>}
        <Notifications></Notifications>
        <Loader></Loader>
        {userData?.data && <WebSocketBackgroundActions currentUser={userData.data}></WebSocketBackgroundActions>}
        {children}
      </body>
    </html>
  );
}
