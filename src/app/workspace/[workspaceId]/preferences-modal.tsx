import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogClose,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { TrashIcon } from "lucide-react";
import { useUpdateWorkspace } from "@/app/features/workspaces/api/use-update-workspace";
import { useRemoveWorkspace } from "@/app/features/workspaces/api/use-remove-workspace";

import { useWorkspaceId } from "@/app/hooks/use-workspace-id";
import { useConfirm } from "@/app/hooks/use-confirm";

interface PreferencesModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  initialValue: string;
}
export const PreferencesModal = ({
  open,
  setOpen,
  initialValue,
}: PreferencesModalProps) => {
  const [ConfirmDialog, confirm] = useConfirm("确定要删除？", "此操作不可逆");
  const workspaceId = useWorkspaceId();
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [value, setValue] = useState(initialValue);
  const { mutate: updateWorkspace, isPending: isUpdateWorkspace } =
    useUpdateWorkspace();
  const { mutate: removeWorkspace, isPending: isRemoveWorkspace } =
    useRemoveWorkspace();

  //edit
  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateWorkspace(
      {
        id: workspaceId,
        name: value,
      },
      {
        onSuccess: () => {
          setEditOpen(false);
          toast.success("workspace更新成功");
        },
        onError: () => {
          toast.error("workspace更新失败");
        },
      }
    );
  };

  //delete

  const handleRemove = async () => {
    const ok = await confirm();
    if(!ok) return;
    removeWorkspace(
      { id: workspaceId },
      {
        onSuccess: () => {
          toast.success("删除workspace成功");
          router.replace("/");
        },
        onError: () => {
          toast.error("删除workspace失败");
        },
      }
    );
  };
  return (
    <>
    <ConfirmDialog/>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 bg-gray-50 overflow-hidden">
          <DialogHeader className="p-4 border-b bg-white">
            <DialogTitle>{value}</DialogTitle>
          </DialogHeader>
          <div className="px-4 pb-4 flex flex-col gap-y-2">
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger asChild>
                <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Workspace name</p>
                    <p className="text-sm text-[#1264a3] hover:underline font-semibold">
                      编辑
                    </p>
                  </div>
                  <p className="text-sm">{value}</p>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>更新工作区</DialogTitle>
                </DialogHeader>
                <form className=" space-y-4" onSubmit={handleEdit}>
                  <Input
                    value={value}
                    autoFocus
                    minLength={3}
                    maxLength={40}
                    onChange={(e) => setValue(e.target.value)}
                    disabled={isUpdateWorkspace}
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" disabled={isUpdateWorkspace}>
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button disabled={isUpdateWorkspace}>Save</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <button
              disabled={isRemoveWorkspace}
              onClick={() => {
                handleRemove();
              }}
              className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 text-rose-500"
            >
              <TrashIcon className="size-4" />
              <p className="text-sm font-semibold">删除工作区</p>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
