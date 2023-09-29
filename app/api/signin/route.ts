import { NextResponse, NextRequest } from "next/server";
import { CASDOOR } from "@/app/constant";
import { SDK } from "casdoor-nodejs-sdk";

// 你的 casdoor 公钥证书，在 casdoor 面板中可以找到
export async function POST(req: NextRequest) {
  const authCfg: any = {
    endpoint: CASDOOR.endpoint,
    clientId: CASDOOR.clientId,
    clientSecret: CASDOOR.clientSecret,
    certificate: "",
    orgName: CASDOOR.organizationName,
    appName: CASDOOR.appName,
  };

  if (process.env.CASDOORCERT) {
    authCfg.certificate = Buffer.from(process.env.CASDOORCERT); // Buffer.from(process.env.CASDOORCERT)
  } else {
    return;
  }

  const sdk = new SDK(authCfg);

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
