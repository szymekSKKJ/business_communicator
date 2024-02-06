import type { Metadata } from "next";
import "./global.scss";
import { Montserrat } from "next/font/google";
import Notifications from "@/components/Notifications/Notifications";
import Loader from "@/components/Loader/Loader";
import MessagesUserWindows from "@/components/MessagesUserWindows/MessagesUserWindows";
import { userGetByPublicId } from "./api/user/getByPublicId/[publicId]/route";
import { authOptions, sessionUser } from "./api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

const montserrat = Montserrat({ weight: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Business communicator",
  description: "Generated by create next app",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  const user = session ? (session.user as sessionUser) : null;

  const userData = user !== null ? await userGetByPublicId(user.publicId, true) : null;

  return (
    <html lang="en">
      <head>
        <script src="https://kit.fontawesome.com/845eb6a366.js" crossOrigin="anonymous" async></script>
      </head>
      <body className={montserrat.className}>
        <Notifications></Notifications>
        <Loader></Loader>
        {userData?.data && <MessagesUserWindows currentUser={userData.data}></MessagesUserWindows>}

        {children}
      </body>
    </html>
  );
}
