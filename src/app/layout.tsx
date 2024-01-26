import type { Metadata } from "next";
import "./global.scss";
import { Montserrat } from "next/font/google";
import Notifications from "@/components/Notifications/Notifications";
import Loader from "@/components/Loader/Loader";

const montserrat = Montserrat({ weight: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Business communicator",
  description: "Generated by create next app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <Notifications></Notifications>
        <Loader></Loader>
        {children}
      </body>
    </html>
  );
}
