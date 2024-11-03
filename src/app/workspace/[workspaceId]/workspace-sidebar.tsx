import {
  AlertTriangle,
  HashIcon,
  Loader,
  MessageSquareText,
  SendHorizonal,
} from "lucide-react";

import { useGetMember } from "@/app/features/members/api/use-get-member";
import { useWorkspaceId } from "@/app/hooks/use-workspace-id";
import { UseGetChannel } from "@/app/features/channels/api/use-get-channels";

import { useGetWorkspace } from "@/app/features/workspaces/api/use-get-wrokspace";
import { useCurrentMember } from "@/app/features/members/api/use-current-member";

import { SidebarItem } from "@/app/workspace/[workspaceId]/sidebar-item";
import WorkspaceHeader from "@/app/workspace/[workspaceId]/workspace-header";
import { WorkspaceSection } from "@/app/workspace/[workspaceId]/workspace-section";
import { UserItem } from "@/app/workspace/[workspaceId]/user-item";

const WorkspaceSidebar = () => {
  const workspaceId = useWorkspaceId();
  const { data: member, isLoading: memberLoading } = useCurrentMember({
    workspaceId,
  });
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
    id: workspaceId,
  });
  const { data: channels, isLoading: channelsLoading } = UseGetChannel({
    workspaceId,
  });
  const { data: members, isLoading: membersLoading } = useGetMember({
    workspaceId,
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
      <WorkspaceHeader
        workspace={workspace}
        isAdmin={member.role === "admin"}
      />
      <div className="felx flex-col px-2 mt-3">
        <SidebarItem label="线程" icon={MessageSquareText} id="threads" />
        <SidebarItem label="Drafts & Sent" icon={SendHorizonal} id="drafts" />
      </div>
      <WorkspaceSection label="线程" hint="创建新线程" onNew={() => {}}>
        {channels?.map((item) => (
          <SidebarItem
            key={item._id}
            label={item.name}
            icon={HashIcon}
            id={item._id}
          />
        ))}
      </WorkspaceSection>
      <WorkspaceSection label="私信" hint="新的私信" onNew={() => {}}>
        {members?.map((item) => (
          <UserItem
            key={item._id}
            id={item._id}
            label={item.user.name}
            image={item.user.image}
          />
        ))}
      </WorkspaceSection>
    </div>
  );
};

export default WorkspaceSidebar;
