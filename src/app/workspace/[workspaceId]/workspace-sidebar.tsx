import { useCurrentMember } from "@/app/features/members/api/use-current-member";
import { useGetWorkspace } from "@/app/features/workspaces/api/use-get-wrokspace";
import { useWorkspaceId } from "@/app/hooks/use-workspace-id";
import { AlertTriangle, Loader } from "lucide-react";

import WorkspaceHeader from "@/app/workspace/[workspaceId]/workspace-header"

const WorkspaceSidebar = () => {
  const workspaceId = useWorkspaceId();
  const { data: member, isLoading: memberLoading } = useCurrentMember({
    workspaceId,
  });
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
    id: workspaceId,
  });
  if (workspaceLoading || memberLoading) {
    return (
      <div className="flex flex-col bg-[#5e2c5f] items-center justify-center">
        <Loader className="size-5 animate-spin text-white"></Loader>
      </div>
    );
  }
  if (!workspace || !member) {
    return (
      <div className="flex flex-col bg-[#5e2c5f] items-center justify-center">
        <AlertTriangle className="size-5 text-white" />
        <p className="text-white text-sm">Workspace not fouund </p>
      </div>
    );
  }
  return (
    <div className="flex flex-col bg-[#5e2c5f]">
      <WorkspaceHeader workspace={workspace} isAdmin={member.role === "admin"}/>
    </div>
  );
};

export default WorkspaceSidebar;
