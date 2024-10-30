"use client";
import { CreateWorkspaceModal } from "@/app/features/workspaces/components/create-workspace-modal";
import { useEffect, useState } from "react";
export const Modals = () => {
  // 解决水合错误
    const [mounted,setMounted] = useState(false);
    useEffect(() => {
        setMounted(true)
    },[])
    if(!mounted) return;
  return (
    <>
      <CreateWorkspaceModal />
    </>
  );
};
