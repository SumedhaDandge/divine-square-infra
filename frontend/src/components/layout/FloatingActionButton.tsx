import { Plus } from "lucide-react";

interface FloatingActionButtonProps {
  onClick?: () => void;
}

export function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
  return (
    <button className="fab" onClick={onClick} aria-label="Add new">
      <Plus className="w-6 h-6" />
    </button>
  );
}
