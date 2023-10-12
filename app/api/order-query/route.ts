import { NextResponse, NextRequest } from "next/server";
import WxPay from "wechatpay-node-v3";
import prisma from "@/app/db/prisma";
import { Ipay } from "wechatpay-node-v3/dist/lib/interface";
import moment from "moment";

export type PayOptions = {
  appid: string;
  mchid: string;
  publicKey: any;
  privateKey: any;
};

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

  const payOptions: PayOptions = {
    appid: "wxa29f1b154a0856e3", // 待关联商户号
    mchid: "1651683598", // 微信支付商户号
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
        // 存会员到期时间
        // 数据存储成功，计算会员到期时间
        let memberExpirationDate: string;

        // 将交易成功时间转换为 Date 对象
        const successTime = moment(result.success_time);

        // 根据订阅类型计算会员到期时间
        if (subscriptionType === "1year") {
          successTime.add(1, "year");
        } else if (subscriptionType === "3month") {
          successTime.add(3, "months");
        } else if (subscriptionType === "1month") {
          successTime.add(1, "month");
        } else if (subscriptionType === "3day") {
          successTime.add(3, "days");
        } else if (subscriptionType === "test") {
          successTime.add(1, "hour");
        }

        // 将会员到期时间格式化为字符串
        memberExpirationDate = successTime.toISOString();

        // 更新用户的会员状态和会员到期时间
        try {
          const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
              isMember: true,
              memberExpirationDate,
            },
          });
          NextResponse.json({ data: updatedUser }, { status: 200 });
        } catch (error) {
          NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
          );
        }
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
