import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { FloatingActionButton } from "./FloatingActionButton";

interface AppShellProps {
  children: ReactNode;
  showNav?: boolean;
  showBottomNav?: boolean;
  showFab?: boolean;
  fabAction?: () => void;
}

export function AppShell({ 
  children, 
  showNav = true,
  showBottomNav = true,
  showFab = true,
  fabAction 
}: AppShellProps) {
  return (
    <div className="app-shell">
      {children}
      {showFab && <FloatingActionButton onClick={fabAction} />}
      {(showNav || showBottomNav) && <BottomNav />}
    </div>
  );
}
