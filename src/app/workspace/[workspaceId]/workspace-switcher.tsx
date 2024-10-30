import { Loader, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { useGetWorkspaces } from "@/app/features/workspaces/api/use-get-workspaces";
import { useGetWorkspace } from "@/app/features/workspaces/api/use-get-wrokspace";
import { useCreateWorkspaceModal } from "@/app/features/workspaces/store/use-create-workspace-modal";
import { useWorkspaceId } from "@/app/hooks/use-workspace-id";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const WorkspaceSwitcher = () => {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_open, setOpen] = useCreateWorkspaceModal();
  const workspaceId = useWorkspaceId();
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
    id: workspaceId,
  });
  const { data: workspaces } = useGetWorkspaces();
  const filteredWorkspaces = workspaces?.filter((workspace) => {
    return workspace?._id !== workspaceId;
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="size-9 relative overflow-hidden bg-[#ABABAD] hover:bg-[#ABABAD]/80 text-slate-800 font-semibold text-xl">
          {workspaceLoading ? (
            <Loader className="size-5 animate-spin shrink-0" />
          ) : (
            workspace?.name.charAt(0).toUpperCase()
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="start" className="w-64">
        <DropdownMenuItem
          onClick={() => router.push(`/workspace/${workspaceId}`)}
          className=" cursor-pointer flex-col justify-start items-start capitalize"
        >
          {workspace?.name}
          <span className="text-xs text-muted-foreground">在线状态</span>
        </DropdownMenuItem>
        {filteredWorkspaces?.map((workspace) => (
          <DropdownMenuItem
            key={workspace._id}
            className=" cursor-pointer capitalize overflow-hidden "
            onClick={() => router.push(`/workspace/${workspace._id}`)}
          >
            <div className=" shrink-0 truncate size-9 relative overflow-hidden bg-[#616061] text-white font-semibold text-lg rounded-md flex items-center justify-center mr-2">
              {workspace.name.charAt(0).toUpperCase()}
            </div>
            <p className="truncate">{workspace.name}</p>
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem
          className=" cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <div className="  size-9 relative overflow-hidden bg-[#616061] text-white font-semibold text-lg rounded-md flex items-center justify-center mr-2">
            <Plus />
          </div>
          创建工作区
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default WorkspaceSwitcher;
