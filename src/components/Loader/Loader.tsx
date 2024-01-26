"use client";

import { signal } from "@preact/signals";
import styles from "./styles.module.scss";
import "./style.css";
import { useSignals } from "@preact/signals-react/runtime";

const isVisible = signal(false);

export const setLoaderVisibility = (visible: boolean) => {
  isVisible.value = visible;
};

const Loader = () => {
  useSignals();

  return (
    <div className={`${styles.loader} ${isVisible.value ? styles.visible : ""}`}>
      <div className="animation-container">
        <div className="lightning-container">
          <div className="lightning white"></div>
          <div className="lightning red"></div>
        </div>
        <div className="boom-container">
          <div className="shape circle big white"></div>
          <div className="shape circle white"></div>
          <div className="shape triangle big yellow"></div>
          <div className="shape disc white"></div>
          <div className="shape triangle blue"></div>
        </div>
        <div className="boom-container second">
          <div className="shape circle big white"></div>
          <div className="shape circle white"></div>
          <div className="shape disc white"></div>
          <div className="shape triangle blue"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
