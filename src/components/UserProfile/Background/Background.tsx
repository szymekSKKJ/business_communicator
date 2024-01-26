"use client";

import styles from "./styles.module.scss";
import { useEffect, useRef, useState } from "react";

async function handleImage(url: string) {
  const imgElement = document.createElement("img");
  imgElement.src = url;

  const reader = new FileReader();

  const avgColors = await new Promise<number[][]>((resolve) => {
    fetch(imgElement.src)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "dot.png", blob);

        reader.onload = function (e) {
          const image = new Image();
          image.onload = function () {
            const avgColors = getAverageColors(image, 8);
            resolve(avgColors);
          };

          image.src = e.target!.result as string;
        };

        reader.readAsDataURL(file);
      });
  });

  return avgColors;
}

function getAverageColors(image: HTMLImageElement, numSections: number) {
  const canvas = document.createElement("canvas") as HTMLCanvasElement;
  const context = canvas.getContext("2d")!;

  canvas.width = image.width;
  canvas.height = image.height;
  context.drawImage(image, 0, 0, image.width, image.height);

  const sectionWidth = Math.floor(image.width / numSections);
  const avgColors = [];

  for (let i = 0; i < numSections; i++) {
    const startCol = i * sectionWidth;
    const endCol = (i + 1) * sectionWidth;

    const imageData = context.getImageData(startCol, 0, sectionWidth, image.height).data;
    const avgColor = calculateAverageColor(imageData);

    avgColors.push(avgColor);
  }

  return avgColors;
}

function calculateAverageColor(imageData: Uint8ClampedArray) {
  let totalRed = 0;
  let totalGreen = 0;
  let totalBlue = 0;

  for (let i = 0; i < imageData.length; i += 4) {
    totalRed += imageData[i];
    totalGreen += imageData[i + 1];
    totalBlue += imageData[i + 2];
  }

  const numPixels = imageData.length / 4;
  const avgRed = Math.round(totalRed / numPixels);
  const avgGreen = Math.round(totalGreen / numPixels);
  const avgBlue = Math.round(totalBlue / numPixels);

  return [avgRed, avgGreen, avgBlue];
}

interface componentProps {
  backgroundUrl: string | null;
}

const Background = ({ backgroundUrl }: componentProps) => {
  const backgroundElementRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      if (backgroundElementRef.current) {
        const mainHeaderElement = backgroundElementRef.current.parentElement?.querySelector("#main-header");

        if (backgroundUrl) {
          const colors = await handleImage(backgroundUrl);
          backgroundElementRef.current.style.setProperty("--myColor1", `rgb(${colors[0][0]}, ${colors[0][1]}, ${colors[0][2]})`);
          backgroundElementRef.current.style.setProperty("--myColor2", `rgb(${colors[1][0]}, ${colors[1][1]}, ${colors[1][2]})`);
          backgroundElementRef.current.style.setProperty("--myColor3", `rgb(${colors[2][0]}, ${colors[2][1]}, ${colors[2][2]})`);
          backgroundElementRef.current.style.setProperty("--myColor4", `rgb(${colors[3][0]}, ${colors[3][1]}, ${colors[3][2]})`);
          backgroundElementRef.current.style.setProperty("--myColor5", `rgb(${colors[4][0]}, ${colors[4][1]}, ${colors[4][2]})`);
          backgroundElementRef.current.style.setProperty("--myColor6", `rgb(${colors[5][0]}, ${colors[5][1]}, ${colors[5][2]})`);
          backgroundElementRef.current.style.setProperty("--myColor7", `rgb(${colors[6][0]}, ${colors[6][1]}, ${colors[6][2]})`);
          backgroundElementRef.current.style.setProperty("--myColor8", `rgb(${colors[7][0]}, ${colors[7][1]}, ${colors[7][2]})`);
        } else {
          backgroundElementRef.current.style.setProperty("--myColor1", `rgb(255,255,255)`);
          backgroundElementRef.current.style.setProperty("--myColor2", `rgb(255,255,255)`);
          backgroundElementRef.current.style.setProperty("--myColor3", `rgb(255,255,255)`);
          backgroundElementRef.current.style.setProperty("--myColor4", `rgb(255,255,255)`);
          backgroundElementRef.current.style.setProperty("--myColor5", `rgb(255,255,255)`);
          backgroundElementRef.current.style.setProperty("--myColor6", `rgb(255,255,255)`);
          backgroundElementRef.current.style.setProperty("--myColor7", `rgb(255,255,255)`);
          backgroundElementRef.current.style.setProperty("--myColor8", `rgb(255,255,255)`);
        }
      }
    })();
  }, [backgroundUrl]);

  return <div ref={backgroundElementRef} className={`${styles.background}`}></div>;
};

export default Background;
