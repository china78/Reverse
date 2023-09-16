import { NextResponse, NextRequest } from "next/server";
import { SDK } from "casdoor-nodejs-sdk";
import { CASDOOR } from "@/app/constant";

// const cert = readFileSync(join(homedir(), ".ssh", "casdoor.pub"), "utf-8");

export async function GET(req: NextRequest) {
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
    const result = await sdk.getUsers();
    return NextResponse.json({ data: result, status: "ok" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error, status: "error" }, { status: 500 });
  }
}
