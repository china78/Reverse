import React, { useState } from "react";
import styles from "./pay.module.scss";
import { PRINCES } from "../constant";

export function Pay() {
  const [selectedTab, setSelectedTab] = useState(PRINCES[0].price);

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
            <div className={styles.price}>
              <span className={styles.rmb}>¥</span>
              {item.price}
            </div>
            <div className={styles.originalPrice}>¥{item.originPrice}</div>
          </div>
        ))}
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
