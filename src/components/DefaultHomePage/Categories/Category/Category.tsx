"use client";

import Image from "next/image";
import styles from "./styles.module.scss";
import { useEffect, useState } from "react";
import { toggleActiveCategory } from "../Categories";

interface componentProps {
  iconImage: any;
  name: string;
  isActive?: boolean;
  id: number;
}

const Category = ({ iconImage, name, isActive = false, id }: componentProps) => {
  return (
    <div
      className={`${styles.category}`}
      onClick={() => {
        toggleActiveCategory(id);
      }}>
      <div className={`${styles.dataWrapper} ${isActive ? styles.choosen : ""}`}>
        <Image src={iconImage} alt="Category icon"></Image>
        <p className={`normalText`}>{name}</p>
      </div>
    </div>
  );
};

export default Category;
