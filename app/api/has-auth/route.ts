import jwt from "jsonwebtoken";
import prisma from "../../db/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const headers = req.headers;
  const token = headers.get("authorization")?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 验证并解码令牌
    const decodedToken = jwt.verify(token, "default-key") as {
      userId: number;
      username: string;
    };
    console.log("decodedToken: ", decodedToken);
    // 根据用户ID查找用户
    const user = await prisma.user.findUnique({
      where: { id: decodedToken.userId },
    });

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 返回用户数据
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
