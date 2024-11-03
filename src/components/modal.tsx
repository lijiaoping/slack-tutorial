"use client";
import { CreateWorkspaceModal } from "@/app/features/workspaces/components/create-workspace-modal";
import { useEffect, useState } from "react";
import { CreateChannelModal } from "@/app/features/channels/components/create-channel-modal";
export const Modals = () => {
  // 解决水合错误
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  return (
    <>
      <CreateWorkspaceModal />
      <CreateChannelModal/>
    </>
  );
};
