"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";

interface componentProps {
  iconImage: any;
  provider: "google";
}

const LoginButton = ({ iconImage, provider }: componentProps) => {
  return (
    <button onClick={() => signIn(provider)}>
      <Image src={iconImage} alt="Login provider icon"></Image>
    </button>
  );
};

export default LoginButton;
