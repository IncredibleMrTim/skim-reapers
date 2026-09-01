export function Logo() {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- static export has no Image Optimization API
    <img
      src="/logo_dark.webp"
      alt="Skim Reapers"
      style={{ height: "1em", width: "1em", objectFit: "cover" }}
    />
  );
}
