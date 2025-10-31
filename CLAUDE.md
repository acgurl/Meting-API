# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Meting-API is a unified music API service that provides a single interface to access multiple music streaming platforms (NetEase Cloud Music, QQ Music, YouTube Music, Spotify). It's built with Hono framework and supports multiple deployment environments (Node.js, Deno, Cloudflare Workers, Vercel).

## Development Commands

### Setup and Dependencies
```bash
npm i  # Install dependencies (requires Node.js >= 18)
```

### Building
```bash
npm run build:all  # Build for all runtimes using ESBuild
```

### Running Locally
```bash
npm run start:node    # Start Node.js server
npm run start:deno    # Start Deno server (deprecated)
```

### Testing
```bash
npm test  # Run tests with Vitest
```

### Version Management
```bash
npm run patch/minor/major  # Update version and push to git
```

## Architecture Overview

### Core Structure
- **`app.js`** - Main Hono application with routes (`/api`, `/test`, `/`)
- **`node.js`** - Node.js server entry point
- **`src/`** - Core source code
  - **`service/api.js`** - API service layer
  - **`providers/`** - Music provider implementations (netease, tencent, ytmusic, spotify)
  - **`config.js`** - Configuration management
  - **`util.js`** - Utility functions

### Provider Pattern
Each music platform is implemented as a separate provider module in `src/providers/`. All providers follow a consistent interface, making it easy to add new music sources.

### API Pattern
The API follows a query-based pattern:
```
/api?server={platform}&type={action}&id={identifier}
```

Supported platforms: `netease`, `tencent`, `ytmusic`, `spotify`
Supported types: `song`, `playlist`, `artist`, `search`, `lyric`, `url`, `pic`

## Environment Configuration

- **PORT** - API port (default: 3000)
- **OVERSEAS** - Enables overseas deployment mode for Tencent Music (auto-set on Vercel)
- **YT_API** - YouTube Music API key (optional)
- **UID/GID** - Docker user/group IDs (default: 1010)

## Testing

Tests are located in `test/providers.test.js` and use Vitest framework. Tests validate provider support types and API endpoints with retry mechanisms and 10-minute timeouts for external API calls.

## Deployment Options

1. **Manual** - Clone and run with Node.js
2. **Docker** - Using `intemd/meting-api:latest` image
3. **Vercel** - Serverless deployment (OVERSEAS automatically set to 1)
4. **EdgeOne Pages** - Tencent Cloud static hosting with Node functions support

## Regional Restrictions

- **NetEase Cloud Music** - Works globally
- **QQ Music** - Only works when accessed from China, requires OVERSEAS=1 and special frontend plugin for overseas deployment

## Build System

Uses ESBuild with custom configuration (`esbuild.config.js`) to create optimized builds for different runtimes:
- Cloudflare Workers (minified and full versions)
- Deno runtime with polyfills