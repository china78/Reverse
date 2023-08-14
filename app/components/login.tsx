import styles from "./login.module.scss";
import { IconButton } from "./button";

import { useNavigate } from "react-router-dom";
import { Path } from "../constant";
import { useLoginStore } from "../store";
import Locale from "../locales";

import BotIcon from "../icons/bot.svg";

export function Login() {
  const navigate = useNavigate();
  const login = useLoginStore();

  const goLogin = () => {
    return login.fetch();
  };
  const goHome = () => navigate(Path.Home);
  const goRegister = () => navigate(Path.Register);

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
        value={login.username}
        onChange={(e) => {
          login.updateUsername(e.currentTarget.value);
        }}
      />
      <input
        className={styles["password-input"]}
        type="password"
        placeholder={Locale.Login.Password}
        value={login.password}
        onChange={(e) => {
          login.updatePassword(e.currentTarget.value);
        }}
      />

      <div className={styles["login-actions"]}>
        <IconButton
          text={Locale.Login.Confirm}
          type="primary"
          onClick={goLogin}
        />
        <IconButton
          text={Locale.Register.Title}
          type="primary"
          onClick={goRegister}
        />
        <IconButton text={Locale.Login.Later} onClick={goHome} />
      </div>
    </div>
  );
}
