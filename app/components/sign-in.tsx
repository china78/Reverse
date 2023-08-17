import { useState } from "react";
import styles from "./sign-in.module.scss";
import { IconButton } from "./button";

import { useNavigate } from "react-router-dom";
import { Path } from "../constant";
import Locale from "../locales";
import { getHeaders } from "../client/api";

import BotIcon from "../icons/bot.svg";
import { useAccessStore } from "../store";
import { message } from "antd";

export function SignIn() {
  const navigate = useNavigate();
  const goHome = () => navigate(Path.Home);
  const goSinUp = () => navigate(Path.SignUp);
  const accessStore = useAccessStore();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const signInFn = async () => {
    const body = { username, password };
    const res = await fetch(`/api/sign-in`, {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await res.json(); // 解析响应内容为 JSON 对象
    console.log(data);
    if (res.ok) {
      const token = data.token; // 提取令牌属性
      // 将返回的令牌保存在本地存储中
      localStorage.setItem("token", token);
      accessStore.updateCode(data.envCode);
      message.success(Locale.SignIn.success);
      goHome();
    } else {
      message.error(Locale.SignIn.fail);
    }
  };

  return (
    <div className={styles["sign-in-page"]}>
      <div className={`no-dark ${styles["sign-in-logo"]}`}>
        <BotIcon />
      </div>

      <div className={styles["sign-in-title"]}>{Locale.SignIn.Title}</div>
      <div className={styles["sign-in-tips"]}>{Locale.SignIn.Tips}</div>

      <input
        className={styles["username-input"]}
        type="text"
        placeholder={Locale.SignIn.Username}
        value={username}
        onChange={(e) => {
          setUsername(e.currentTarget.value);
        }}
      />
      <input
        className={styles["password-input"]}
        type="password"
        placeholder={Locale.SignIn.Password}
        value={password}
        onChange={(e) => {
          setPassword(e.currentTarget.value);
        }}
      />

      <div className={styles["sign-in-actions"]}>
        <IconButton
          text={Locale.SignIn.Confirm}
          type="primary"
          onClick={signInFn}
        />
        <IconButton
          text={Locale.SignUp.Title}
          type="primary"
          onClick={goSinUp}
        />
        <IconButton text={Locale.SignIn.Later} onClick={goHome} />
      </div>
    </div>
  );
}
