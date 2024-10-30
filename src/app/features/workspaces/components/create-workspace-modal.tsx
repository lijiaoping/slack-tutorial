import { useState } from "react";
import { useRouter } from "next/navigation";
import  {toast} from "sonner"
import { useCreateWorkspace } from "@/app/features/workspaces/api/use-crate-workspace";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateWorkspaceModal } from "@/app/features/workspaces/store/use-create-workspace-modal";

export const CreateWorkspaceModal = () => {
  const router = useRouter()
  const [open, setOpen] = useCreateWorkspaceModal();
  const { mutate, isPending } = useCreateWorkspace();

  const [name, setName] = useState("");
  const handleClose = () => {
    setOpen(false);
    setName("")
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(
      { name },
      {
        onSuccess(id) {
          toast.success("创建 workspace 成功")
          router.replace(`/workspace/${id}`)
          handleClose();
        },
      }
    );
  };
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a workspace</DialogTitle>
        </DialogHeader>
        <form className="space-y-2.5" onSubmit={handleSubmit}>
          <Input
            value={name}
            disabled={isPending}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
            minLength={3}
            placeholder="工作区名称,例如 'Work' , 'Personal', 'Home'"
          />
          <div className="flex justify-end">
            <Button disabled={isPending} type="submit">Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
