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
    const result = await pay.transactions_app(params);

    if (result.status === 200) {
      return NextResponse.json({ data: result }, { status: 200 });
    }
    return NextResponse.json({ error: result.message }, { status: 500 });
  } catch (error) {
    // 处理错误
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
