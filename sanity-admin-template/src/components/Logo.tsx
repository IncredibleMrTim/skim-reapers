// CUSTOMIZE: swap the src/alt for your new project's logo asset.
export function Logo() {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- static export has no Image Optimization API
    <img
      src="/logo_text.svg"
      alt="Your Brand"
      style={{ height: "1em", width: "1em", objectFit: "cover" }}
    />
  )
}
