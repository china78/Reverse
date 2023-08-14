// 导入所需的模块
const mysql = require("mysql2");
const util = require("util");

// 创建数据库连接池
const pool = mysql.createPool({
  host: "localhost", // 数据库主机名
  user: "root", // 数据库用户名
  password: "12345678", // 数据库密码
  database: "chat_app", // 数据库名称
});

// 使用连接池创建数据库连接
const connection = pool.getConnection();

// 将连接的 query 方法转换为 Promise 形式
const query = util.promisify(connection.query).bind(connection);

// 导出可供其他文件使用的数据库查询方法
module.exports = {
  query,
};
