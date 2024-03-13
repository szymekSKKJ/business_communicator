"use client";
import styles from "./styles.module.scss";
import { useEffect, useRef, useState } from "react";

interface componentProps {
  children: JSX.Element | JSX.Element[];
  width?: string;
  height?: string;
}

const Select = ({ children, width = "250px", height = "33px" }: componentProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSelectedValue, setCurrentSelectedValue] = useState<string | null>(null);

  const componentElementRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (componentElementRef.current) {
      const optionElementCollection = [...componentElementRef.current.querySelectorAll(".option")] as HTMLDivElement[];

      const click1 = (event: MouseEvent) => {
        event.stopPropagation();
        const element = event.target as HTMLDivElement;
        const value = element.dataset.value;

        setIsOpen(false);
        setCurrentSelectedValue(`${value}`);
      };

      optionElementCollection.forEach((element, index) => {
        const value = element.dataset.value;
        const isDisabled = element.dataset.disabled;

        if (isDisabled === "false") {
          element.addEventListener("click", click1);
        }

        if (index === 0) {
          setCurrentSelectedValue(`${value}`);
        }
      });

      const click2 = () => {
        setIsOpen(false);
      };

      window.addEventListener("click", click2);

      return () => {
        window.removeEventListener("click", click2);

        optionElementCollection.forEach((element) => {
          element.removeEventListener("click", click1);
        });
      };
    }
  }, []);

  return (
    <div
      ref={componentElementRef}
      className={`${styles.select} ${isOpen ? styles.open : ""}`}
      style={{ width: width }}
      onClick={(event) => {
        event.stopPropagation();
        setIsOpen((currentValue) => (currentValue === false ? true : false));
      }}>
      <div className={`${styles.currentValue}`} style={{ width: width, height: height }}>
        <p>{currentSelectedValue}</p>
        <i className="fa-solid fa-chevron-down"></i>
      </div>
      <div className={`${styles.dropDown}`}>{children}</div>
    </div>
  );
};

export default Select;

const Option = ({ value, height = "33px", disabled = false }: { value: string | number; defaultValue?: boolean; height?: string; disabled?: boolean }) => {
  return (
    <div data-value={value} data-disabled={disabled} className={`${styles.option} ${disabled ? styles.disabled : ""} option`} style={{ minHeight: height }}>
      {value}
    </div>
  );
};

export { Option };
