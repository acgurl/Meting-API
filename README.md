# Meting-API

统一的音乐API服务，支持多个音乐流媒体平台，专为EdgeOne Pages部署优化。

## 功能特性

- JavaScript实现
- 插件系统，易于编写新接口及音源
- 支持EdgeOne Pages无服务器部署

## 支持平台

| 平台 | 参数 | 图片 | 歌词 | URL | 单曲 | 歌单 | 歌手 | 搜索 |
|------|------|------|------|-----|------|------|------|------|
| 网易云音乐 | netease | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| QQ音乐 | tencent | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ |

## 地区限制

### 海外部署

| 访问地区 | 国内 | 海外 |
|----------|------|------|
| 网易云音乐 | ✓ | ✓ |
| QQ音乐 | ✓¹ | ✗ |

### 国内部署

| 访问地区 | 国内 | 海外 |
|----------|------|------|
| 网易云音乐 | ✓ | ✓ |
| QQ音乐 | ✓ | ✗ |

¹ 使用jsonp，需要替换前端插件为 https://cdn.jsdelivr.net/npm/@xizeyoupan/meting@latest/dist/Meting.min.js

## 环境变量配置

- **OVERSEAS** - 国外部署模式（设为1启用QQ音乐的jsonp返回）
- **YT_API** - YouTube Music API密钥（可选）

## EdgeOne Pages 部署

1. 将项目推送到GitHub仓库
2. 在EdgeOne控制台中连接GitHub仓库
3. 配置构建命令：`npm run build`
4. 设置输出目录：`dist`
5. 设置Node.js版本：`20.18.0`
6. 配置环境变量（可选）

项目会自动部署Node函数，API路径为所有请求路径。

## API 使用

API遵循查询模式：

```
/api?server={platform}&type={action}&id={identifier}
```

**支持平台：** `netease`, `tencent`
**支持类型：** `song`, `playlist`, `artist`, `search`, `lyric`, `url`, `pic`

**示例：**
```
/api?server=netease&type=playlist&id=6907557348
/api?server=tencent&type=song&id=001Fdq2W1fPQ9V
```

## 前端集成

在导入前端插件前，设置API地址：

```javascript
<script>
var meting_api='https://your-domain.pages.dev/api?server=:server&type=:type&id=:id&auth=:auth&r=:r';
</script>
```

## 相关项目

- [MetingJS](https://github.com/xizeyoupan/MetingJS) - 前端插件
- [Hono](https://github.com/honojs/hono) - Web框架
- [NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi) - 网易云音乐API
- [QQMusicApi](https://github.com/jsososo/QQMusicApi) - QQ音乐API