import { NextResponse, NextRequest } from "next/server";
import prisma from "../../db/prisma";

export async function POST(req: NextRequest) {
  const { id } = await req.json();

  try {
    // 查询用户的使用次数和会员状态
    const user = await prisma.user.findUnique({
      where: { id },
      select: { usages: true, isMember: true, memberExpirationDate: true },
    });

    if (user) {
      // 检查会员到期时间是否已过期
      const currentDateTime = new Date();
      const expirationDateTime = new Date(user.memberExpirationDate!);
      const effectiveDate = currentDateTime < expirationDateTime;

      if (user.isMember && effectiveDate) {
        // 用户是会员，且没有到期，允许继续聊天
        return NextResponse.json({ upperLimit: false }, { status: 200 });
      } else if (user.usages < 10) {
        // 用户不是会员但使用次数未达到20次，可以继续
        return NextResponse.json({ upperLimit: false }, { status: 200 });
      } else {
        // 用户不是会员且使用次数已达到20次
        return NextResponse.json({ upperLimit: true }, { status: 200 });
      }
    } else {
      // 用户不存在
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
