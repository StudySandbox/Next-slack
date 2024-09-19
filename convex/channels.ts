import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return [];
    }

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (query) => {
        return query.eq("workspaceId", args.workspaceId).eq("userId", userId);
      })
      .unique();

    // 유저가 해당 워크스페이스의 멤버가 아닐 때
    if (!member) {
      return [];
    }

    const channels = await ctx.db
      .query("channels")
      .withIndex("by_workspace_id", (query) => {
        return query.eq("workspaceId", args.workspaceId);
      })
      .collect();

    return channels;
  },
});
