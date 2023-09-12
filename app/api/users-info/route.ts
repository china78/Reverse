import { NextResponse, NextRequest } from "next/server";
import { homedir } from "os";
import { readFileSync } from "fs";
import { join } from "path";
import { SDK } from "casdoor-nodejs-sdk";
import { CASDOOR } from "@/app/constant";

const cert = readFileSync(join(homedir(), ".ssh", "casdoor.pub"), "utf-8");
const authCfg = {
  endpoint: CASDOOR.endpoint,
  clientId: CASDOOR.clientId,
  clientSecret: CASDOOR.clientSecret,
  certificate: cert,
  orgName: CASDOOR.organizationName,
  appName: CASDOOR.appName,
};
const sdk = new SDK(authCfg);

export async function GET(req: NextRequest) {
  try {
    const result = await sdk.getUsers();
    return NextResponse.json({ data: result, status: "ok" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error, status: "error" }, { status: 500 });
  }
}
