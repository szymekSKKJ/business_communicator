import Login from "@/components/Login/Login";
import EditUserProfile from "@/components/EditUserProfile/EditUserProfile";
import { authOptions, sessionUser } from "../api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import DefaultHomePage from "@/components/DefaultHomePage/DefaultHomePage";

const HomePage = async () => {
  const session = await getServerSession(authOptions);

  // if (session) {
  //   const sessionUser = session.user as sessionUser;

  //   const userMisingInformation = Object.keys(sessionUser).some((key) => {
  //     if (sessionUser[key as keyof typeof sessionUser] === null) {
  //       return true;
  //     }
  //   });

  //   if (userMisingInformation) {
  //     return <EditUserProfile userData={session.user}></EditUserProfile>;
  //   } else {
  //     return <DefaultHomePage></DefaultHomePage>;
  //   }
  // } else {
  //   return <Login></Login>;
  // }
  return <DefaultHomePage></DefaultHomePage>;
};

export default HomePage;
