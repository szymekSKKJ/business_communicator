"use client";
import styles from "./styles.module.scss";
import { ButtonHTMLAttributes, ReactNode } from "react";

type themeType = "blue-white" | "red-white";

const themes = [
  {
    type: "blue-white",
    style: styles.blueWhite,
  },
  {
    type: "red-white",
    style: styles.redWhite,
  },
];

interface componentProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  themeType?: themeType;
}

const Button = ({ children, themeType = "blue-white", className, ...rest }: componentProps) => {
  const foundTheme = themes.find((themeData) => themeData.type === themeType)?.style;

  return (
    <button className={`${styles.button} ${foundTheme} ${className}`} {...rest}>
      {children}
    </button>
  );
};

export default Button;
