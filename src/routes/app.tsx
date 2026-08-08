import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/clipin/components/AppShell";
import { WorkspaceProvider } from "@/clipin/state/workspace";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

function AppLayout() {
  return (
    <WorkspaceProvider>
      <AppShell>
        <Outlet />
      </AppShell>
    </WorkspaceProvider>
  );
}
