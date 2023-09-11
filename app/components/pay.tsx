import React, { useEffect, useState } from "react";
import styles from "./pay.module.scss";
import { PRINCES, Path } from "../constant";
import Image from "next/image";
import { useAppConfig, Theme } from "../store";
import { Button, Modal, Spin, message } from "antd";
import { WechatOutlined, AlipayCircleOutlined } from "@ant-design/icons";
import { getLocalUserInfo } from "../Setting";
import { useNavigate } from "react-router-dom";

const WECHAT = "wechat";
const ALIPAY = "alipay";
type CommReqAmountInfo = {
  total: number; // 【总金额】 订单总金额，单位为分。
  currency?: string; // 【货币类型】 CNY：人民币，境内商户号仅支持人民币。
};

type PayParams = {
  appid: string; // 公众号ID】 公众号ID
  mchid: string; // 【直连商户号】 直连商户号
  description: string; // 【商品描述】 商品描述
  out_trade_no: string; // 【商户订单号】 商户系统内部订单号，只能是数字、大小写字母_-*且在同一个商户号下唯一
  notify_url: string; // 【通知地址】 异步接收微信支付结果通知的回调地址，
  amount: CommReqAmountInfo;
  scene_info: {
    payer_client_ip: string;
  };
};
export function Pay() {
  const [selectedTab, setSelectedTab] = useState(PRINCES[0]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrUrl, setqrUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const config = useAppConfig();
  const theme = config.theme;

  const handleTabClick = (item: PRINCES) => {
    setSelectedTab(item);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleQrOk = () => {
    setShowQRCode(false);
  };

  const handleQrCancel = () => {
    setShowQRCode(false);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleConfirm = async () => {
    showModal();
  };

  // 生成随机数
  function generateRandomNumber(length: number) {
    const characters = "0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
    return result;
  }

  // 生成订单号
  function generateOrderNumber() {
    const timestamp = Date.now();
    const random = generateRandomNumber(6); // 随机数的长度
    return `${timestamp}${random}`;
  }

  let _out_trade_no: string;
  let pollingInterval: NodeJS.Timeout | null = null;

  function startPollingOrderResult() {
    pollingInterval = setInterval(queryOrderResult, 2000); // 每2秒执行一次查询订单结果
  }

  function stopPollingOrderResult() {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      pollingInterval = null;
    }
  }

  async function wechatPay() {
    setLoading(true);
    _out_trade_no = generateOrderNumber();
    const payParams: PayParams = {
      appid: "wxa29f1b154a0856e3",
      mchid: "1651683598",
      description: "reverse",
      out_trade_no: _out_trade_no,
      notify_url: "https://subdomain.example.com/path/to/notify",
      amount: {
        total: Math.round(selectedTab.price * 100),
      },
      scene_info: {
        payer_client_ip: "ip",
      },
    };
    const res = await fetch("/api/transactions_native", {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ params: payParams }),
    });
    if (res.ok) {
      const data = await res.json();
      const { qrUrl } = data?.data;
      setqrUrl(qrUrl);
      setShowQRCode(true); // 显示二维码
      setLoading(false);
      // 开始轮询查询订单结果
      startPollingOrderResult();
    }
  }

  async function alipay() {
    console.log("alipay");
  }

  async function handlePayment(params: string) {
    if (params === WECHAT) {
      wechatPay();
    } else {
      alipay();
    }
  }

  let userInfo = getLocalUserInfo() as any;

  async function queryOrderResult() {
    // 存储订单数据到 Order 表
    const orderData = {
      userId: JSON.parse(userInfo)?.id, // 替换为实际的用户ID
      subscriptionId: selectedTab.subscriptionId, // 替换为实际的订阅ID
      createdAt: new Date(), // 替换为实际的订单创建时间
      amount: selectedTab.price, // 替换为实际的订单金额
      subscriptionType: selectedTab.subscriptionType, // 替换为实际的订阅类型
    };

    const res = await fetch("/api/order-query", {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ out_trade_no: _out_trade_no, ...orderData }),
    });

    const data = await res.json();
    console.log("查询订单结果: ", data);
    if (data?.success && data.message === "订单数据存储成功") {
      // 把用户设置成会员

      message.success("订单支付成功");
      // 订单支付成功，停止轮询
      stopPollingOrderResult();
      // 这里需要关掉二维码，跳转到chat，
      setShowQRCode(false);
      navigate(Path.Chat);
    }
  }

  useEffect(() => {
    // 组件卸载时停止轮询
    return () => {
      stopPollingOrderResult();
    };
  }, []);

  return (
    <div className={styles.pay}>
      <h2>
        <p className={styles.m0}>您的免费使用次数已用完</p>
        <p className={styles.m0}>选择以下套餐, 畅享您的私人AI助手吧</p>
      </h2>
      <div className={styles.options}>
        {PRINCES.map((item, key) => (
          <div
            key={key}
            className={`${styles.option} ${
              selectedTab.price === item.price ? styles.selected : ""
            }`}
            onClick={() => handleTabClick(item)}
          >
            <div className={styles.optionTitle}>{item.name}</div>
            <div className={theme === Theme.Light ? styles.dark : styles.light}>
              <span className={styles.rmb}>¥</span>
              {item.price}
            </div>
            <div
              className={
                theme === Theme.Light
                  ? styles.originalPriceDark
                  : styles.originalPriceLight
              }
            >
              ¥{item.originPrice}
            </div>
          </div>
        ))}
      </div>
      <button className={styles.button} onClick={handleConfirm}>
        立即购买
      </button>
      {/* 此位置弹框提示选择支付方式 */}
      <Modal
        width={300}
        footer={false}
        title="购买资源包"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {loading && (
          <Spin tip="支付准备中...">
            <div
              style={{
                padding: 50,
                background: "rgba(0, 0, 0, 0.05)",
                borderRadius: 4,
              }}
            />
          </Spin>
        )}
        <div style={{ marginBottom: 10 }}>
          请您使用支付软件支付 ￥{selectedTab.price}
        </div>
        <div>
          <Button
            icon={<WechatOutlined />}
            style={{ marginRight: 10 }}
            type="primary"
            onClick={() => handlePayment(WECHAT)}
            disabled={loading}
          >
            微信支付
          </Button>
          <Button
            icon={<AlipayCircleOutlined />}
            type="primary"
            onClick={() => handlePayment(ALIPAY)}
            disabled={loading}
          >
            支付宝支付
          </Button>
        </div>
      </Modal>
      <Modal
        onOk={handleQrOk}
        onCancel={handleQrCancel}
        footer={false}
        width={300}
        open={showQRCode}
      >
        <Image
          src={qrUrl}
          alt="qr"
          width={300}
          height={300}
          layout="responsive"
        />
      </Modal>
    </div>
  );
}
