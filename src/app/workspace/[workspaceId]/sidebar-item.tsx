import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { IconType } from "react-icons/lib";
import { cva, type VariantProps } from "class-variance-authority";

import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/app/hooks/use-workspace-id";
import { cn } from "@/lib/utils";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const sidebarItemVariants = cva(
  "flex item-center gap-1.5 justify-start font-normal h-7 px-[18px] text-sm overflow-hidden",
  {
    variants: {
      variant: {
        default : "text-[#f9edffcc]",
        active: "text-[#481349] bg-white/90 hover:bg-white/90"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

interface SidebarItemProps {
  label: string;
  id: string;
  icon: IconType | LucideIcon;
  variant?: VariantProps<typeof sidebarItemVariants>["variant"]
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const SidebarItem = ({ label, id, icon: Icon,variant}: SidebarItemProps) => {
  const workspaceId = useWorkspaceId();
  return (
    <Button asChild variant="transparent" size="sm" className={cn(sidebarItemVariants({variant}))}>
      <Link href={`/workspace/${workspaceId}/channel/${id}`}>
        <Icon className="size-3.5 mr-1 shrink-0"/>
        <span className=" text-sm truncate">{label}</span>
      </Link>
    </Button>
  );
};
