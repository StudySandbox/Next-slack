import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { CopyIcon } from "lucide-react";
import { toast } from "sonner";

interface InviteModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  name: string;
  joinCode: string;
}

export const InviteModal = ({
  open,
  setOpen,
  name,
  joinCode,
}: InviteModalProps) => {
  const workspaceId = useWorkspaceId();

  const handleCopy = () => {
    const inviteLink = `${window.location.origin}/join/${workspaceId}`;

    navigator.clipboard
      .writeText(inviteLink)
      .then(() => toast.success("Invite link copied to clipboard"));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Invite people to {name}</DialogTitle>
          <DialogDescription>
            Use the code below to invite people to your workspace
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center gap-y-4 py-10">
          <p className="text-4xl font-bold uppercase tracking-widest">
            {joinCode}
          </p>
          <Button variant="ghost" size="sm" onClick={handleCopy}>
            Copy link
            <CopyIcon className="ml-2 size-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
