import React, { useEffect, useState } from "react";
import styles from "./pay.module.scss";
import { PRINCES } from "../constant";
import Image from "next/image";
import { useAppConfig, Theme } from "../store";
import { Button, Modal } from "antd";

const WECHAT = "wechat";
const ALIPAY = "alipay";
export function Pay() {
  const [selectedTab, setSelectedTab] = useState(PRINCES[0].price);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [auth, setAuth] = useState("");

  const config = useAppConfig();
  const theme = config.theme;

  const handleTabClick = (tab: string) => {
    setSelectedTab(tab);
  };

  const showModal = () => {
    setIsModalOpen(true);
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

  function handlePayment(params: string) {
    if (params === WECHAT) {
      // 调用生成签名的函数
      const auth = fetch("/api/generate-signature", {
        method: "POST",
        mode: "cors",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
    } else {
    }
  }

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
  };
  async function wechatPay(params: PayParams) {
    const res = await fetch(
      "https://api.mch.weixin.qq.com//v3/pay/transactions/native",
      {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "",
        },
        body: JSON.stringify(params),
      },
    );
    return res.json();
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
      {isModalOpen && (
        <Modal
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
              style={{ marginRight: 10 }}
              type="primary"
              onClick={() => handlePayment(WECHAT)}
            >
              微信支付
            </Button>
            <Button type="primary" onClick={() => handlePayment(ALIPAY)}>
              支付宝支付
            </Button>
          </div>
        </Modal>
      )}
      <div className={styles.qrCode}>
        {showQRCode && (
          <div className={styles.imagesContainer}>
            <Image src="/alipay.jpg" alt="alipay" width={500} height={300} />
            <Image src="/wechat.jpg" alt="wechat" width={500} height={300} />
          </div>
        )}
      </div>
    </div>
  );
}
