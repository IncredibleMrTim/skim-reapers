import AdminClient from "./AdminClient";

export const dynamic = "force-static";

// Only needed for `output: "export"` deployments — a static export needs
// this route enumerated; Studio's own client-side router handles every
// path under /admin after this shell loads. If your project doesn't use
// static export, you can delete this function (and the dynamic export
// above, if you don't want the route pinned static).
export function generateStaticParams() {
  return [{ tool: [] }];
}

export default function AdminPage() {
  return <AdminClient />;
}
