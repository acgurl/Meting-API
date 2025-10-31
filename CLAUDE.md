# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Meting-API is a unified music API service that provides a single interface to access multiple music streaming platforms (NetEase Cloud Music, QQ Music). It's built with Hono framework and optimized for EdgeOne Pages deployment.

## Development Commands

### Setup and Dependencies
```bash
npm i  # Install dependencies (requires Node.js >= 18)
```

### Building
```bash
npm run build  # Build for EdgeOne Pages deployment
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
- **`node-functions/[[default]].js`** - EdgeOne Pages Node Functions entry point
- **`src/`** - Core source code
  - **`service/api.js`** - API service layer
  - **`providers/`** - Music provider implementations (netease, tencent)
  - **`config.js`** - Configuration management
  - **`util.js`** - Utility functions

### Provider Pattern
Each music platform is implemented as a separate provider module in `src/providers/`. All providers follow a consistent interface, making it easy to add new music sources.

### API Pattern
The API follows a query-based pattern:
```
/api?server={platform}&type={action}&id={identifier}
```

Supported platforms: `netease`, `tencent`
Supported types: `song`, `playlist`, `artist`, `search`, `lyric`, `url`, `pic`

## Environment Configuration

- **OVERSEAS** - Enables overseas deployment mode for Tencent Music
- **YT_API** - YouTube Music API key (optional)

## Testing

Tests are located in `test/providers.test.js` and use Vitest framework. Tests validate provider support types and API endpoints with retry mechanisms and 10-minute timeouts for external API calls.

## Deployment

**EdgeOne Pages Only** - Tencent Cloud static hosting with Node functions support

## Regional Restrictions

- **NetEase Cloud Music** - Works globally
- **QQ Music** - Only works when accessed from China, requires OVERSEAS=1 and special frontend plugin for overseas deployment

## Build System

Uses simple Node.js script (`esbuild.config.js`) to copy node-functions to dist directory for EdgeOne Pages deployment.