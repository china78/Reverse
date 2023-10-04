import { NextResponse, NextRequest } from "next/server";
import moment from "moment";
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
      // console.log('----------- user --------: ', user)
      // 检查会员到期时间是否已过期
      const currentDateTime = moment();
      const expirationDateTime = moment(user.memberExpirationDate);
      const effectiveDate = currentDateTime.isBefore(expirationDateTime);
      // console.log('----------- 当前时间 --------: ', currentDateTime.format())
      // console.log('----------- 到期时间 --------: ', expirationDateTime.format())
      // console.log('----------- effectiveDate --------: ', effectiveDate)

      if (user.isMember && effectiveDate) {
        // 用户是会员，且没有到期，允许继续聊天
        return NextResponse.json(
          { upperLimit: false, member: true },
          { status: 200 },
        );
      } else if (user.usages < 10) {
        // 用户不是会员但使用次数未达到20次，可以继续
        return NextResponse.json(
          { upperLimit: false, member: false },
          { status: 200 },
        );
      } else {
        // 用户不是会员且使用次数已达到20次
        return NextResponse.json(
          { upperLimit: true, member: false },
          { status: 200 },
        );
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
