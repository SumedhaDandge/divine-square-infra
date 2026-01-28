import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { FloatingActionButton } from "./FloatingActionButton";

interface AppShellProps {
  children: ReactNode;
  showNav?: boolean;
  showBottomNav?: boolean;
  showFab?: boolean; // Restored
  fabAction?: () => void; // Restored
}

export function AppShell({ 
  children, 
  showNav = true,
  showBottomNav = true,
  showFab = true, // Restored default
  fabAction 
}: AppShellProps) {
  return (
    <div className="app-shell">
      {children}
      {showFab && fabAction && <FloatingActionButton onClick={fabAction} />}
      {(showNav || showBottomNav) && <BottomNav />}
    </div>
  );
}
