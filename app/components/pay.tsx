import React, { useState } from "react";
import styles from "./pay.module.scss";

export function Pay() {
  const [selectedTab, setSelectedTab] = useState("15");

  const [showQRCode, setShowQRCode] = useState(false);

  const handleTabClick = (tab: string) => {
    setSelectedTab(tab);
  };

  const handleConfirm = () => {
    // 处理确认逻辑
    setShowQRCode(true); // 显示图片
  };

  return (
    <div className={styles.pay}>
      <h2>
        <p className={styles.m0}>您的免费使用次数已用完</p>
        <p className={styles.m0}>选择以下套餐, 解锁您的私人AI助手吧</p>
      </h2>
      <div className={styles.options}>
        <div
          className={`${styles.option} ${
            selectedTab === "15" ? styles.selected : ""
          }`}
          onClick={() => handleTabClick("15")}
        >
          <div className={styles.optionTitle}>包月</div>
          <div className={styles.price}>
            <span className={styles.rmb}>¥</span>15
          </div>
          <div className={styles.originalPrice}>¥18</div>
        </div>
        <div
          className={`${styles.option} ${
            selectedTab === "30" ? styles.selected : ""
          }`}
          onClick={() => handleTabClick("30")}
        >
          <div className={styles.optionTitle}>包季</div>
          <div className={styles.price}>
            <span className={styles.rmb}>¥</span>45
          </div>
          <div className={styles.originalPrice}>¥54</div>
        </div>
        <div
          className={`${styles.option} ${
            selectedTab === "50" ? styles.selected : ""
          }`}
          onClick={() => handleTabClick("50")}
        >
          <div className={styles.optionTitle}>包年</div>
          <div className={styles.price}>
            <span className={styles.rmb}>¥</span>158
          </div>
          <div className={styles.originalPrice}>¥216</div>
        </div>
      </div>
      <button className={styles.button} onClick={handleConfirm}>
        确认并开通
      </button>
      <div className={styles.qrCode}>
        {showQRCode && <img src="path/to/image" alt="Payment QR Code" />}
      </div>
    </div>
  );
}
