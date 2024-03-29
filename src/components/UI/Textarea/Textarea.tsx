"use client";
import { HTMLAttributes, MutableRefObject } from "react";
import styles from "./styles.module.scss";

interface componentProps extends HTMLAttributes<HTMLSpanElement> {
  placeholder: string;
  refProp?: MutableRefObject<HTMLElement | null>;
}

const Textarea = ({ placeholder, refProp, ...rest }: componentProps) => {
  return (
    <div
      className={`${styles.textarea}`}
      ref={(node) => {
        if (refProp) {
          refProp.current = node;
        }
      }}>
      <span
        contentEditable={true}
        data-placeholder={placeholder}
        role="textarea"
        {...rest}
        onPaste={(event) => {
          event.preventDefault();

          const currentElement = event.currentTarget;

          const pastedText = event.clipboardData.getData("text/plain");

          const selection = window.getSelection();

          if (selection) {
            const cursorPosition = selection.focusOffset;

            const currentContent = currentElement.innerHTML;

            const newContent = currentContent.substring(0, cursorPosition) + pastedText + currentContent.substring(cursorPosition);
            currentElement.innerHTML = newContent;

            const newCursorPosition = cursorPosition + pastedText.length;
            const newRange = document.createRange();

            newRange.setStart(currentElement.childNodes[0], newCursorPosition);
            newRange.setEnd(currentElement.childNodes[0], newCursorPosition);

            selection.removeAllRanges();
            selection.addRange(newRange);
          }
        }}></span>
    </div>
  );
};

export default Textarea;
