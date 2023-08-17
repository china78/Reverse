import { useState } from "react";
import styles from "./sign-up.module.scss";
import { IconButton } from "./button";

import { useNavigate } from "react-router-dom";
import { Path } from "../constant";
import Locale from "../locales";
import { getHeaders } from "../client/api";
import { message } from "antd";

import BotIcon from "../icons/bot.svg";

export function SignUp() {
  const navigate = useNavigate();
  const goHome = () => navigate(Path.Home);
  const goSinIn = () => navigate(Path.SignIn);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const signUpFn = async () => {
    const body = { username, password };
    if (password !== password2) {
      message.error("两次输入的密码不一致");
      return;
    }
    const res = await fetch(`/api/sign-up`, {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    console.log(await res.json());
    if (res.ok) {
      message.success(Locale.SignUp.success);
      // 跳进去
      goSinIn();
    } else {
      message.error(Locale.SignUp.fail);
    }
  };

  return (
    <div className={styles["sign-up-page"]}>
      <div className={`no-dark ${styles["sign-up-logo"]}`}>
        <BotIcon />
      </div>

      <div className={styles["sign-up-title"]}>{Locale.SignUp.Title}</div>
      <div className={styles["sign-up-tips"]}>{Locale.SignUp.Tips}</div>

      <input
        className={styles["username-input"]}
        type="text"
        placeholder={Locale.SignUp.Username}
        value={username}
        onChange={(e) => {
          setUsername(e.currentTarget.value);
        }}
      />
      <input
        className={styles["password-input"]}
        type="password"
        placeholder={Locale.SignUp.Password}
        value={password}
        onChange={(e) => {
          setPassword(e.currentTarget.value);
        }}
      />
      <input
        className={styles["password-input"]}
        type="password"
        placeholder={Locale.SignUp.Password2}
        value={password2}
        onChange={(e) => {
          setPassword2(e.currentTarget.value);
        }}
      />

      <div className={styles["sign-up-actions"]}>
        <IconButton
          text={Locale.SignUp.Title}
          type="primary"
          onClick={signUpFn}
        />
        <IconButton text={Locale.SignUp.Later} onClick={goHome} />
      </div>
    </div>
  );
}
