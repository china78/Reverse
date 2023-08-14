import { createPool, Pool } from "mysql2/promise";
import { createQueries } from "./queries";

// 创建数据库连接池
const pool: Pool = createPool({
  host: "localhost",
  user: "root",
  password: "12345678",
  database: "chat_app",
});

// 创建查询方法
export const db = createQueries(pool);
