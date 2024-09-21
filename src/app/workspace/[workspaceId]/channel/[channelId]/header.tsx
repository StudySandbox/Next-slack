import { toast } from "sonner";
import { useState } from "react";
import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { FaChevronDown } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { useUpdateChannel } from "@/features/channels/api/use-update-channel";
import { useRemoveChannel } from "@/features/channels/api/use-remove-channel";

import { useConfirm } from "@/hooks/use-confirm";
import { useChannelId } from "@/hooks/use-channel-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useCurrentMember } from "@/features/members/api/use-current-member";

interface HeaderProps {
  title: string;
}

export const Header = ({ title }: HeaderProps) => {
  const router = useRouter();
  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();
  const [ConfirmDialog, confirm] = useConfirm(
    "Delete this channel?",
    "You are about to delete this channel. This action is irreversible",
  );

  const [value, setValue] = useState(title);
  const [editOpen, setEditOpen] = useState(false);

  const { data: member } = useCurrentMember({ workspaceId });
  const { mutate: updateChannel, isPending: isUpdatingChannel } =
    useUpdateChannel();
  const { mutate: removeChannel, isPending: isRemovingChannel } =
    useRemoveChannel();

  const handleEditOpen = (value: boolean) => {
    if (member?.role !== "admin") return;

    setEditOpen(value);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\s+/g, "-").toLocaleLowerCase();
    setValue(value);
  };

  const handleDelete = async () => {
    const ok = await confirm();

    if (!ok) return;

    removeChannel(
      { id: channelId },
      {
        onSuccess: () => {
          toast.success("Channel deleted", { id: "delete-channel" });
          router.replace(`/workspace/${workspaceId}`);
        },
        onError: () => {
          toast.error("Failed to delete channel");
        },
      },
    );
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    updateChannel(
      { id: channelId, name: value },
      {
        onSuccess: () => {
          toast.success("Channel updated", { id: "update-channel" });
          setEditOpen(false);
        },
        onError: () => {
          toast.error("Failed to update channel", { id: "update-channel" });
        },
      },
    );
  };

  return (
    <>
      <ConfirmDialog />
      <div className="flex h-[49px] items-center overflow-hidden border-b bg-white px-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="w-auto overflow-hidden px-2 text-lg font-semibold"
              size="sm"
            >
              <span># {title}</span>
              <FaChevronDown className="ml-2 size-2.5" />
            </Button>
          </DialogTrigger>

          <DialogContent className="overflow-hidden bg-gray-50 p-0">
            <DialogHeader className="border-b bg-white p-4">
              <DialogTitle># {title}</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-y-2 px-4 pb-4">
              <Dialog open={editOpen} onOpenChange={handleEditOpen}>
                <DialogTrigger asChild>
                  <div className="cursor-pointer rounded-lg border bg-white px-5 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">Channel name</p>
                      {member?.role === "admin" && (
                        <p className="text-sm font-semibold text-[#1264a3] hover:underline">
                          Edit
                        </p>
                      )}
                    </div>
                    <p className="text-sm"># {title}</p>
                  </div>
                </DialogTrigger>

                <DialogContent className="bg-white">
                  <DialogHeader>
                    <DialogTitle>Rename this channel</DialogTitle>
                  </DialogHeader>
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <Input
                      value={value}
                      disabled={isUpdatingChannel}
                      onChange={handleChange}
                      autoFocus
                      minLength={3}
                      maxLength={80}
                      placeholder="e.g. plan-budget"
                    />
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline" disabled={isUpdatingChannel}>
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button disabled={isUpdatingChannel} type="submit">
                        Save
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
              {member?.role === "admin" && (
                <button
                  onClick={handleDelete}
                  disabled={isRemovingChannel}
                  className="flex cursor-pointer items-center gap-x-2 rounded-lg border bg-white px-5 py-4 text-rose-600 hover:bg-gray-50"
                >
                  <TrashIcon className="size-4" />
                  <p className="text-sm font-semibold">Delete channel</p>
                </button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};
