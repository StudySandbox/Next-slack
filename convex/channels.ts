import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const remove = mutation({
  args: {
    id: v.id("channels"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const channel = await ctx.db.get(args.id);
    if (!channel) {
      throw new Error("Channel not found");
    }

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (query) => {
        return query
          .eq("workspaceId", channel.workspaceId)
          .eq("userId", userId);
      })
      .unique();

    if (!member || member.role !== "admin") {
      throw new Error("Unauthorized");
    }

    // TODO: Remove associated messages

    await ctx.db.delete(args.id);

    return args.id;
  },
});

export const update = mutation({
  args: {
    id: v.id("channels"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const channel = await ctx.db.get(args.id);
    if (!channel) {
      throw new Error("Channel not found");
    }

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (query) => {
        return query
          .eq("workspaceId", channel.workspaceId)
          .eq("userId", userId);
      })
      .unique();

    if (!member || member.role !== "admin") {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.id, {
      name: args.name,
    });

    return args.id;
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (query) => {
        return query.eq("workspaceId", args.workspaceId).eq("userId", userId);
      })
      .unique();

    if (!member || member.role !== "admin") {
      throw new Error("Unauthorized");
    }

    const parsedName = args.name.replace(/\s+/g, "-").toLowerCase();

    const channelId = await ctx.db.insert("channels", {
      name: parsedName,
      workspaceId: args.workspaceId,
    });

    return channelId;
  },
});

export const getById = query({
  args: { id: v.id("channels") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return null;
    }

    const channel = await ctx.db.get(args.id);

    if (!channel) {
      return null;
    }

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (query) => {
        return query
          .eq("workspaceId", channel.workspaceId)
          .eq("userId", userId);
      })
      .unique();

    if (!member) {
      return null;
    }

    return channel;
  },
});

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
