import { NextResponse, NextRequest } from "next/server";
import WxPay from "wechatpay-node-v3";
import fs from "fs";
import qrcode from "qrcode";

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
  try {
    const result = await pay.transactions_native(params);

    if (result.status === 200) {
      const codeUrl = result?.code_url;

      const qrUrl = await new Promise((resolve, reject) => {
        qrcode.toDataURL(codeUrl, (error, url) => {
          if (error) {
            console.error(error);
            reject(error);
          } else {
            resolve(url);
          }
        });
      });
      return NextResponse.json({ data: { qrUrl } }, { status: 200 });
    }
    return NextResponse.json({ error: result.message }, { status: 500 });
  } catch (error) {
    // 处理错误
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
