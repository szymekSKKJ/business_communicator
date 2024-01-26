"use client";

import styles from "./styles.module.scss";
import { Children, cloneElement, useEffect, useState } from "react";

const isEmpty = (str: string) => !str || /^\s*$/.test(str);

const DeleteIcon = ({ width = 24, height = 24, color = "white" }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={height} viewBox="0 -960 960 960" width={width} fill={color}>
      <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
    </svg>
  );
};

const ContextMenu = ({
  contextMenuOptions,
}: {
  contextMenuOptions: {
    isOpen: boolean;
    position: {
      x: number;
      y: number;
    };
    options: { content: any; callback?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => any }[];
  };
}) => {
  return (
    <div className={`${styles.context_menu}`} style={{ top: `${contextMenuOptions.position.y}px`, left: `${contextMenuOptions.position.x}px` }}>
      {contextMenuOptions.options.map((optionData, index) => {
        const { content, callback } = optionData;

        return (
          <button
            key={index}
            className={`${styles.option}`}
            onClick={(event) => {
              callback && callback(event);
            }}>
            {content}
          </button>
        );
      })}
    </div>
  );
};

interface componentProps {
  children: JSX.Element;
  onSave?: (event: any) => any;
  onRemove?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => any;
  onClick?: (event: MouseEvent) => any;
  defaultValue?: string;
  noPadding?: boolean;
  type?: "image" | "string";
  textFormatting?: boolean;
  contextMenu?: {
    content: any;
    callback?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => any;
  }[];
}

const Editable = ({
  children,
  onSave,
  onRemove,
  onClick,
  defaultValue = "Edytuj",
  noPadding = false,
  type = "string",
  textFormatting = false,
  contextMenu = [],
}: componentProps) => {
  const currentChild = Children.only(children);

  const [uniqueKey] = useState(crypto.randomUUID());
  const [contextMenuOptions, setContextMenuOptions] = useState<{
    isOpen: boolean;
    position: {
      x: number;
      y: number;
    };
    options: { content: string; callback?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => any }[];
  }>({
    isOpen: false,
    position: {
      x: 0,
      y: 0,
    },
    options: contextMenu,
  });

  const copiedChild = cloneElement(currentChild, {
    contentEditable: type === "string" ? true : false,
    suppressContentEditableWarning: true,
    key: uniqueKey,
    placeholder: defaultValue,
    spellCheck: false,
    tabIndex: 1,
    onContextMenu: (event: MouseEvent) => {
      event.preventDefault();

      setContextMenuOptions((currentValue) => {
        const copiedCurrentValue = { ...currentValue };

        copiedCurrentValue.isOpen = true;
        copiedCurrentValue.position = {
          x: event.clientX,
          y: event.clientY,
        };
        copiedCurrentValue.options = contextMenu;

        return copiedCurrentValue;
      });
    },
    onClick: (event: MouseEvent) => {
      onClick && onClick(event);
    },
    onPaste: (event: ClipboardEvent) => {
      event.preventDefault();
      if (event.clipboardData && event.currentTarget) {
        const clipboardData = event.clipboardData.getData("text/plain");

        document.execCommand("insertText", false, clipboardData);
      }
    },
    onBlur: (event: FocusEvent) => {
      onSave && onSave(event);
      const currentElement = event.currentTarget as HTMLElement;
      const currentTextValue = currentElement.innerText.replace(/\s\s+/g, " ");

      if (isEmpty(currentTextValue) && type === "string") {
        currentElement.innerHTML = "";
      }
    },
  });

  useEffect(() => {
    const closeContextMenu = () => {
      setContextMenuOptions((currentValue) => {
        const copiedCurrentValue = { ...currentValue };

        copiedCurrentValue.isOpen = false;

        return copiedCurrentValue;
      });
    };

    document.addEventListener("click", closeContextMenu);

    return () => {
      document.removeEventListener("click", closeContextMenu);
    };
  }, []);

  return (
    <div className={`${styles.editable}`}>
      <div
        className={`${styles.editableChild} ${noPadding === true ? styles.noPadding : ""} ${type === "image" ? styles.image : ""}`}
        onMouseDown={(event) => {
          // For 100% sure
          const copiedChildElement = event.currentTarget.firstChild as HTMLElement;
          copiedChildElement.focus();
        }}>
        {copiedChild}
      </div>
      {onRemove && (
        <div className={`${styles.delete}`} onClick={(event) => onRemove(event)}>
          <DeleteIcon width={24} height={24}></DeleteIcon>
        </div>
      )}
      {contextMenuOptions.isOpen && <ContextMenu contextMenuOptions={contextMenuOptions}></ContextMenu>}
    </div>
  );
};

export default Editable;
