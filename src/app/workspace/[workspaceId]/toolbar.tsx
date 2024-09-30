import { useState } from "react";
import { Info, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

import { useWorkspaceId } from "@/hooks/use-workspace-id";

import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";

export const Toolbar = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const { data } = useGetWorkspace({ id: workspaceId });
  const { data: channels } = useGetChannels({ workspaceId });
  const { data: members } = useGetMembers({ workspaceId });

  const [open, setOpen] = useState(false);

  const onChannelClick = (channelId: string) => {
    setOpen(false);

    router.push(`/workspace/${workspaceId}/channel/${channelId}`);
  };

  const onMemberClick = (memberId: string) => {
    setOpen(false);

    router.push(`/workspace/${workspaceId}/member/${memberId}`);
  };

  return (
    <nav className="flex h-10 items-center justify-between bg-[#481349] p-1.5">
      <div className="flex-1" />
      <div className="min-w-[280px] max-w-[642px] shrink grow-[2]">
        <Button
          size="sm"
          onClick={() => setOpen(true)}
          className="hover:bg-accent-25 h-7 w-full justify-start bg-accent/25 px-2"
        >
          <Search className="mr-2 size-4 text-white" />
          <span className="text-wthie text-xs">Search {data?.name}</span>
        </Button>

        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>

            <CommandGroup heading="Channels">
              {channels?.map((channel) => (
                <CommandItem
                  key={channel._id}
                  onSelect={() => onChannelClick(channel._id)}
                >
                  {channel.name}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Members">
              {members?.map((member) => (
                <CommandItem
                  key={member._id}
                  onSelect={() => onMemberClick(member._id)}
                >
                  {member.user.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </div>

      <div className="ml-auto flex flex-1 items-center justify-end">
        <Button variant="transparent" size="iconSm">
          <Info className="size-5 text-white" />
        </Button>
      </div>
    </nav>
  );
};
