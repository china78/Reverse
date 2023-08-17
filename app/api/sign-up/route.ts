import { NextResponse } from "next/server";
import prisma from "../../db/prisma";
import bcrypt from "bcrypt";

// POST /api/sign-up
// Required fields in body: username, password @see prisma\schema.prisma
export async function POST(req: Request) {
  const { username, password } = await req.json();
  try {
    const hashedPassword = await bcrypt.hash(password, 10); // 使用 bcrypt 进行密码加密
    const result = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });
    return NextResponse.json(result, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(
      { error },
      {
        status: 500,
      },
    );
  }
}
