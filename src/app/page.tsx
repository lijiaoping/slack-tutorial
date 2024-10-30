"use client";
import UserButton from "@/app/features/auth/components/user-button";
import { useGetWorkspaces } from "@/app/features/workspaces/api/use-get-workspaces";
import { useCreateWorkspaceModal } from "@/app/features/workspaces/store/use-create-workspace-modal";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
export default function Home() {
  const router = useRouter();
  const [open, setOpen] = useCreateWorkspaceModal();
  //获取所有的workspace
  const { data, isLoading } = useGetWorkspaces();
  const workspaceId = useMemo(() => data?.[0]?._id, [data]);

  useEffect(() => {
    if (isLoading) return;
    if (workspaceId) {
      router.push(`/workspace/${workspaceId}`);
    } else if (!open) {
      setOpen(true);
    }
  }, [workspaceId, isLoading, open, setOpen, router]);
  return (
    <div className="h-full">
      <UserButton />
    </div>
  );
}
