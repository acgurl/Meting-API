// 最简单的 EdgeOne Pages 函数 - 避免所有可能的导入问题

export default async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  // 设置 CORS 头
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // 处理 OPTIONS 请求
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // 获取查询参数
  const server = url.searchParams.get('server') || 'netease';
  const type = url.searchParams.get('type') || 'playlist';
  const id = url.searchParams.get('id') || '6907557348';

  // 根据路径返回不同的响应
  if (url.pathname === '/api') {
    const response = {
      status: 200,
      message: 'Meting API is working on EdgeOne Pages',
      param: { server, type, id },
      timestamp: new Date().toISOString(),
      runtime: 'edgeone-pages',
      overseas: env.OVERSEAS || false,
      note: 'This is a simplified response. Full music API functionality will be implemented.'
    };

    return new Response(JSON.stringify(response, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }

  if (url.pathname === '/test') {
    const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Meting API 测试</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .container { max-width: 800px; margin: 0 auto; }
        .status { color: green; font-weight: bold; }
        .error { color: red; }
        pre { background: #f5f5f5; padding: 10px; border-radius: 5px; }
        .test-button { background: #0366d6; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎵 Meting API 测试页面</h1>
        <p class="status">✅ API 正在 EdgeOne Pages 上运行</p>

        <div style="background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>当前状态</h3>
            <p><strong>版本：</strong> 1.1.2</p>
            <p><strong>运行环境：</strong> EdgeOne Pages</p>
            <p><strong>部署模式：</strong> ${env.OVERSEAS ? '海外' : '国内'}</p>
            <p><strong>当前时间：</strong> ${new Date().toLocaleString()}</p>
        </div>

        <h2>API 测试</h2>
        <button class="test-button" onclick="testAPI()">测试 API</button>
        <div id="test-results">
            <p>点击按钮测试 API...</p>
        </div>

        <h2>使用说明</h2>
        <p>API 端点格式：</p>
        <pre>/api?server={platform}&type={action}&id={identifier}</pre>

        <p>支持的平台：</p>
        <ul>
            <li><strong>netease</strong> - 网易云音乐</li>
            <li><strong>tencent</strong> - QQ 音乐</li>
        </ul>

        <p>支持的类型：</p>
        <ul>
            <li><strong>playlist</strong> - 歌单</li>
            <li><strong>song</strong> - 歌曲</li>
            <li><strong>artist</strong> - 歌手</li>
            <li><strong>search</strong> - 搜索</li>
        </ul>

        <script>
            async function testAPI() {
                const results = document.getElementById('test-results');
                results.innerHTML = '<p>🔄 测试中...</p>';

                try {
                    const response = await fetch('/api?server=netease&type=playlist&id=6907557348');
                    const data = await response.json();

                    if (data.status === 200) {
                        results.innerHTML = \`
                            <div class="status">✅ API 测试成功</div>
                            <pre>\${JSON.stringify(data, null, 2)}</pre>
                            <p style="color: #666; font-size: 14px;">
                                注意：当前返回的是简化响应，完整功能正在开发中。
                            </p>
                        \`;
                    } else {
                        results.innerHTML = \`<div class="error">❌ API 返回错误: \${data.message}</div>\`;
                    }
                } catch (error) {
                    results.innerHTML = \`<div class="error">❌ API 测试失败: \${error.message}</div>\`;
                }
            }

            // 页面加载时自动测试
            window.addEventListener('load', testAPI);
        </script>
    </div>
</body>
</html>`;

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        ...corsHeaders
      }
    });
  }

  // 根路径
  const html = `<!DOCTYPE html>
<html>
<head>
    <title>Meting API</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .container { max-width: 800px; margin: 0 auto; }
        a { color: #0366d6; text-decoration: none; }
        a:hover { text-decoration: underline; }
        .status { color: green; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎵 Meting API</h1>
        <p class="status">✅ 正在 EdgeOne Pages 上运行</p>

        <div style="background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>部署信息</h3>
            <p><strong>版本：</strong> 1.1.2</p>
            <p><strong>运行环境：</strong> EdgeOne Pages</p>
            <p><strong>部署模式：</strong> ${env.OVERSEAS ? '海外' : '国内'}</p>
            <p><strong>当前时间：</strong> ${new Date().toLocaleString()}</p>
        </div>

        <h2>快速链接</h2>
        <p><a href="${url.origin}/test">🧪 测试页面</a></p>
        <p><a href="${url.origin}/api?server=netease&type=playlist&id=6907557348">🎵 API 示例</a></p>

        <h2>项目信息</h3>
        <p>
            <a href="https://github.com/xizeyoupan/Meting-API" style="text-decoration: none;">
                <img alt="Static Badge" src="https://img.shields.io/badge/Github-Meting-green">
                <img alt="GitHub forks" src="https://img.shields.io/github/forks/xizeyoupan/Meting-API">
                <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/xizeyoupan/Meting-API">
            </a>
        </p>
    </div>
</body>
</html>`;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      ...corsHeaders
    }
  });
}