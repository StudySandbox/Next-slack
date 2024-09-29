"use client";

import { toast } from "sonner";
import { useEffect, useState } from "react";
import { AlertTriangle, Loader } from "lucide-react";

import { useMemberId } from "@/hooks/use-member-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

import { useCreateOrGetConversation } from "@/features/conversations/api/use-create-or-get-conversation";

import { Conversation } from "./conversation";
import { Id } from "../../../../../../convex/_generated/dataModel";

const MemberIdPage = () => {
  const memberId = useMemberId();
  const workspaceId = useWorkspaceId();

  const [conversationId, setConversationId] =
    useState<Id<"conversations"> | null>(null);

  const { mutate, isPending } = useCreateOrGetConversation();

  useEffect(() => {
    mutate(
      {
        workspaceId,
        memberId,
      },
      {
        onSuccess(data) {
          setConversationId(data);
        },
        onError() {
          toast.error("Failed to create or get conversation", {
            id: "create-or-get-conversation",
          });
        },
      },
    );
  }, [memberId, workspaceId, mutate]);

  if (isPending) {
    return (
      <div className="flex h-full flex-1 items-center justify-center">
        <Loader className="text-muted-forground size-5 animate-spin" />
      </div>
    );
  }

  if (!conversationId) {
    return (
      <div className="flex h-full flex-1 flex-col items-center justify-center gap-y-2">
        <AlertTriangle className="text-muted-forground size-6" />
        <span className="text-sm text-muted-foreground">
          Conversation not found
        </span>
      </div>
    );
  }

  return <Conversation id={conversationId} />;
};

export default MemberIdPage;
