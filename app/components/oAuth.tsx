import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as Setting from "../Setting";
const { SDK } = require("casdoor-nodejs-sdk");

export function OAuthPage() {
  const [authing, setAuthing] = useState(!localStorage.getItem("jwt"));
  const navigate = useNavigate();
  const location = useLocation();

  async function saveUserInfo() {
    try {
      // 尝试去调用解析jwt方法
      const token = Setting.getJwt() as string;
      const response = await fetch(`/api/parse-jwt-token`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });
      const data = await response.json();
      Setting.setUserInfo(JSON.stringify(data?.data));
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
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

      if (!authing) {
        try {
          saveUserInfo();
          navigate("/chat");
        } catch (error) {
          console.error("获取用户信息失败:", error);
        }
      }
    };

    fetchData();
  }, [authing, location.search, navigate]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      {authing ? "认证中，请稍后..." : "认证成功，即将跳转..."}
    </div>
  );
}
