import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import { homedir } from "os";
import { CASDOOR } from "@/app/constant";
import { SDK } from "casdoor-nodejs-sdk";
import fs from "fs";

export async function POST(req: NextRequest) {
  const { token } = await req.json();

  const authCfg: any = {
    endpoint: CASDOOR.endpoint,
    clientId: CASDOOR.clientId,
    clientSecret: CASDOOR.clientSecret,
    certificate: "",
    orgName: CASDOOR.organizationName,
    appName: CASDOOR.appName,
  };

  const casdoorCert = fs.readFileSync("/Users/tianganggang/.ssh/casdoor.pub");
  console.log("--- casdoorCert1 ---: ", casdoorCert);
  console.log("--- casdoorCert2---: ", casdoorCert.toString());
  // console.log('--- process.env.CASDOORCERT --- :', Buffer.from(process.env.CASDOORCERT!));
  // authCfg.certificate = casdoorCert

  if (process.env.CASDOORCERT) {
    authCfg.certificate = Buffer.from(process.env.CASDOORCERT);
  } else {
    return;
  }

  console.log("--- casdoorCert1 ---: ", authCfg.certificate);
  console.log("--- casdoorCert2 ---: ", authCfg.certificate.toString());
  const sdk = new SDK(authCfg);

  try {
    const result = await sdk.parseJwtToken(token);
    return NextResponse.json({ data: result }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
