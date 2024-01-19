import { InputHTMLAttributes } from "react";
import styles from "./styles.module.scss";
interface componentProps extends InputHTMLAttributes<HTMLInputElement> {
  placeholder: string;
}

const Input = ({ placeholder, ...rest }: componentProps) => {
  return <input className={`${styles.input}`} placeholder={placeholder} {...rest}></input>;
};

export default Input;
