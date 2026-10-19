"use client"

import type { IEmailAttachment } from "@/lib/mailProxy"

export const MAX_PHOTO_COUNT = 10
export const ACCEPTED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"]

// The mail proxy sits behind Vercel's 4.5 MB request limit and base64 adds
// about a third, so ~3.1 MB of real image data keeps the whole request safely
// under it. One budget is shared across every photo: few photos stay sharp,
// many photos shrink further.
const TOTAL_PHOTO_BYTE_BUDGET = 3_100_000
const STARTING_LONG_EDGE_PIXELS = 1600
const MINIMUM_LONG_EDGE_PIXELS = 700
const JPEG_QUALITY_STEPS = [0.8, 0.7, 0.6, 0.5]
const EDGE_SHRINK_FACTOR = 0.8
const MAX_FILENAME_LENGTH = 100

function loadBitmap(file: File): Promise<ImageBitmap> {
  // "from-image" applies the EXIF rotation, so phone photos aren't sideways.
  return createImageBitmap(file, { imageOrientation: "from-image" })
}

function encodeJpeg(
  bitmap: ImageBitmap,
  longEdgePixels: number,
  quality: number,
): Promise<Blob> {
  const scale = Math.min(
    1,
    longEdgePixels / Math.max(bitmap.width, bitmap.height),
  )
  const canvas = document.createElement("canvas")
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  const context = canvas.getContext("2d")
  if (!context) {
    return Promise.reject(new Error("compressPhotos: no canvas context"))
  }
  // JPEG has no transparency; without this a transparent PNG goes black.
  context.fillStyle = "#ffffff"
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob
          ? resolve(blob)
          : reject(new Error("compressPhotos: encode failed")),
      "image/jpeg",
      quality,
    )
  })
}

/**
 * Re-encodes one photo as a JPEG, lowering quality and then size until it
 * fits `byteBudget`. Re-encoding through a canvas also drops location and
 * camera metadata, which is a privacy gain for applicants.
 */
async function compressToBudget(file: File, byteBudget: number): Promise<Blob> {
  const bitmap = await loadBitmap(file)
  try {
    let longEdgePixels = STARTING_LONG_EDGE_PIXELS
    while (longEdgePixels >= MINIMUM_LONG_EDGE_PIXELS) {
      for (const quality of JPEG_QUALITY_STEPS) {
        const blob = await encodeJpeg(bitmap, longEdgePixels, quality)
        if (blob.size <= byteBudget) return blob
      }
      longEdgePixels = Math.floor(longEdgePixels * EDGE_SHRINK_FACTOR)
    }
    throw new Error(`compressPhotos: could not fit ${file.name} in budget`)
  } finally {
    bitmap.close()
  }
}

async function blobToBase64(blob: Blob): Promise<string> {
  const bytes = new Uint8Array(await blob.arrayBuffer())
  const chunkSize = 0x8000
  let binary = ""
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize))
  }
  return btoa(binary)
}

function toJpegFilename(originalName: string, position: number): string {
  const baseName = originalName
    .replace(/\.[^.]+$/, "")
    .replace(/[^\w.-]+/g, "-")
  const filename = `${baseName || `photo-${position}`}.jpg`
  return filename.slice(-MAX_FILENAME_LENGTH)
}

/**
 * Shrinks the selected photos to share one size budget and returns them as
 * inline email attachments (`cid:photo-1`, `cid:photo-2`, …). Throws if any
 * photo can't be read, e.g. a HEIC file in a browser that can't decode it.
 */
export async function compressPhotosForEmail(
  files: File[],
): Promise<IEmailAttachment[]> {
  if (files.length === 0) return []
  const byteBudgetPerPhoto = Math.floor(TOTAL_PHOTO_BYTE_BUDGET / files.length)
  const attachments: IEmailAttachment[] = []
  for (const [index, file] of files.entries()) {
    const position = index + 1
    const blob = await compressToBudget(file, byteBudgetPerPhoto)
    attachments.push({
      filename: toJpegFilename(file.name, position),
      contentType: "image/jpeg",
      content: await blobToBase64(blob),
      contentId: `photo-${position}`,
    })
  }
  return attachments
}
