export const OWNER = "";
export const REPO = "";
export const REPO_URL = `https://github.com/${OWNER}/${REPO}`;
export const ISSUE_URL = `https://github.com/${OWNER}/${REPO}/issues`;
export const UPDATE_URL = `${REPO_URL}#keep-updated`;
export const RELEASE_URL = `${REPO_URL}/releases`;
export const FETCH_COMMIT_URL = `https://api.github.com/repos/${OWNER}/${REPO}/commits?per_page=1`;
export const FETCH_TAG_URL = `https://api.github.com/repos/${OWNER}/${REPO}/tags?per_page=1`;
export const RUNTIME_CONFIG_DOM = "danger-runtime-config";
export const DEFAULT_API_HOST = "https://chatgpt1.nextweb.fun/api/proxy";

export enum Path {
  Home = `/`,
  Chat = "/chat",
  Settings = "/settings",
  NewChat = "/new-chat",
  Masks = "/masks",
  Auth = "/auth",
  SignIn = "/sign-in",
  SignUp = "/sign-up",
  Pay = "/pay",
  OAuth = "/oauth",
}

export enum SlotID {
  AppBody = "app-body",
}

export enum FileName {
  Masks = "masks.json",
  Prompts = "prompts.json",
}

export enum StoreKey {
  Chat = "chat-next-web-store",
  Access = "access-control",
  Config = "app-config",
  Mask = "mask-store",
  Prompt = "prompt-store",
  Update = "chat-update",
  Sync = "sync",
}

export const MAX_SIDEBAR_WIDTH = 500;
export const MIN_SIDEBAR_WIDTH = 230;
export const NARROW_SIDEBAR_WIDTH = 100;

export const ACCESS_CODE_PREFIX = "ak-";

export const LAST_INPUT_KEY = "last-input";

export const REQUEST_TIMEOUT_MS = 60000;

export const EXPORT_MESSAGE_CLASS_NAME = "export-markdown";

export const OpenaiPath = {
  ChatPath: "v1/chat/completions",
  UsagePath: "dashboard/billing/usage",
  SubsPath: "dashboard/billing/subscription",
  ListModelPath: "v1/models",
};

export const DEFAULT_INPUT_TEMPLATE = `{{input}}`; // input / time / model / lang
export const DEFAULT_SYSTEM_TEMPLATE = `
You are Reverse, a large language model trained by TG-POWER.
Knowledge cutoff: 2021-09
Current model: {{model}}
Current time: {{time}}`;

export const DEFAULT_MODELS = [
  {
    name: "gpt-4",
    available: true,
  },
  {
    name: "gpt-4-0314",
    available: true,
  },
  {
    name: "gpt-4-0613",
    available: true,
  },
  {
    name: "gpt-4-32k",
    available: true,
  },
  {
    name: "gpt-4-32k-0314",
    available: true,
  },
  {
    name: "gpt-4-32k-0613",
    available: true,
  },
  {
    name: "gpt-3.5-turbo",
    available: true,
  },
  {
    name: "gpt-3.5-turbo-0301",
    available: true,
  },
  {
    name: "gpt-3.5-turbo-0613",
    available: true,
  },
  {
    name: "gpt-3.5-turbo-16k",
    available: true,
  },
  {
    name: "gpt-3.5-turbo-16k-0613",
    available: true,
  },
] as const;

export type PRINCES = {
  name: string;
  price: number;
  originPrice: number;
  subscriptionId: string;
  subscriptionType: string;
};
export const PRINCES: PRINCES[] = [
  {
    name: "包年不限次",
    price: 299.9,
    originPrice: 720,
    subscriptionId: "1",
    subscriptionType: "包年",
  },
  {
    name: "包季不限次",
    price: 89.9,
    originPrice: 180,
    subscriptionId: "2",
    subscriptionType: "包季",
  },
  {
    name: "包月不限次",
    price: 29.9,
    originPrice: 60,
    subscriptionId: "3",
    subscriptionType: "包月",
  },
  {
    name: "三天不限次",
    price: 9.9,
    originPrice: 20,
    subscriptionId: "4",
    subscriptionType: "三天",
  },
  {
    name: "1小时测试",
    price: 0.1,
    originPrice: 1,
    subscriptionId: "5",
    subscriptionType: "测试",
  },
];

// dev
// export const CASDOOR = {
//   endpoint: "http://localhost:7001",
//   clientId: "c6b3a0adcc44d5d10856",
//   appName: "HelpReverse",
//   organizationName: "built-in",
//   redirectPath: "/#/oauth",
//   clientSecret: "0d23837890ad2013425e07ce77534e001fe15e09",
//   signinPath: "/api/signin",
// };

// prod
export const CASDOOR = {
  endpoint: "https://casdoor.helpreverse.click/user",
  clientId: "c363fb65cd5919491468",
  appName: "reverse",
  organizationName: "user",
  redirectPath: "/#/oauth",
  clientSecret: "8b94b88579ef6b6d73c1596684ab722d3354ff28",
  signinPath: "/api/signin",
};

// export const CASDOOR = {
//   endpoint: process.env.CASDOOR_ENDPOINT ?? casdoor_dev_config.endpoint,
//   clientId: process.env.CASDOOR_CLIENTID ?? casdoor_dev_config.clientId,
//   appName: process.env.CASDOOR_APPNAME ?? casdoor_dev_config.appName,
//   organizationName:
//     process.env.CASDOOR_ORGANIZATIONNAME ?? casdoor_dev_config.organizationName,
//   redirectPath:
//     process.env.CASDOOR_REDIRECTPATH ?? casdoor_dev_config.redirectPath,
//   clientSecret:
//     process.env.CASDOOR_CLIENTSECRET ?? casdoor_dev_config.clientSecret,
//   signinPath: process.env.CASDOOR_SIGNINPATH ?? casdoor_dev_config.signinPath,
// };
