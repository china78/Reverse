import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as Setting from "../Setting";
const { SDK } = require("casdoor-nodejs-sdk");

export function OAuthPage() {
  const [authing, setAuthing] = useState(!localStorage.getItem("jwt"));
  const navigate = useNavigate();

  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);

  Setting.signin({
    code: searchParams.get("code") ?? undefined,
    state: searchParams.get("state") ?? undefined,
    successCb() {
      setAuthing(false);
    },
    failCb() {
      console.error("认证失败，请重试");
    },
  });

  useEffect(() => {
    if (authing) return;
    setTimeout(() => {
      navigate("/chat");
    }, 2000);
  }, [authing, navigate]);

  return <div>{authing ? "认证中，请稍后" : "认证成功，即将跳转..."}</div>;
}
