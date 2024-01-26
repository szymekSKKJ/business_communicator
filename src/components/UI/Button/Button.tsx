"use client";
import styles from "./styles.module.scss";
import { ButtonHTMLAttributes, ReactNode } from "react";
import { Prompt } from "next/font/google";

const prompt = Prompt({ weight: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["latin"] });

type themeType = "blue-white";

const themes = [
  {
    type: "blue-white",
    style: styles.blueWhite,
  },
];

interface componentProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  themeType?: themeType;
}

const Button = ({ children, themeType = "blue-white", className, ...rest }: componentProps) => {
  const foundTheme = themes.find((themeData) => themeData.type === themeType)?.style;

  return (
    <button className={`${prompt.className} ${styles.button} ${foundTheme} ${className}`} {...rest}>
      {children}
    </button>
  );
};

export default Button;
