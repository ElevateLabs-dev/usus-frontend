"use client";

import Image, { ImageProps, StaticImageData } from "next/image";

import { useThemeContext } from "@/theme/theme-provider";

type ThemeImageProps = Omit<ImageProps, "src"> & {
  lightSrc: string | StaticImageData;
  darkSrc: string | StaticImageData;
};

export default function ThemeImage({ lightSrc, darkSrc, ...props }: ThemeImageProps) {
  const { isDarkMode } = useThemeContext();

  return <Image {...props} src={isDarkMode ? darkSrc : lightSrc} />;
}
