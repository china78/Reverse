import { useEffect } from "react";
import * as Setting from "../Setting";

export function SignIn() {
  useEffect(() => {
    console.log(123);
    const signinUrl = Setting.CasdoorSDK.getSigninUrl();
    console.log("signinUrl", signinUrl);
    // return
    Setting.goToLink(signinUrl);
  }, []);
  return null;
}
