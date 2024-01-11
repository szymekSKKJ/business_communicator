"use client";
import styles from "./styles.module.scss";
import testBanner from "../../../../public/test_banner.jpg";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { StaticImageData } from "next/image";

const getAverageRGB = async (
  imgData: StaticImageData
): Promise<{
  r: number;
  g: number;
  b: number;
}> => {
  const imgEl = document.createElement("img");

  imgEl.src = imgData.src;

  const rgbProimse = await new Promise<{
    r: number;
    g: number;
    b: number;
  }>((resolve) => {
    imgEl.onload = () => {
      const blockSize = 5;
      const canvasElement = document.createElement("canvas");
      const context = canvasElement.getContext("2d")!;

      context.drawImage(imgEl, 0, 0);

      const rgb = { r: 0, g: 0, b: 0 };
      const data = context.getImageData(0, 0, canvasElement.width, canvasElement.height);

      let i = -4;
      let count = 0;

      while ((i += blockSize * 4) < data.data.length) {
        ++count;
        rgb.r += data.data[i];
        rgb.g += data.data[i + 1];
        rgb.b += data.data[i + 2];
      }

      rgb.r = ~~(rgb.r / count);
      rgb.g = ~~(rgb.g / count);
      rgb.b = ~~(rgb.b / count);

      resolve(rgb);
    };
  });

  return rgbProimse;
};

const Background = () => {
  const [height, setHeight] = useState(626);

  const backgroundElementRef = useRef<null | HTMLDivElement>(null);

  useLayoutEffect(() => {
    (async () => {
      const avgRgb = await getAverageRGB(testBanner as HTMLImageElement);
      backgroundElementRef.current!.style.setProperty("--myColor1", `rgba(${avgRgb.r}, ${avgRgb.g}, ${avgRgb.b}, 0.33)`);
    })();
  }, []);

  useEffect(() => {
    if (backgroundElementRef.current) {
      //const mainHeaderElement = backgroundElementRef.current.parentElement?.querySelector("#main-header");
      //setHeight(mainHeaderElement!.getBoundingClientRect().height);
    }
  }, []);

  return (
    <div
      ref={backgroundElementRef}
      className={`${styles.background}`}
      style={{
        height: `${height}px`,
        //backgroundImage: `linear-gradient(180deg, rgba(${avgRgb?.r}, ${avgRgb?.g}, ${avgRgb?.b}, 0.5), rgba(255,255,255, 1))`,
      }}></div>
  );
};

export default Background;
