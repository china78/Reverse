import { NextResponse, NextRequest } from "next/server";
import prisma from "../../db/prisma";

export async function POST(req: NextRequest) {
  // 示例用法
  // const userId = 1; // 替换为实际的用户ID
  // const isMember = true; // 替换为实际的会员状态
  const { userId, isMember } = await req.json();

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isMember },
    });
    return NextResponse.json({ data: updatedUser }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
