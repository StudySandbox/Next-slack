import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createOrGet = mutation({
  args: {
    memberId: v.id("members"),
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const currentMember = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (query) => {
        return query.eq("workspaceId", args.workspaceId).eq("userId", userId);
      })
      .unique();

    const otherMember = await ctx.db.get(args.memberId);

    if (!currentMember || !otherMember) {
      throw new Error("Member not found");
    }

    const existingConversation = await ctx.db
      .query("conversations")
      .filter((query) => query.eq(query.field("workspaceId"), args.workspaceId))
      .filter((query) =>
        query.or(
          query.and(
            query.eq(query.field("memberOneId"), currentMember._id),
            query.eq(query.field("memberTwoId"), otherMember._id),
          ),
          query.and(
            query.eq(query.field("memberOneId"), otherMember._id),
            query.eq(query.field("memberTwoId"), currentMember._id),
          ),
        ),
      )
      .unique();

    if (existingConversation) {
      return existingConversation._id;
    }

    const conversationId = await ctx.db.insert("conversations", {
      workspaceId: args.workspaceId,
      memberOneId: currentMember._id,
      memberTwoId: otherMember._id,
    });

    return conversationId;
  },
});
