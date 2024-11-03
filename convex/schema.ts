import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";
const schema = defineSchema({
  ...authTables,
  workspaces: defineTable({  //工作区数据表格
    name: v.string(),
    userId: v.id("users"),
    joinCode: v.string(),
  }),
  //成员表格
  members: defineTable({
    userId: v.id("users"),
    workspaceId: v.id("workspaces"),
    role: v.union(v.literal("admin"), v.literal("members")), //多种类型
  })
    .index("by_user_id", ["userId"])
    .index("by_workspace_id", ["workspaceId"])
    .index("by_workspace_id_user_id", ["workspaceId", "userId"]),
  //根据Id优化查询
  channels: defineTable({ //频道
    name: v.string(),
    workspaceId: v.id("workspaces")
  }).index("by_workspace_id",["workspaceId"]),
});

export default schema;
