"use client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import VerificationInput from "react-verification-input";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetWorkspaceInfo } from "@/app/features/workspaces/api/use-get-wrokspace-info";

import { useWorkspaceId } from "@/app/hooks/use-workspace-id";
import { useJoin } from "@/app/features/workspaces/api/use-join_code";


// interface JoinPageProps {
//   params: {
//     workspaceId: string;
//   };
// }
const JoinPage = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const { data, isLoading } = useGetWorkspaceInfo({ id: workspaceId });
  const { mutate, isPending } = useJoin();
  const isMember = useMemo(() => data?.isMember,[data?.isMember]);
  useEffect(() => {
    if(isMember) {
      router.push(`workspace/${workspaceId}`)
    }
  },[isMember,router,workspaceId])
  const handleCpmplete = (value: string) => {
    mutate(
      { workspaceId, joinCode: value },
      {
        onSuccess: (id) => {
          router.replace(`/workspace/${id}`);
          toast.success("已加入工作区.");
        },
        onError: () => {
          toast.error("无法加入工作区");
        },
      }
    );
  };
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-y-8 items-center justify-center bg-white p-8 rounded-lg shadow-md">
      <Image
        src="/logo.svg"
        width={80}
        height={80}
        alt="logo"
        priority={false}
      />
      <div className="flex flex-col gap-y-4 items-center justify-center max-w-md">
        <div className="flex flex-col gap-y-2 items-center justify-center">
          <h1 className="text-2xl font-bold">Join {data?.name}</h1>
          <p className="text-md text-muted-foreground">
            Enter the workspace code to join
          </p>
        </div>
        <VerificationInput
          onComplete={handleCpmplete}
          classNames={{
            container: cn("flex gap-x-2","opactiy-50 cursor-not-allpwed"),
            character:
              "uppercase h-auto rounded-md border border-gray-300 flex item-center justify-center text-lg font-medium text-gray-500",
            characterInactive: "bg-muted",
            characterSelected: "bg-white text-black",
            characterFilled: "bg-white text-black",
          }}
          autoFocus
          length={6}
        />
      </div>
      <div className="flex gap-x-4">
        <Button size="lg" variant="outline" asChild>
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
};
export default JoinPage;
