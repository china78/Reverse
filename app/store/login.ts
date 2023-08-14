import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getClientConfig } from "../config/client";
import { getHeaders } from "../client/api";
import { DEFAULT_MODELS } from "../constant";

export interface LoginStore {
  username: string;
  password: string;
  isLoggedIn: boolean;
  updateUsername: (username: string) => void;
  updatePassword: (password: string) => void;
  isAuthorized: () => boolean;
  fetch: () => void;
}
let fetchState = 0; // 0 not fetch, 1 fetching, 2 done

export const useLoginStore = create<LoginStore>()(
  persist(
    (set, get) => ({
      username: "",
      password: "",
      isLoggedIn: false,
      updateUsername: (username: string) => {
        set(() => ({ username }));
      },
      updatePassword: (password: string) => {
        set(() => ({ password }));
      },
      isAuthorized() {
        return get().isLoggedIn;
      },
      fetch() {
        if (fetchState > 0 || getClientConfig()?.buildMode === "export") return;
        fetchState = 1;
        fetch("/api/login", {
          method: "post",
          body: JSON.stringify({
            username: get().username,
            password: get().password,
          }),
          headers: {
            ...getHeaders(),
          },
        })
          .then((res) => res.json())
          .then((res: DangerConfig) => {
            console.log("返回的数据", res);
            // set(() => ({ ...res }));
            // 在这里存下用户名，并修改登录状态

            if (res.disableGPT4) {
              DEFAULT_MODELS.forEach(
                (m: any) => (m.available = !m.name.startsWith("gpt-4")),
              );
            }
          })
          .catch(() => {
            console.error("[Config] failed to fetch config");
          })
          .finally(() => {
            fetchState = 2;
          });
      },
    }),
    {
      name: "login-store",
      version: 1,
    },
  ),
);
