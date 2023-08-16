import { useState } from "react";
import styles from "./sign-in.module.scss";
import { IconButton } from "./button";

import { useNavigate } from "react-router-dom";
import { Path } from "../constant";
// import { useLoginStore } from "../store";
import Locale from "../locales";
import { getHeaders } from "../client/api";

import BotIcon from "../icons/bot.svg";

export function SignIn() {
  const navigate = useNavigate();
  const goHome = () => navigate(Path.Home);
  const goSinUp = () => navigate(Path.SignUp);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const signInFn = async () => {
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
      alert("登陆成功");
    } else {
      alert("登陆失败");
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
