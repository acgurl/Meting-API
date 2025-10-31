import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import crypto from 'crypto-browserify'
import { Buffer } from 'buffer/index.js'

// NetEase crypto utilities (inline to avoid import issues)
const iv = Buffer.from('0102030405060708')
const presetKey = Buffer.from('0CoJUm6Qyw8W8jud')
const linuxapiKey = Buffer.from('rFgB&h#%2?^eDg:Q')
const base62 = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const publicKey =`-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDgtQn2JZ34ZC28NWYpAUd98iZ3
7BUrX/aKzmFbt7clFSs6sXqHauqKWqdtLkF2KexO40H1YTX8z2lSgBBOAxLsvakl
V8k4cBFK9snQXE9/DDaFt6Rr7iVZMldczhC0JNgTz+SHXT6CBHuX3e9SdB1Ua44o
ncaTWz7OBGLbCiK45wIDAQAB
-----END PUBLIC KEY-----
`
const eapiKey = 'e82ckenh8dichen8'

const aesEncrypt = (buffer, mode, key, iv) => {
  const cipher = crypto.createCipheriv('aes-128-' + mode, key, iv)
  return Buffer.concat([cipher.update(buffer), cipher.final()])
}

const rsaEncrypt = (buffer, key) => {
  buffer = Buffer.concat([Buffer.alloc(128 - buffer.length), buffer])
  return crypto.publicEncrypt(
    { key: key, padding: crypto.constants.RSA_NO_PADDING },
    buffer,
  )
}

const weapi = (object) => {
  const text = JSON.stringify(object)
  const secretKey = crypto
    .randomBytes(16)
    .map((n) => base62.charAt(n % 62).charCodeAt())
  return {
    params: aesEncrypt(
      Buffer.from(
        aesEncrypt(Buffer.from(text), 'cbc', presetKey, iv).toString('base64'),
      ),
      'cbc',
      secretKey,
      iv,
    ).toString('base64'),
    encSecKey: rsaEncrypt(secretKey.reverse(), publicKey).toString('hex'),
  }
}

const linuxapi = (object) => {
  const text = JSON.stringify(object)
  return {
    eparams: aesEncrypt(Buffer.from(text), 'ecb', linuxapiKey, '')
      .toString('hex')
      .toUpperCase(),
  }
}

const eapi = (url, object) => {
  const text = typeof object === 'object' ? JSON.stringify(object) : object
  const message = `nobody${url}use${text}md5forencrypt`
  const digest = crypto.createHash('md5').update(message).digest('hex')
  const data = `${url}-36cd479b6b5-${text}-36cd479b6b5-${digest}`
  return {
    params: aesEncrypt(Buffer.from(data), 'ecb', eapiKey, '')
      .toString('hex')
      .toUpperCase(),
  }
}

// Configuration
const get_runtime = () => {
  if (globalThis?.process?.env?.RUNTIME) {
    return globalThis?.process?.env?.RUNTIME
  }
  if (typeof globalThis?.EdgeRuntime === 'string') {
    return 'vercel'
  }
  if (globalThis?.process?.release?.name === 'node') {
    return 'node'
  }
  return 'edgeone'
}

const get_url = (ctx) => {
  const runtime = get_runtime()
  const perfix = ctx.req.header('X-Forwarded-Host') || ctx.req.header('X-Forwarded-Url')
  let req_url = perfix ? perfix + ctx.req.url.split('?')[0].substring(ctx.req.url.indexOf('/', 8)) : ctx.req.url.split('?')[0]
  if (!req_url.startsWith('http')) req_url = 'http://' + req_url
  if (runtime === 'vercel') req_url = req_url.replace('http://', 'https://')
  return req_url
}

let OVERSEAS = false
if (['cloudflare', 'vercel', 'edgeone'].includes(get_runtime())) OVERSEAS = true
const PORT = 3000

const config = { OVERSEAS, PORT }

// Utility functions
const format = (lyric, tlyric) => {
  const lyricArray = trimLyric(lyric)
  const tlyricArray = trimLyric(tlyric)
  if (tlyricArray.length === 0) {
    return lyric
  }
  const result = []
  for (let i = 0, j = 0; i < lyricArray.length && j < tlyricArray.length; i += 1) {
    const time = lyricArray[i].time
    let text = lyricArray[i].text
    while (time > tlyricArray[j].time && j + 1 < tlyricArray.length) {
      j += 1
    }
    if (time === tlyricArray[j].time && tlyricArray[j].text.length) {
      text = `${text} (${tlyricArray[j].text})`
    }
    result.push({ time, text })
  }
  return result
    .map(x => {
      const minus = Math.floor(x.time / 60000).toString().padStart(2, '0')
      const second = Math.floor((x.time % 60000) / 1000).toString().padStart(2, '0')
      const millisecond = Math.floor((x.time % 1000)).toString().padStart(3, '0')
      return `[${minus}:${second}.${millisecond}]${x.text}`
    })
    .join('\n')
}

const trimLyric = (lyric) => {
  const result = []
  const lines = lyric.split('\n')
  for (const line of lines) {
    const match = line.match(/^\[(\d{2}):(\d{2}\.\d*)\](.*)$/)
    if (match) {
      result.push({
        time: parseInt(parseInt(match[1], 10) * 60 * 1000 + parseFloat(match[2]) * 1000),
        text: match[3]
      })
    }
  }
  return result.sort((a, b) => a.time - b.time)
}

// Simple API response for testing
const simpleApiHandler = async (ctx) => {
  const query = ctx.req.query()
  const server = query.server || 'netease'
  const type = query.type || 'playlist'
  const id = query.id || '6907557348'

  // For now, return a simple test response
  return ctx.json({
    status: 200,
    message: 'Meting API is working on EdgeOne Pages',
    param: { server, type, id },
    timestamp: new Date().toISOString(),
    runtime: get_runtime(),
    overseas: config.OVERSEAS
  })
}

const templateHandler = (ctx) => {
  return ctx.html(`
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>测试页面</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .container { max-width: 800px; margin: 0 auto; }
            .status { color: green; font-weight: bold; }
            .error { color: red; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Meting API 测试页面</h1>
            <p class="status">✅ API 正在运行</p>
            <p><strong>版本：</strong> 1.1.2</p>
            <p><strong>运行环境：</strong> ${get_runtime()}</p>
            <p><strong>部署模式：</strong> ${config.OVERSEAS ? '海外' : '国内'}</p>
            <p><strong>当前时间：</strong> ${new Date().toLocaleString()}</p>

            <h2>API 测试</h2>
            <div id="test-results">
                <p>正在测试 API...</p>
            </div>

            <script>
                // Test API endpoints
                async function testAPI() {
                    const results = document.getElementById('test-results');
                    results.innerHTML = '<p>测试中...</p>';

                    try {
                        const response = await fetch('/api?server=netease&type=playlist&id=6907557348');
                        const data = await response.json();

                        if (data.status === 200) {
                            results.innerHTML = \`
                                <p class="status">✅ API 测试成功</p>
                                <pre>\${JSON.stringify(data, null, 2)}</pre>
                            \`;
                        } else {
                            results.innerHTML = \`<p class="error">❌ API 返回错误: \${data.message}</p>\`;
                        }
                    } catch (error) {
                        results.innerHTML = \`<p class="error">❌ API 测试失败: \${error.message}</p>\`;
                    }
                }

                // Run test on page load
                testAPI();
            </script>
        </div>
    </body>
    </html>
  `)
}

// Create Hono app
const app = new Hono()

app.use('*', cors())
app.use('*', logger())

app.get('/api', simpleApiHandler)
app.get('/test', templateHandler)

app.get('/', (c) => {
    return c.html(`
        <html>
            <head>
                <title>Meting正在运行</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 40px; }
                    .container { max-width: 800px; margin: 0 auto; }
                    a { color: #0366d6; text-decoration: none; }
                    a:hover { text-decoration: underline; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Meting API</h1>
                    <p>
                        <a href="https://github.com/xizeyoupan/Meting-API" style="text-decoration: none;">
                            <img alt="Static Badge" src="https://img.shields.io/badge/Github-Meting-green">
                            <img alt="GitHub forks" src="https://img.shields.io/github/forks/xizeyoupan/Meting-API">
                            <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/xizeyoupan/Meting-API">
                        </a>
                    </p>

                    <p>当前版本：1.1.2</p>
                    <p>当前运行环境：${get_runtime()}</p>
                    <p>当前时间：${new Date()}</p>
                    <p>内部端口：${config.PORT}</p>
                    <p>部署在大陆：${config.OVERSEAS ? '否' : '是'}</p>
                    <p>当前地址：<a>${c.req.url}</a></p>
                    <p>测试地址：<a href="${get_url(c) + 'test'}">${get_url(c) + 'test'}</a></p>
                    <p>api地址：<a href="${get_url(c) + 'api'}">${get_url(c) + 'api'}</a></p>
                </div>
            </body>
        </html>`
    )
})

export default async function onRequest(context) {
  const { request, env } = context;

  // 设置环境变量
  if (env.OVERSEAS) {
    globalThis.process = globalThis.process || {};
    globalThis.process.env = globalThis.process.env || {};
    globalThis.process.env.OVERSEAS = env.OVERSEAS;
  }
  if (env.PORT) {
    globalThis.process = globalThis.process || {};
    globalThis.process.env = globalThis.process.env || {};
    globalThis.process.env.PORT = env.PORT;
  }
  if (env.YT_API) {
    globalThis.process = globalThis.process || {};
    globalThis.process.env = globalThis.process.env || {};
    globalThis.process.env.YT_API = env.YT_API;
  }

  // 使用 Hono 应用处理请求
  return await app.fetch(request);
}