import { NextResponse, NextRequest } from "next/server";
import prisma from "../../db/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// POST /api/login
// Required fields in body: username, password
export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 },
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 },
      );
    }

    // Store user session or generate token for authentication
    // ...
    // 生成 JWT 令牌
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      "default-key",
    );
    return NextResponse.json(
      {
        message: "Login successful",
        token,
        envCode: process.env.CODE,
        userId: user.id,
        username: user.username,
        usages: user.usages,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
