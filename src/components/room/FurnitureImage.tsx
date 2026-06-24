"use client";

import Image from "next/image";
import { pixelItems } from "@/data/pixelItems";

interface FurnitureImageProps {
  itemId: string;
  size?: number;
}

export default function FurnitureImage({ itemId, size = 36 }: FurnitureImageProps) {
  const item = pixelItems.find((i) => i.id === itemId);
  if (!item?.imagePath) return null;

  return (
    <Image
      src={item.imagePath}
      alt={item.name}
      width={size}
      height={size}
      className="object-contain drop-shadow-sm"
      loading="lazy"
    />
  );
}

export function hasIsometricImage(itemId: string): boolean {
  const item = pixelItems.find((i) => i.id === itemId);
  return !!item?.imagePath;
}
