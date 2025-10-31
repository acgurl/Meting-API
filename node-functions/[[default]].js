import app from '../app.js';

export default async function onRequest(context) {
  const { request, env } = context;

  // 设置环境变量
  if (env.OVERSEAS) {
    process.env.OVERSEAS = env.OVERSEAS;
  }
  if (env.PORT) {
    process.env.PORT = env.PORT;
  }
  if (env.YT_API) {
    process.env.YT_API = env.YT_API;
  }

  // 使用 Hono 应用处理请求
  return await app.fetch(request);
}