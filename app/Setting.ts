// Copyright 2022 The Casdoor Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import Sdk from "casdoor-js-sdk";
import { CASDOOR } from "./constant";

const serverUrl = location.origin;

const sdkConfig = {
  serverUrl: CASDOOR.endpoint,
  clientId: CASDOOR.clientId,
  appName: CASDOOR.appName,
  organizationName: CASDOOR.organizationName,
  redirectPath: CASDOOR.redirectPath,
  signinPath: `${location.origin}${CASDOOR.signinPath}`,
};

export const CasdoorSDK = new Sdk(sdkConfig);

export const isLoggedIn = () => {
  const token = localStorage.getItem("jwt");
  return token !== null && token.length > 0;
};

export const setJwt = (jwt: string) => {
  localStorage.setItem("jwt", jwt);
};

export const getJwt = () => {
  return localStorage.getItem("jwt");
};

export const goToLink = (link: string) => {
  window.location.href = link;
};

export const getUserinfo = () => {
  return fetch(`${serverUrl}/api/userinfo`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("jwt")}`,
    },
  }).then((res) => res.json());
};

export const logout = () => {
  localStorage.removeItem("jwt");
};

export const showMessage = (message: string) => {
  alert(message);
};

export function signin(params: {
  code?: string;
  state?: string;
  successCb: () => void;
  failCb: () => void;
}) {
  if (params.code === undefined || params.state === undefined) {
    window.location.href = CasdoorSDK.getSigninUrl();
    return;
  }

  return CasdoorSDK.signin(
    serverUrl,
    CASDOOR.signinPath,
    params.code,
    params.state,
  ).then((res: any) => {
    if (res.status === "ok") {
      setJwt(res.data);
      params.successCb();
    } else {
      params.failCb();
    }

    return res;
  });
}
