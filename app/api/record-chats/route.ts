import { NextResponse, NextRequest } from "next/server";
import prisma from "../../db/prisma";

export async function POST(req: NextRequest) {
  const { id } = await req.json();
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        usages: user.usages + 1,
      },
    });

    return NextResponse.json({ usages: updatedUser.usages }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
