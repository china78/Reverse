import { NextResponse, NextRequest } from "next/server";
import WxPay from "wechatpay-node-v3";
import fs from "fs";

const pay = new WxPay({
  appid: "wxa29f1b154a0856e3",
  mchid: "1651683598",
  publicKey: fs.readFileSync(
    "/Users/tianganggang/.ssh/zhongbang/apiclient_cert.pem",
  ), // 公钥
  privateKey: fs.readFileSync(
    "/Users/tianganggang/.ssh/zhongbang/apiclient_key.pem",
  ), // 秘钥
});

export async function POST(req: NextRequest) {
  const { params } = await req.json();
  console.log(" ---------* params *-------------", params);
  try {
    const result = await pay.transactions_native(params);
    console.log(result);
    return NextResponse.json({ data: result }, { status: 200 });
  } catch (error) {
    // 处理错误
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
