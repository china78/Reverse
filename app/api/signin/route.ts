import { NextResponse, NextRequest } from "next/server";
import { CASDOOR } from "@/app/constant";
import { SDK } from "casdoor-nodejs-sdk";

// 你的 casdoor 公钥证书，在 casdoor 面板中可以找到
export async function POST(req: NextRequest) {
  console.log("--------- /api/signin/ - req -------: ", req);
  console.log("--------- /api/signin/ - req.headers -------: ", req.headers);
  console.log("------------- process.env --------: ", process.env);
  console.log(
    "------------- process.env.CASDOORCERT --------: ",
    process.env.CASDOORCERT,
  );
  const a = Buffer.from(process.env.CASDOORCERT as any);
  console.log(
    "------------- Buffer.from(process.env.CASDOORCERT) --------: ",
    a,
  );
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

  console.log("--------- authCfg -------: ", authCfg);
  const sdk = new SDK(authCfg);

  const searchParams = req.nextUrl.searchParams;

  console.log("--------- searchParams -------: ", searchParams);

  const code = searchParams.get("code");
  const state = searchParams.get("state");

  console.log("--------- code -------: ", code);
  console.log("--------- state -------: ", state);

  if (code === null || state === null) {
    return NextResponse.json(
      { error: "Invalid code or state" },
      { status: 400 },
    );
  }

  try {
    const result = await sdk.getAuthToken(code);
    console.log("--------- result -------: ", result);
    return NextResponse.json({ data: result, status: "ok" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error, status: "error" }, { status: 500 });
  }
}
