"use client";

import { useGetChannel } from "@/features/channels/api/use-get-channel";

import { useChannelId } from "@/hooks/use-channel-id";
import { Loader, TriangleAlert } from "lucide-react";
import { Header } from "./header";

const ChannelIdPage = () => {
  const channelId = useChannelId();

  const { data: channel, isLoading: channelLoading } = useGetChannel({
    id: channelId,
  });

  if (channelLoading) {
    return (
      <div className="flex h-full flex-1 items-center justify-center">
        <Loader className="text-muted-forground size-5 animate-spin" />
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="flex h-full flex-1 flex-col items-center justify-center gap-y-2">
        <TriangleAlert className="text-muted-forground size-6" />
        <span className="text-sm text-muted-foreground">Channel not found</span>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <Header title={channel.name} />
    </div>
  );
};

export default ChannelIdPage;
