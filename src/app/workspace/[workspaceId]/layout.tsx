"use client";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

import Toolbar from "@/app/workspace/[workspaceId]/toolbar";
import Sidebar from "@/app/workspace/[workspaceId]/Sidebar";
import WorkspaceSidebar from "@/app/workspace/[workspaceId]/workspace-sidebar";


interface WrokspaceLayoutProps {
  children: React.ReactNode;
}

const WorkspaceLayout = ({ children }: WrokspaceLayoutProps) => {
  return (
    <div className=" h-ful">
      <Toolbar />
      <div className="flex h-[calc(100vh-40px)]">
        <Sidebar />
        <ResizablePanelGroup direction="horizontal" autoSaveId="ca-workspace-layout">
          <ResizablePanel defaultSize={20} minSize={11} className="bg-[#5e2c5f]">
            <WorkspaceSidebar/>
          </ResizablePanel>
          <ResizableHandle withHandle></ResizableHandle>
          <ResizablePanel minSize={20}>{children}</ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default WorkspaceLayout;
