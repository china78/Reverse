import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import { homedir } from "os";
import { CASDOOR } from "@/app/constant";
import { SDK } from "casdoor-nodejs-sdk";

export async function POST(req: NextRequest) {
  const { token } = await req.json();

  const authCfg = {
    endpoint: CASDOOR.endpoint,
    clientId: CASDOOR.clientId,
    clientSecret: CASDOOR.clientSecret,
    certificate: "",
    orgName: CASDOOR.organizationName,
    appName: CASDOOR.appName,
  };

  if (process.env.CASDOORCERT) {
    authCfg.certificate = process.env.CASDOORCERT;
  } else {
    return;
  }

  const sdk = new SDK(authCfg);

  try {
    const result = await sdk.parseJwtToken(token);
    return NextResponse.json({ data: result }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
