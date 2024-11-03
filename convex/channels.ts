import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
export const create = mutation({
  args: {
    name: v.string(),
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("当前用户没有权限");
    }
    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) => {
        return q.eq("workspaceId", args.workspaceId).eq("userId", userId);
      })
      .unique();
    if (!member) {
      throw new Error("当前用户没有权限");
    }
    //防止名称绕过前端
    const parsedName = args.name.replace(/\s+/g,"-").toLowerCase();
    const channelId = await ctx.db.insert("channels",{
      name: parsedName,
      workspaceId: args.workspaceId
    })
    return channelId
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
      .withIndex("by_workspace_id_user_id", (q) => {
        return q.eq("workspaceId", args.workspaceId).eq("userId", userId);
      })
      .unique();
    if (!member) {
      return [];
    }
    const channels = await ctx.db
      .query("channels")
      .withIndex("by_workspace_id", (q) => {
        return q.eq("workspaceId", args.workspaceId);
      })
      .collect();
    return channels;
  },
});
