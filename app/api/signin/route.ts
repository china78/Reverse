import { NextResponse, NextRequest } from "next/server";
import { homedir } from "os";
import { readFileSync } from "fs";
import { join } from "path";
import { SDK } from "casdoor-nodejs-sdk";
import { CASDOOR } from "@/app/constant";

// 你的 casdoor 公钥证书，在 casdoor 面板中可以找到
const cert = readFileSync(join(homedir(), ".ssh", "casdoor.pub"), "utf-8");

console.log("--------------- cert --------------: ", cert);

const authCfg = {
  endpoint: CASDOOR.endpoint,
  clientId: CASDOOR.clientId,
  clientSecret: CASDOOR.clientSecret,
  certificate: cert,
  orgName: CASDOOR.organizationName,
  appName: CASDOOR.appName,
};

const sdk = new SDK(authCfg);

export async function POST(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (code === null || state === null) {
    return NextResponse.json(
      { error: "Invalid code or state" },
      { status: 400 },
    );
  }

  try {
    const result = await sdk.getAuthToken(code);
    return NextResponse.json({ data: result, status: "ok" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error, status: "error" }, { status: 500 });
  }
}
