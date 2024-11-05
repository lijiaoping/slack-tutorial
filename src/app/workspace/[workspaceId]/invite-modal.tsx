import { CopyIcon, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useWorkspaceId } from "@/app/hooks/use-workspace-id";

import { useNewJoinCode } from "@/app/features/workspaces/api/use-new-join_code";
import { useConfirm } from "@/app/hooks/use-confirm";

interface InviteModalProps {
  open: boolean;
  name: string;
  joinCode: string;
  setOpen: (open: boolean) => void;
}
export const InviteModal = ({
  open,
  setOpen,
  joinCode,
  name,
}: InviteModalProps) => {
  const workspaceId = useWorkspaceId();
  const [ConfirmDialog, confirm] = useConfirm(
    "是否确定？",
    "这将停用当前的邀请码并生成新的邀请码."
  );

  const { mutate, isPending } = useNewJoinCode();
  const handleNewCode = async () => {
    const ok = await confirm();
    if (!ok) return null;
    mutate(
      { workspaceId },
      {
        onSuccess: () => {
          toast.success("生成邀请码成功");
        },
        onError: () => {
          toast.error("生成邀请码失败");
        },
      }
    );
  };
  const hanleCopy = () => {
    //http://localhost:3000/join/k573nx9p5nzn7nv8e1nwhk7k1d73x0wv
    const inviteLink = `${window.location.origin}/join/${workspaceId}`;
    // 浏览器复制api
    navigator.clipboard.writeText(inviteLink).then(() => {
      toast.success("复制成功");
    });
  };
  return (
    <>
      <ConfirmDialog />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>邀请他人加入 {name}</DialogTitle>
            <DialogDescription>
              使用以下代码邀请他人加入您的工作区
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-y-4 items-center justify-center py-10">
            <p className="text-4xl font-bold tracking-widest uppercase">
              {joinCode}
            </p>
            <Button variant="ghost" size="sm" onClick={hanleCopy}>
              复制邀请码
              <CopyIcon className="size-4 ml-2" />
            </Button>
          </div>
          <div className="flex items-center justify-between w-full">
            <Button
              disabled={isPending}
              onClick={handleNewCode}
              variant="outline"
            >
              生成邀请码 <RefreshCcw className="size-4 ml-2" />
            </Button>
            <DialogClose asChild>
              <Button>取消</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
