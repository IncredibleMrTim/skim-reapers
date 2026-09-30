import { createImageUrlBuilder } from "@sanity/image-url";
import type { Image } from "sanity";

import { dataset, projectId } from "./env";

const imageBuilder = createImageUrlBuilder({ projectId, dataset });

export function urlForImage(source: Image) {
  return imageBuilder.image(source);
}

/**
 * Sanity asset refs encode the image's pixel dimensions in the id itself
 * (`image-<hash>-<width>x<height>-<format>`), so the aspect ratio is
 * available without a GROQ `asset->` dereference.
 */
export function getImageDimensions(
  ref?: string,
): { width: number; height: number } | null {
  const match = ref?.match(/-(\d+)x(\d+)-/);
  if (!match) return null;
  return { width: Number(match[1]), height: Number(match[2]) };
}
