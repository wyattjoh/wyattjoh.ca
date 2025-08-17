# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is Wyatt Johnson's personal portfolio website built with Next.js 15.4.0-canary.61, React 19.1.0, and Tailwind CSS v4.1.8. The site features blog posts and GitHub repository showcases, with content managed through Notion databases.

## Development Commands

```bash
# Install dependencies (using Bun package manager - requires v1.1.29+)
bun install

# Start development server with Turbo
bun dev

# Build for production
bun build

# Start production server
bun start

# Run type checking (no unit tests configured)
bun run test

# Lint code with Biome
bun lint
bun lint:fix

# Format code with Biome
bun format
```

## Architecture

### Data Flow
1. **Content Source**: Notion databases store blog posts and featured repositories
2. **Data Fetching**: Server Components fetch data using Notion API client with `server-only` imports
3. **Caching**: Uses Next.js `"use cache"` directive with "days" lifetime and cache tags (`notion`, `github`)
4. **Revalidation**: `/api/revalidate` endpoint allows cache purging with authentication

### Key Architectural Decisions
- **Server Components First**: All components are Server Components - no client components detected
- **Notion as CMS**: Two databases - blog posts (0b56732805064002a20bb6bb55da55eb) and repositories (b3ccd60d3267422a8c28e9f8044e036b)
- **Experimental Features**: PPR (Partial Pre-rendering) and dynamicIO enabled for optimal performance
- **No Client-Side State Management**: Relies entirely on server-side rendering and caching
- **Node.js Requirement**: ^22.11.0 or higher

### Component Patterns
- **Async Components**: All data-fetching components use async/await pattern
- **Suspense Boundaries**: Loading states with skeleton components (e.g., `GitHubRepositoriesSkeleton`)
- **Recursive Rendering**: Notion blocks rendered recursively with support for nested content
- **Static Generation**: Blog posts use `generateStaticParams` for build-time generation

### Notion Block Support
Supported block types:
- Paragraphs, headings (h1-h3), bulleted/numbered lists
- Code blocks with syntax highlighting (using `bright` with Nord theme)
- Rich text formatting (bold, italic, strikethrough, code)
- Links with proper external/internal handling
- Embeds: YouTube videos, Twitter posts, Apple Podcasts

### Code Quality
- **Biome**: Linting and formatting (replaced ESLint)
  - 80-character line width
  - Double quotes for strings
  - 2-space indentation
  - Trailing commas (ES5)
- **TypeScript**: Strict configuration with no unused variables/parameters
- **Git Integration**: VCS-aware with `.gitignore` respect

### Environment Variables
Required for local development:
- `NOTION_TOKEN`: Notion API integration token
- `GITHUB_TOKEN`: GitHub personal access token for API requests
- `REVALIDATE_KEY`: Secret key for cache revalidation endpoint
- `ENABLE_DRAFT_MODE`: Optional boolean to show draft posts

### Performance Optimizations
- AVIF image format for optimal compression
- Font optimization with Inter from Google Fonts
- Vercel Analytics and Speed Insights integration
- Image priority loading for above-the-fold content
- Proper meta tags and OpenGraph images for social sharing

### Component Structure
- `app/`: Next.js App Router pages and layouts
- `components/`: Reusable components organized by feature
  - `blog/`: Blog-specific components
  - `github/`: GitHub repository display components
  - `notion/`: Notion block rendering components
  - `embeds/`: Rich media embed components
- `lib/`: Data fetching utilities for Notion and GitHub APIs

### Styling System
- Tailwind CSS v4 with PostCSS configuration
- Typography plugin for prose content
- Custom CSS variables for spacing and typography scales
- Dark mode support with theme-aware gradients
- Interactive states and animations in `app/layout.css`
- **ALWAYS use `cn` utility for combining CSS classes conditionally instead of template literals**
  - Import: `import { cn } from "../lib/cn"`
  - Example: `className={cn("base-class", condition && "conditional-class", variable)}`
  - Avoid: `className={\`base-class ${condition ? 'conditional-class' : ''}\`}`