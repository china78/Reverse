import { useState } from "react";
import styles from "./login.module.scss";
import { IconButton } from "./button";

import { useNavigate } from "react-router-dom";
import { Path } from "../constant";
// import { useLoginStore } from "../store";
import Locale from "../locales";
import { getHeaders } from "../client/api";

import BotIcon from "../icons/bot.svg";

export function Login() {
  const navigate = useNavigate();
  // const login = useLoginStore();

  // const goLogin = () => {
  //   return login.fetch();
  // };
  const goHome = () => navigate(Path.Home);
  // const goRegister = () => navigate(Path.Register);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const signUp = async () => {
    const body = { username, password };
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
      alert("注册成功");
    } else {
      alert("注册失败");
    }
  };

  return (
    <div className={styles["login-page"]}>
      <div className={`no-dark ${styles["login-logo"]}`}>
        <BotIcon />
      </div>

      <div className={styles["login-title"]}>{Locale.Login.Title}</div>
      <div className={styles["login-tips"]}>{Locale.Login.Tips}</div>

      <input
        className={styles["username-input"]}
        type="text"
        placeholder={Locale.Login.Username}
        value={username}
        onChange={(e) => {
          setUsername(e.currentTarget.value);
        }}
      />
      <input
        className={styles["password-input"]}
        type="password"
        placeholder={Locale.Login.Password}
        value={password}
        onChange={(e) => {
          setPassword(e.currentTarget.value);
        }}
      />

      <div className={styles["login-actions"]}>
        <IconButton text={Locale.Login.Confirm} type="primary" />
        <IconButton
          text={Locale.Register.Title}
          type="primary"
          onClick={signUp}
        />
        <IconButton text={Locale.Login.Later} onClick={goHome} />
      </div>
    </div>
  );
}
