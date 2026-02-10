import { ReactNode } from "react";
import { cn } from "@/lib/utils";
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
    <div className={cn("app-shell", (!(showNav || showBottomNav)) && "!pb-0")}>
      {children}
      {showFab && fabAction && <FloatingActionButton onClick={fabAction} />}
      {(showNav || showBottomNav) && <BottomNav />}
    </div>
  );
}
