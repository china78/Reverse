import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import { db } from "../../db/index";

async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { username, password } = req.body;

    try {
      // 验证用户登录
      const user = await db.loginUser(username, password);

      if (user) {
        // 获取用户的个人信息
        const userInfo = {
          id: user.id,
          username: user.username,
          // 添加其他需要返回的用户信息字段
        };

        // 登录成功，返回用户信息
        return NextResponse.json(userInfo, { status: 200 });
      } else {
        // 登录失败
        return NextResponse.json(
          { message: "用户名或密码错误" },
          { status: 401 },
        );
      }
    } catch (error) {
      // 处理数据库查询错误
      console.error("登录时发生错误:", error);
      return NextResponse.json({ message: "登录时发生错误" }, { status: 500 });
    }
  }

  // 处理其他请求方法（GET、PUT、DELETE等）
  return res.status(404).end();
}

export const GET = handle;
export const POST = handle;

export const runtime = "edge";
