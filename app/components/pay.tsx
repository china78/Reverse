import React, { useEffect, useState } from "react";
import styles from "./pay.module.scss";
import { PRINCES } from "../constant";
import Image from "next/image";
import { useAppConfig, Theme } from "../store";
import { Button, Modal } from "antd";
import { WechatOutlined, AlipayCircleOutlined } from "@ant-design/icons";

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
  const [selectedTab, setSelectedTab] = useState(PRINCES[0].price);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrUrl, setqrUrl] = useState("");

  const config = useAppConfig();
  const theme = config.theme;

  const handleTabClick = (tab: number) => {
    setSelectedTab(tab);
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

  async function handlePayment(params: string) {
    if (params === WECHAT) {
      const payParams: PayParams = {
        appid: "wxa29f1b154a0856e3",
        mchid: "1651683598",
        description: "reverse",
        out_trade_no: "4346565761",
        notify_url: "https://subdomain.example.com/path/to/notify",
        amount: {
          total: Math.round(selectedTab * 100),
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
        console.log("微信支付请求二维码: ", qrUrl);
        setqrUrl(qrUrl);
        setShowQRCode(true);
      }
    } else {
    }
  }

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
              selectedTab === item.price ? styles.selected : ""
            }`}
            onClick={() => handleTabClick(item.price)}
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
        <div style={{ marginBottom: 10 }}>
          请您使用支付软件支付 ￥{selectedTab}
        </div>
        <div>
          <Button
            icon={<WechatOutlined />}
            style={{ marginRight: 10 }}
            type="primary"
            onClick={() => handlePayment(WECHAT)}
          >
            微信支付
          </Button>
          <Button
            icon={<AlipayCircleOutlined />}
            type="primary"
            onClick={() => handlePayment(ALIPAY)}
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
