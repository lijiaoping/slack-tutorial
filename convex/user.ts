import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "./_generated/server";
export const current = query({
  args: {},
  handler: async (ctx) => {
    // 获取当前权限用户的id；
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }
    //获取数据库用户详息
    return await ctx.db.get(userId);
  },
});
