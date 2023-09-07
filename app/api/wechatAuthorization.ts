import crypto from "crypto";
import { homedir } from "os";
import { readFileSync } from "fs";
import { join } from "path";

export const generateSignature = async () => {
  const url = "https://api.mch.weixin.qq.com/v3/certificates";
  const method = "GET";
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonceStr = generateNonceStr();
  const requestBody = ""; // 请求方法为 GET，所以请求报文主体为空

  const signatureMessage = `${method}\n${url}\n${timestamp}\n${nonceStr}\n${requestBody}\n`;

  const privateKey = readFileSync(
    join(homedir(), ".ssh", "zhongbang", "apiclient_key.pem"),
    "utf8",
  ); // 商户私钥
  const signature = signWithPrivateKey(signatureMessage, privateKey);
  const CertificationType = "WECHATPAY2-SHA256-RSA2048"; // 认真类型
  const mchid = "1651683598"; // 微信支付商户号

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `${CertificationType} mchid="${mchid}",nonce_str="${nonceStr}",signature="${signature}",timestamp="${timestamp}",serial_no="YOUR_SERIAL_NO"`,
  };

  try {
    const response = await fetch(url, { method, headers });
    const responseData = await response.json();
    // 处理响应数据
    console.log(responseData);
    return responseData;
  } catch (error) {
    // 处理错误
    console.error(error);
  }
};

// 生成随机字符串
const generateNonceStr = () => {
  const length = 16;
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let nonceStr = "";
  for (let i = 0; i < length; i++) {
    nonceStr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return nonceStr;
};

// 使用商户私钥对待签名串进行签名
const signWithPrivateKey = (
  message: crypto.BinaryLike,
  privateKey:
    | crypto.KeyLike
    | crypto.SignKeyObjectInput
    | crypto.SignPrivateKeyInput,
) => {
  const sign = crypto.createSign("RSA-SHA256");
  sign.update(message);
  const signature = sign.sign(privateKey, "base64");
  return signature;
};
