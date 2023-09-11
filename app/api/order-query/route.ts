import { NextResponse, NextRequest } from "next/server";
import WxPay from "wechatpay-node-v3";
import fs from "fs";
import prisma from "@/app/db/prisma";

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
type Payed = {
  amount: {
    currency: string;
    payer_currency: string;
    payer_total: number;
    total: number;
  };
  currency: string;
  payer_currency: string;
  payer_total: number;
  total: number;
  appid: string;
  attach: string;
  bank_type: string;
  mchid: string;
  out_trade_no: string;
  payer: { openid: string };
  openid: string;
  promotion_detail: [];
  status: number;
  success_time: string;
  trade_state: string; // 'CLOSED' | 'NOTPAY' | 'SUCCESS'
  trade_state_desc: string; // '订单已关闭' '订单未支付' | '支付成功'
  trade_type: string;
  transaction_id: string;
};
type OrderData = {
  orderNumber: string;
  userId: string;
  createdAt: string;
  amount: number;
  subscriptionType: string;
  subscriptionId: string;
  transaction_id: string;
  success_time: string;
};

export async function POST(req: NextRequest) {
  const {
    out_trade_no,
    userId,
    subscriptionId,
    createdAt,
    amount,
    subscriptionType,
  } = await req.json();

  try {
    const result: Partial<Payed> = await pay.query({ out_trade_no });

    if (result?.trade_state === "SUCCESS") {
      // 把用户修改成会员
      try {
        const updatedUser = await prisma.user.update({
          where: { id: userId },
          data: { isMember: true },
        });
        NextResponse.json({ data: updatedUser }, { status: 200 });
      } catch (error) {
        NextResponse.json({ error: "Internal server error" }, { status: 500 });
      }
      // 订单支付成功，存储订单信息到 Order 表
      const orderData: OrderData = {
        orderNumber: out_trade_no, //订单id
        userId, // 用户id
        subscriptionId, // 订阅id
        createdAt, // 订单创建时间
        amount, // 订单金额
        subscriptionType, // 订阅类型
        transaction_id: result.transaction_id!, // 交易id
        success_time: result.success_time!, // 交易成功时间
      };

      const createdOrder = await prisma.order.create({
        data: orderData,
      });

      if (createdOrder) {
        // 数据存储成功，返回成功提示给前端
        return NextResponse.json(
          { success: true, message: "订单数据存储成功" },
          { status: 200 },
        );
      }
    }

    return NextResponse.json({ data: result }, { status: 200 });
  } catch (error) {
    // 处理错误
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
