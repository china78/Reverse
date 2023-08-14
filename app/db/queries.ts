import { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";

interface User {
  id: number;
  username: string;
  password: string;
  trial_count: number;
}
interface SubscriptionOption {
  id: number;
  name: string;
  price: number;
  duration: number;
}
interface UserSubscription {
  id: number;
  user_id: number;
  subscription_id: number;
  start_date: Date;
  end_date: Date;
}
export const createQueries = (pool: Pool) => {
  // 用于注册新用户。它接收用户名和密码作为参数，并返回插入的用户ID。
  const registerUser = async (
    username: string,
    password: string,
  ): Promise<number> => {
    const [rows] = await pool.query<ResultSetHeader>(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, password],
    );
    return rows.insertId;
  };

  // 用于验证用户登录。它接收用户名和密码作为参数，并返回匹配的用户对象。如果用户名和密码不匹配或用户不存在，则返回 null
  const loginUser = async (
    username: string,
    password: string,
  ): Promise<User | null> => {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM users WHERE username = ? AND password = ?",
      [username, password],
    );
    return rows.length ? (rows[0] as User) : null;
  };

  // 用于获取用户的聊天次数。它接收用户ID作为参数，并返回用户的聊天次数。
  const getChatCount = async (userId: number): Promise<number> => {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT trial_count FROM users WHERE id = ?",
      [userId],
    );
    return rows[0].trial_count;
  };

  // 用于购买聊天套餐。它接收用户ID和订阅选项ID作为参数，并将购买的订阅信息插入到 user_subscriptions 表中。
  const purchaseChatPackage = async (
    userId: number,
    subscriptionId: number,
  ): Promise<void> => {
    const subscriptionOption = await getSubscriptionOption(subscriptionId);
    if (!subscriptionOption) {
      throw new Error("Invalid subscription option");
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + subscriptionOption.duration);

    await pool.query(
      "INSERT INTO user_subscriptions (user_id, subscription_id, start_date, end_date) VALUES (?, ?, ?, ?)",
      [userId, subscriptionId, startDate, endDate],
    );
  };

  // 验证是否有当前套餐
  const getSubscriptionOption = async (
    subscriptionId: number,
  ): Promise<SubscriptionOption | null> => {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM subscription_options WHERE id = ?",
      [subscriptionId],
    );
    return rows.length ? (rows[0] as SubscriptionOption) : null;
  };

  // 用于获取用户的订阅信息。它接收用户ID作为参数，并返回用户的订阅信息数组。
  const getUserSubscriptions = async (
    userId: number,
  ): Promise<UserSubscription[]> => {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM user_subscriptions WHERE user_id = ?",
      [userId],
    );
    return rows as UserSubscription[];
  };

  return {
    registerUser,
    loginUser,
    getChatCount,
    purchaseChatPackage,
    getUserSubscriptions,
  };
};
