# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is Wyatt Johnson's personal portfolio website built with Next.js 15.3.0 (canary), React 19 (canary), and Tailwind CSS v4. The site features blog posts and GitHub repository showcases, with content managed through Notion databases.

## Development Commands

```bash
# Install dependencies (using Bun package manager)
bun install

# Start development server with Turbo
bun dev

# Build for production
bun build

# Start production server
bun start

# Run type checking (no unit tests configured)
bun test
```

## Architecture

### Data Flow
1. **Content Source**: Notion databases store blog posts and featured repositories
2. **Data Fetching**: Server Components fetch data using Notion API client
3. **Caching**: Uses Next.js `"use cache"` directive with "days" lifetime and cache tags (`notion`, `github`)
4. **Revalidation**: `/api/revalidate` endpoint allows cache purging with authentication

### Key Architectural Decisions
- **Server Components First**: All components are Server Components unless explicitly marked
- **Notion as CMS**: Two databases - blog posts (0b56732805064002a20bb6bb55da55eb) and repositories (b3ccd60d3267422a8c28e9f8044e036b)
- **Experimental Features**: PPR (Partial Pre-rendering) and dynamicIO enabled
- **No Client-Side State Management**: Relies on server-side rendering and caching

### Component Structure
- `app/`: Next.js App Router pages and layouts
- `components/`: Reusable components organized by feature (blog, github, notion, embeds)
- `lib/`: Data fetching utilities for Notion and GitHub APIs

### Environment Variables
Required for local development:
- `NOTION_TOKEN`: Notion API integration token
- `GITHUB_TOKEN`: GitHub personal access token for API requests
- `REVALIDATE_KEY`: Secret key for cache revalidation endpoint
- `ENABLE_DRAFT_MODE`: Optional boolean to show draft posts

### Styling
- Tailwind CSS v4 (latest version) with Typography plugin
- Custom layout CSS in `app/layout.css`
- Dark mode support built into design system