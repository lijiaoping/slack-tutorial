import { usePathname } from "next/navigation";
import { Bell, Home, MessagesSquare, MoreHorizontal } from "lucide-react";
import UserButton from "@/app/features/auth/components/user-button";
import WorkspaceSwitcher from "@/app/workspace/[workspaceId]/workspace-switcher";
import SidebarButton from "@/app/workspace/[workspaceId]/SidebarButton";

const Sidebar = () => {
  const pathname = usePathname();
  return (
    <aside className="w-[70px] h-full bg-[#481349] flex flex-col gap-y-4 items-center pt-4">
      <WorkspaceSwitcher />
      <SidebarButton
        icon={Home}
        label="首页"
        isActive={pathname.includes("/workspace")}
      />
      <SidebarButton icon={MessagesSquare} label="DMs" />
      <SidebarButton icon={Bell} label="活动" />
      <SidebarButton icon={MoreHorizontal} label="更多" />
      <div className="flex flex-col items-center justify-center gap-y-1 mt-auto">
        <UserButton />
      </div>
    </aside>
  );
};

export default Sidebar;
