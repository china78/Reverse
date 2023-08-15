import { NextResponse } from "next/server";
import prisma from "../../db/prisma";

// POST /api/sign-up
// Required fields in body: username, password @see prisma\schema.prisma
export async function POST(req: Request) {
  const { username, password } = await req.json();
  try {
    const result = await prisma.user.create({
      data: { username, password },
    });
    return NextResponse.json(result, {
      status: 201,
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
