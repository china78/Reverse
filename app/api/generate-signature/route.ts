import { homedir } from "os";
import { readFileSync } from "fs";
import { join } from "path";
import { NextResponse, NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import forge from "node-forge";
import crypto from "crypto";

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

// 使用商户私钥给签名串进行签名 SHA-256 with RSA
const signWithPrivateKey = (message: string, privateKey: any) => {
  // const md = forge.md.sha256.create();
  // md.update(message, "utf8");
  // const signature = privateKey.sign(md);
  // return forge.util.encode64(signature);
  crypto.createSign("RSA-SHA256").update(message).sign(privateKey, "base64");
};

export async function POST(req: NextRequest) {
  const url = "https://api.mch.weixin.qq.com/v3/certificates";
  const method = "GET";
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonceStr = generateNonceStr();
  const requestBody = ""; // 请求方法为 GET，所以请求报文主体为空

  /**
   * HTTP请求方法\n
     URL\n
     请求时间戳\n
     请求随机串\n
    请求报文主体\n
   */
  const signatureMessage = `${method}\n${url}\n${timestamp}\n${nonceStr}\n${requestBody}\n`;

  const privateKeyPem = readFileSync(
    join(homedir(), ".ssh", "zhongbang", "apiclient_key.pem"),
    "utf8",
  ); // 商户私钥

  const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);

  // 证书部分
  // 构建证书文件路径
  const certificateFilePath = path.join(
    require("os").homedir(),
    ".ssh",
    "zhongbang",
    "apiclient_cert.pem",
  );
  // 加载证书文件
  const certificatePem = fs.readFileSync(certificateFilePath, "utf8");
  // 解析证书
  const certificate = forge.pki.certificateFromPem(certificatePem);
  // 获取证书序列号
  const serialNumber = certificate.serialNumber;
  // 输出证书序列号
  console.log("Certificate Serial Number:", serialNumber);
  // 证书部分

  const signature = signWithPrivateKey(signatureMessage, privateKey);
  const CertificationType = "WECHATPAY2-SHA256-RSA2048"; // 认证类型
  const mchid = "1651683598"; // 微信支付商户号

  console.log(" ----------- 签名 ----------: ", signature);
  console.log(" ----------- 证书 ----------: ", serialNumber);

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `${CertificationType} mchid="${mchid}",nonce_str="${nonceStr}",signature="${signature}",timestamp="${timestamp}",serial_no="${serialNumber}"`,
  };

  try {
    const response = await fetch(url, { method, headers });
    const responseData = await response.json();
    // 处理响应数据
    console.log("(-------后端---responseData-------------", responseData);
    return NextResponse.json({ data: responseData }, { status: 200 });
  } catch (error) {
    // 处理错误
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
