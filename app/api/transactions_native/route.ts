import { NextResponse, NextRequest } from "next/server";
import WxPay from "wechatpay-node-v3";
import qrcode from "qrcode";
import { Ipay } from "wechatpay-node-v3/dist/lib/interface";
import { PayOptions } from "../order-query/route";

export async function POST(req: NextRequest) {
  const { params } = await req.json();

  const payOptions: PayOptions = {
    appid: "wxa29f1b154a0856e3",
    mchid: "1651683598",
    publicKey: "",
    privateKey: "",
  };

  if (process.env.APICLIENTCERT && process.env.APICLIENTKEY) {
    payOptions.publicKey = process.env.APICLIENTCERT;
    payOptions.privateKey = process.env.APICLIENTKEY;
  } else {
    return;
  }

  const pay = new WxPay(payOptions as Ipay);

  try {
    const result = await pay.transactions_native(params);

    if (result.status === 200) {
      const codeUrl = result?.code_url;
      // 解析二维码
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
