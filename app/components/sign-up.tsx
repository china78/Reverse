import { useState } from "react";
import styles from "./sign-up.module.scss";
import { IconButton } from "./button";

import { useNavigate } from "react-router-dom";
import { Path } from "../constant";
// import { useLoginStore } from "../store";
import Locale from "../locales";
import { getHeaders } from "../client/api";

import BotIcon from "../icons/bot.svg";

export function SignUp() {
  const navigate = useNavigate();
  // const login = useLoginStore();

  // const goLogin = () => {
  //   return login.fetch();
  // };
  const goHome = () => navigate(Path.Home);
  // const goRegister = () => navigate(Path.Register);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  // const [email, setEmail] = useState("");
  // const [phoneNumber, setPhoneNumber] = useState("");

  const signUpFn = async () => {
    const body = { username, password };
    if (password !== password2) {
      alert("两次输入的密码不一致");
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
      alert("注册成功");
    } else {
      alert("注册失败");
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
      {/* <input
        className={styles["email-input"]}
        type="text"
        placeholder={Locale.SignUp.Email}
        value={username}
        onChange={(e) => {
          setEmail(e.currentTarget.value);
        }}
      />
      <input
        className={styles["phone-input"]}
        type="password"
        placeholder={Locale.SignUp.PhoneNumber}
        value={password}
        onChange={(e) => {
          setPhoneNumber(e.currentTarget.value.toString());
        }}
      /> */}

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
