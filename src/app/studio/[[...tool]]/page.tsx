import StudioClient from "./StudioClient";

export const dynamic = "force-static";

// A static export needs this route enumerated; Studio's own client-side
// router handles every path under /studio after this shell loads.
export function generateStaticParams() {
  return [{ tool: [] }];
}

export default function StudioPage() {
  return <StudioClient />;
}
