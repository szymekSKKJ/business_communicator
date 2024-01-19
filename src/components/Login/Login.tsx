"use client";

import { signIn } from "next-auth/react";
import Button from "../UI/Button/Button";

const Login = () => {
  return <Button onClick={() => signIn("google")}>Zaloguj się za pomocą google</Button>;
};

export default Login;
