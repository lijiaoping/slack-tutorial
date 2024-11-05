import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

const generateCode = () => {
  const code = Array.from(
    { length: 6 },
    () => "0123456789abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 36)]
  ).join("");
  console.log(code);

  return code;
};

//验证邀请码  邀请成员
export const join = mutation({
  args: {
    joinCode: v.string(),
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("当前无权限");
    }
    const workspace = await ctx.db.get(args.workspaceId);
    if (!workspace) {
      throw new Error("Workspace not found");
    }
    if (workspace.joinCode !== args.joinCode.toLowerCase()) {
      throw new Error("输入正确的邀请码");
    }
    //邀请的用户存在的情况
    const existingMember = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique();
      if(existingMember) {
        throw new Error("已经是该用户的活跃成员");
      }
      // 邀请的成员不可有权限
      await ctx.db.insert("members",{
        userId,
        workspaceId:workspace._id,
        role: "members"
      })
      return workspace._id;
  },
});
// 更新 generateCode 验证码
export const newJoinCode = mutation({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("当前无权限");
    }
    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique();
    if (!member || member.role !== "admin") {
      throw new Error("当前用户没有权限");
    }
    const joinCode = generateCode();
    await ctx.db.patch(args.workspaceId, {
      joinCode,
    });
    return args.workspaceId;
  },
});

// 创建workspace数据(工作区)
export const create = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("当前无权限");
    }
    const joinCode = generateCode();
    // 创建工作区
    const workspaceId = await ctx.db.insert("workspaces", {
      name: args.name,
      userId,
      joinCode,
    });
    //创建 成员
    await ctx.db.insert("members", {
      userId,
      workspaceId,
      role: "admin",
    });
    //创建 频道
    await ctx.db.insert("channels", {
      name: "general",
      workspaceId,
    });
    return workspaceId;
  },
});
// 获取全部workspace数据
export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }
    /* 查询当前登录用户的所有成员  区分用户*/
    const members = await ctx.db
      .query("members")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .collect();
    /* 根据members 存储的workspaceId 查询 workspace*/
    const workspaceIds = members.map((members) => members.workspaceId);
    const workspaces = [];
    for (const workspaceId of workspaceIds) {
      const workspace = await ctx.db.get(workspaceId);
      if (workspace) {
        workspaces.push(workspace);
      }
    }
    return workspaces;
  },
});
// 获取workspace(工作区是否有成员)
export const getInfoById = query({
  args: {id:v.id("workspaces")},
  handler:async (ctx,args) => {
    // 当前登录用户的ID
    const userId = await getAuthUserId(ctx);
    if (!userId) {
     return null;
    }
    /*根据当前登录用户id 工作区id查询指定的成员*/
    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.id).eq("userId", userId)
      )
      .unique();
    const workspace = await ctx.db.get(args.id);
    return {
      name: workspace?.name,
      isMember: !!member    // 是否有成员
    }
  }
})
// 获取当workspaceID 的信息
export const getById = query({
  args: { id: v.id("workspaces") },
  handler: async (ctx, args) => {
    // 当前登录用户的ID
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("当前用户无权限");
    }
    /*根据当前登录用户id 工作区id查询指定的成员*/
    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.id).eq("userId", userId)
      )
      .unique();
    if (!member) return null;
    return await ctx.db.get(args.id);
  },
});
// 更新工作名
export const update = mutation({
  args: {
    id: v.id("workspaces"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    // 当前登录用户的ID
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("当前用户无权限");
    }
    /*根据当前登录用户id 工作区id查询指定的成员*/
    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.id).eq("userId", userId)
      )
      .unique();
    if (!member || member.role !== "admin") {
      throw new Error("当前用户无权限");
    }
    await ctx.db.patch(args.id, {
      name: args.name,
    });
    return args.id;
  },
});
//删除工作区
export const remove = mutation({
  args: {
    id: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    // 当前登录用户的ID
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("当前用户无权限");
    }
    /*根据当前登录用户id 工作区id查询指定的成员*/
    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.id).eq("userId", userId)
      )
      .unique();
    if (!member || member.role !== "admin") {
      throw new Error("当前用户无权限");
    }
    // 删除workspace(工作区同时删除所有的创建的(members))
    const [members] = await Promise.all([
      ctx.db
        .query("members")
        .withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.id))
        .collect(),
    ]);
    for (const member of members) {
      await ctx.db.delete(member._id);
    }
    await ctx.db.delete(args.id);
    return args.id;
  },
});
