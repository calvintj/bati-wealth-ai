import Image from "next/image";
import React, { ComponentProps } from "react";

export default function Icon({
  size,
  ...props
}: ComponentProps<typeof Image> & { size?: number }) {
  return <Image width={size ?? 16} height={size ?? 16} {...props} />;
}
